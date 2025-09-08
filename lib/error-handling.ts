// Error types for the application
export enum ErrorType {
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  FILE_TYPE_ERROR = 'FILE_TYPE_ERROR',
  FILE_SIZE_ERROR = 'FILE_SIZE_ERROR',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class AppError extends Error {
  public type: ErrorType;
  public statusCode: number;
  public userMessage: string;

  constructor(
    type: ErrorType,
    message: string,
    userMessage: string,
    statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}

// File validation utilities
export class FileValidator {
  private static readonly MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB
  private static readonly ALLOWED_TYPES = ['application/pdf'];
  private static readonly ALLOWED_EXTENSIONS = ['.pdf'];

  static validateFile(file: File): void {
    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(
        ErrorType.FILE_TYPE_ERROR,
        `Invalid file type: ${file.type}`,
        'Please upload only PDF files.',
        400
      );
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new AppError(
        ErrorType.FILE_TYPE_ERROR,
        `Invalid file extension: ${extension}`,
        'Please upload only PDF files.',
        400
      );
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new AppError(
        ErrorType.FILE_SIZE_ERROR,
        `File size ${file.size} exceeds maximum ${this.MAX_FILE_SIZE}`,
        `File size must be less than ${this.formatFileSize(this.MAX_FILE_SIZE)}.`,
        400
      );
    }

    // Check if file has content
    if (file.size === 0) {
      throw new AppError(
        ErrorType.FILE_SIZE_ERROR,
        'Empty file uploaded',
        'The uploaded file is empty. Please select a valid PDF file.',
        400
      );
    }
  }

  private static getFileExtension(filename: string): string {
    return filename.toLowerCase().substring(filename.lastIndexOf('.'));
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// API error handler
export class ApiErrorHandler {
  static handleError(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new AppError(
        ErrorType.NETWORK_ERROR,
        'Network request failed',
        'Unable to connect to the server. Please check your internet connection and try again.',
        0
      );
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new AppError(
        ErrorType.NETWORK_ERROR,
        'Request timeout',
        'The request is taking too long. Please try again.',
        408
      );
    }

    // Authentication errors
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return new AppError(
        ErrorType.AUTHENTICATION_ERROR,
        'Authentication failed',
        'Please sign in again to continue.',
        401
      );
    }

    // Default error
    return new AppError(
      ErrorType.API_ERROR,
      error.message || 'Unknown API error',
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}

// Retry utility for failed operations
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry on certain error types
        if (error instanceof AppError) {
          if ([
            ErrorType.FILE_TYPE_ERROR,
            ErrorType.FILE_SIZE_ERROR,
            ErrorType.AUTHENTICATION_ERROR
          ].includes(error.type)) {
            throw error;
          }
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }

    throw lastError!;
  }
}

// Loading states management
export enum LoadingState {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  SUMMARIZING = 'summarizing',
  COMPLETE = 'complete',
  ERROR = 'error',
}

export const LoadingMessages = {
  [LoadingState.IDLE]: '',
  [LoadingState.UPLOADING]: 'Uploading your PDF...',
  [LoadingState.PROCESSING]: 'Processing PDF content...',
  [LoadingState.SUMMARIZING]: 'Generating AI summary...',
  [LoadingState.COMPLETE]: 'Complete!',
  [LoadingState.ERROR]: 'An error occurred',
};

// File cleanup utilities
export class FileCleanupService {
  private static readonly CLEANUP_DELAY = 24 * 60 * 60 * 1000; // 24 hours

  static scheduleCleanup(fileKey: string, fileUrl: string): void {
    setTimeout(async () => {
      try {
        await this.deleteFile(fileKey, fileUrl);
        console.log(`🧹 Cleaned up file: ${fileKey}`);
      } catch (error) {
        console.error(`❌ Failed to cleanup file ${fileKey}:`, error);
      }
    }, this.CLEANUP_DELAY);
  }

  private static async deleteFile(fileKey: string, fileUrl: string): Promise<void> {
    // This would integrate with UploadThing's deletion API
    // For now, we just log the cleanup action
    console.log(`Would delete file: ${fileKey} (${fileUrl})`);
    
    // TODO: Implement actual file deletion
    // const response = await fetch(`/api/uploadthing/delete`, {
    //   method: 'DELETE',
    //   body: JSON.stringify({ fileKey }),
    // });
  }
}

// Progress tracking for long operations
export class ProgressTracker {
  private callbacks: Set<(progress: number, message: string) => void> = new Set();

  subscribe(callback: (progress: number, message: string) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  updateProgress(progress: number, message: string): void {
    this.callbacks.forEach(callback => callback(progress, message));
  }

  complete(): void {
    this.updateProgress(100, 'Complete!');
  }

  error(message: string): void {
    this.updateProgress(0, message);
  }
}
