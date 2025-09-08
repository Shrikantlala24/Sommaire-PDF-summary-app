'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, AlertTriangle, Loader2, X, Upload, Trash2 } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { UploadDropzone } from '../../../lib/uploadthing'
import { 
  AppError, 
  ErrorType, 
  FileValidator, 
  ApiErrorHandler, 
  RetryHandler,
  LoadingState,
  LoadingMessages,
  ProgressTracker 
} from '@/lib/error-handling'

interface UploadedFile {
  name: string
  url: string
  size: number
  key: string
}

interface ErrorState {
  message: string
  type: ErrorType
  retryable: boolean
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE)
  const [error, setError] = useState<ErrorState | null>(null)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const router = useRouter();

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const clearError = () => setError(null)

  const showError = (error: AppError) => {
    setError({
      message: error.userMessage,
      type: error.type,
      retryable: ![ErrorType.FILE_TYPE_ERROR, ErrorType.FILE_SIZE_ERROR].includes(error.type)
    })
  }

  const handleUploadComplete = (res: any) => {
    if (res && res.length > 0) {
      try {
        const newFiles = res.map((file: any) => {
          // Validate uploaded file
          if (!file.name.toLowerCase().endsWith('.pdf')) {
            throw new AppError(
              ErrorType.FILE_TYPE_ERROR,
              'Invalid file type',
              'Only PDF files are allowed.',
              400
            );
          }

          return {
            name: file.name,
            url: file.url,
            size: file.size,
            key: file.key,
          };
        });

        setUploadedFiles(prev => [...prev, ...newFiles])
        setLoadingState(LoadingState.IDLE)
        clearError()
        
        console.log('✅ Upload complete:', newFiles)
      } catch (err) {
        const appError = err instanceof AppError ? err : ApiErrorHandler.handleError(err)
        showError(appError)
        setLoadingState(LoadingState.ERROR)
      }
    }
  }

  const handleUploadError = (error: Error) => {
    const appError = ApiErrorHandler.handleError(error)
    showError(appError)
    setLoadingState(LoadingState.ERROR)
  }

  const handleProcessDocuments = async () => {
    if (uploadedFiles.length === 0) return;
    
    const file = uploadedFiles[0];
    const progressTracker = new ProgressTracker();
    
    // Subscribe to progress updates
    const unsubscribe = progressTracker.subscribe((progress, message) => {
      setProgress(progress)
      setProgressMessage(message)
    });

    try {
      setLoadingState(LoadingState.PROCESSING)
      clearError()
      progressTracker.updateProgress(10, 'Starting PDF processing...')

      console.log(`🔄 Starting full processing for: ${file.name}`)
      
      const processWithRetry = () => 
        fetch('/api/process-and-summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileKey: file.key }),
        });

      progressTracker.updateProgress(30, 'Processing PDF content...')
      const response = await RetryHandler.withRetry(processWithRetry, 2, 2000);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new AppError(
          ErrorType.PROCESSING_ERROR,
          `HTTP ${response.status}: ${errorData.error}`,
          errorData.details || 'Failed to process the document. Please try again.',
          response.status
        );
      }

      progressTracker.updateProgress(70, 'Generating AI summary...')
      const result = await response.json();
      
      if (!result.success || !result.summary) {
        throw new AppError(
          ErrorType.API_ERROR,
          'Invalid response format',
          'The server returned an invalid response. Please try again.',
          500
        );
      }

      progressTracker.updateProgress(90, 'Preparing summary...')
      
      console.log('✅ Processing successful:', result)
      
      // Redirect to summary page with the results
      const params = new URLSearchParams({
        title: result.summary.title,
        slides: JSON.stringify(result.summary.slides),
        fileName: result.summary.metadata.fileName,
        pageCount: result.summary.metadata.pageCount.toString(),
        wordCount: result.summary.metadata.wordCount.toString(),
        processingTime: result.summary.metadata.processingTime.toString()
      });
      
      progressTracker.complete()
      setLoadingState(LoadingState.COMPLETE)
      
      // Small delay before redirect to show completion
      setTimeout(() => {
        router.push(`/summary?${params.toString()}`);
      }, 1000)
      
    } catch (err) {
      const appError = err instanceof AppError ? err : ApiErrorHandler.handleError(err)
      console.error('❌ Processing error:', appError)
      showError(appError)
      setLoadingState(LoadingState.ERROR)
      progressTracker.error(appError.userMessage)
    } finally {
      unsubscribe()
    }
  }

  const retryProcessing = async () => {
    await handleProcessDocuments()
  }

  const removeFile = (key: string) => {
    setUploadedFiles(prev => prev.filter(file => file.key !== key))
    if (uploadedFiles.length === 1) {
      setLoadingState(LoadingState.IDLE)
      clearError()
    }
  }

  const isProcessing = [LoadingState.PROCESSING, LoadingState.SUMMARIZING].includes(loadingState)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Upload Document
              </h1>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your PDF Document
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your PDF documents to create beautiful visual summaries with AI.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  {error.type === ErrorType.FILE_TYPE_ERROR ? 'Invalid File Type' :
                   error.type === ErrorType.FILE_SIZE_ERROR ? 'File Size Error' :
                   error.type === ErrorType.NETWORK_ERROR ? 'Connection Error' :
                   'Processing Error'}
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error.message}</p>
                {error.retryable && (
                  <button
                    onClick={retryProcessing}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
              <button onClick={clearError} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <UploadDropzone
              endpoint="pdfUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onUploadBegin={() => setLoadingState(LoadingState.UPLOADING)}
              appearance={{
                container: "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500",
                uploadIcon: "text-blue-600 dark:text-blue-400 mb-4",
                label: "text-gray-900 dark:text-white text-lg font-semibold mb-2",
                allowedContent: "text-gray-500 dark:text-gray-400 text-sm",
                button: "inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm ut-ready:bg-blue-600 ut-uploading:bg-blue-500",
              }}
            />
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              <strong>PDF files only.</strong> Maximum file size: 32MB
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {LoadingMessages[loadingState]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {progressMessage}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {progress}% complete
            </p>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                {loadingState === LoadingState.IDLE && (
                  <button
                    onClick={handleProcessDocuments}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Process & Summarize
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={file.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {loadingState === LoadingState.COMPLETE && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {!isProcessing && (
                        <button
                          onClick={() => removeFile(file.key)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
