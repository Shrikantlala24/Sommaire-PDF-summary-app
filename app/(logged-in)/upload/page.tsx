'use client'

import { useState } from 'react'
import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { UploadDropzone } from '../../../lib/uploadthing'

interface UploadedFile {
  name: string
  url: string
  size: number
  key: string
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUploadComplete = (res: any) => {
    if (res) {
      const newFiles = res.map((file: any) => ({
        name: file.name,
        url: file.url,
        size: file.size,
        key: file.key,
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
      console.log('Upload complete, files:', res)
      console.log('File URLs for processing:', res.map((f: any) => ({ name: f.name, url: f.url, key: f.key })))
    }
  }

  const handleProcessDocuments = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true)
    
    try {
      // Process each PDF file
      for (const file of uploadedFiles) {
        console.log(`Processing file: ${file.name} with URL: ${file.url}`)
        
        const response = await fetch('/api/process-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileKey: file.key }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Processing result for ${file.name}:`, result);
        } else {
          const error = await response.json();
          console.error(`Error processing ${file.name}:`, error);
        }
      }
      
      alert('Documents processed successfully! Check console for details.')
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error processing documents. Check console for details.')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (key: string) => {
    setUploadedFiles(prev => prev.filter(file => file.key !== key))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sommaire</h1>
              </div>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your Documents
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your PDF documents to create beautiful visual summaries with AI.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <UploadDropzone
              endpoint="pdfUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
              appearance={{
                container: "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500",
                uploadIcon: "text-blue-600 dark:text-blue-400 mb-4",
                label: "text-gray-900 dark:text-white text-lg font-semibold mb-2",
                allowedContent: "text-gray-500 dark:text-gray-400 text-sm",
                button: "inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm ut-ready:bg-blue-600 ut-uploading:bg-blue-500",
              }}
            />
          </div>
        </div>

        {/* Document Upload Alternative */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Or upload text documents
            </h3>
            <UploadDropzone
              endpoint="documentUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
              appearance={{
                container: "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-green-400 dark:hover:border-green-500",
                uploadIcon: "text-green-600 dark:text-green-400 mb-4",
                label: "text-gray-900 dark:text-white text-base font-medium mb-2",
                allowedContent: "text-gray-500 dark:text-gray-400 text-sm",
                button: "inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm ut-ready:bg-green-600 ut-uploading:bg-green-500",
              }}
            />
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Uploaded Files ({uploadedFiles.length})
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.key}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View file
                    </a>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <button
                      onClick={() => removeFile(file.key)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 flex justify-center space-x-4">
            <button 
              onClick={handleProcessDocuments}
              disabled={isProcessing}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Documents...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Process Documents ({uploadedFiles.length})
                </>
              )}
            </button>

            <button 
              onClick={() => {
                if (uploadedFiles.length > 0) {
                  const file = uploadedFiles[0];
                  fetch('/api/test-langchain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileUrl: file.url, fileName: file.name }),
                  })
                  .then(res => res.json())
                  .then(data => {
                    console.log('🧪 LangChain Test Result:', data);
                    if (data.success) {
                      alert(`✅ LangChain Test Successful!\n\n📊 Results:\n- ${data.results.totalPages} pages processed\n- ${data.results.chunksCreated} text chunks created\n- ${data.results.wordCount} words extracted\n- Processing time: ${data.results.processingTime}ms\n\nCheck console for detailed results!`);
                    } else {
                      alert(`❌ Test Failed: ${data.details}`);
                    }
                  })
                  .catch(err => {
                    console.error('LangChain test error:', err);
                    alert('❌ Test request failed. Check console for details.');
                  });
                }
              }}
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Test LangChain Integration
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
