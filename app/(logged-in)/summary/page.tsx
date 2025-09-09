'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Download, ArrowLeft, BarChart3, Clock, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer, markdownToPlainText } from '@/components/MarkdownRenderer';

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const summary = useMemo(() => {
    const title = searchParams.get('title');
    const fileName = searchParams.get('fileName');
    const pageCount = searchParams.get('pageCount');
    const wordCount = searchParams.get('wordCount');
    const processingTime = searchParams.get('processingTime');
    
    let slides: string[] = [];
    try {
      const rawSlides = JSON.parse(searchParams.get('slides') || '[]');
      // Handle different slide data formats
      slides = rawSlides.map((slideData: any) => {
        if (typeof slideData === 'string') {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(slideData);
            // Check if it has a 'slide' property (new format)
            if (parsed.slide) {
              return parsed.slide;
            }
            // Check if it has 'title' and 'content' properties (old format)
            if (parsed.title && parsed.content) {
              return `# ${parsed.title}\n\n${parsed.content}`;
            }
            // If it's a parsed object but doesn't match expected format, stringify it
            return typeof parsed === 'object' ? JSON.stringify(parsed) : parsed;
          } catch {
            // If parsing fails, treat as plain markdown
            return slideData;
          }
        } else if (typeof slideData === 'object') {
          // Direct object format
          if (slideData.slide) {
            return slideData.slide;
          }
          if (slideData.title && slideData.content) {
            return `# ${slideData.title}\n\n${slideData.content}`;
          }
          // Fallback: stringify the object
          return JSON.stringify(slideData);
        }
        // Fallback: convert to string
        return String(slideData);
      });
    } catch {
      slides = [];
    }
    
    if (title && slides.length) {
      return { 
        title, 
        fileName, 
        pageCount: pageCount ? parseInt(pageCount) : undefined,
        wordCount: wordCount ? parseInt(wordCount) : undefined,
        processingTime: processingTime ? parseInt(processingTime) : undefined,
        slides 
      };
    }
    
    return null;
  }, [searchParams]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const exportToMarkdown = () => {
    if (!summary) return;
    
    const markdown = `# ${summary.title}

${summary.fileName ? `**File:** ${summary.fileName}` : ''}
${summary.pageCount ? `**Pages:** ${summary.pageCount}` : ''}
${summary.wordCount ? `**Words:** ${summary.wordCount}` : ''}
${summary.processingTime ? `**Processing Time:** ${summary.processingTime}ms` : ''}

## Summary

${summary.slides.map((slide) => slide).join('\n\n---\n\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^a-zA-Z0-9]/g, '_')}_summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!summary) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No summary found</h1>
          <p className="text-muted-foreground">
            Please upload and process a PDF to view its summary.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-foreground">Summary View</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportToMarkdown} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Title and Metadata Cards */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{summary.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {summary.fileName && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">File</p>
                      <p className="text-xs text-muted-foreground truncate">{summary.fileName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {summary.pageCount && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pages</p>
                      <p className="text-xs text-muted-foreground">{summary.pageCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {summary.wordCount && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Words</p>
                      <p className="text-xs text-muted-foreground">{summary.wordCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {summary.processingTime && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Processing</p>
                      <p className="text-xs text-muted-foreground">{summary.processingTime}ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Enhanced Carousel */}
        <Card className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Summary Content
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  Slide {currentSlide + 1} of {summary.slides.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Slide content with enhanced styling */}
            <div className="min-h-[600px] mb-8">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border shadow-inner">
                <MarkdownRenderer 
                  content={summary.slides[currentSlide]} 
                  className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
                />
              </div>
            </div>

            {/* Enhanced navigation */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <Button
                variant={currentSlide === 0 ? "ghost" : "default"}
                size="lg"
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-8 py-3 font-medium"
              >
                ← Previous
              </Button>

              {/* Enhanced slide indicators */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm">
                  {summary.slides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-125 shadow-md'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {currentSlide + 1} / {summary.slides.length}
                </span>
              </div>

              <Button
                variant={currentSlide === summary.slides.length - 1 ? "ghost" : "default"}
                size="lg"
                onClick={() => setCurrentSlide(Math.min(summary.slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === summary.slides.length - 1}
                className="px-8 py-3 font-medium"
              >
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
