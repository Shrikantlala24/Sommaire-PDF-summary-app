'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer, markdownToPlainText } from '@/components/MarkdownRenderer';

export default function SummaryPage() {
  const searchParams = useSearchParams();
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
    <div className="container mx-auto px-6 py-8">
      {/* Header with title and export button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{summary.title}</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            {summary.fileName && <p>File: {summary.fileName}</p>}
            {summary.pageCount && <p>Pages: {summary.pageCount}</p>}
            {summary.wordCount && <p>Words: {summary.wordCount}</p>}
            {summary.processingTime && <p>Processing time: {summary.processingTime}ms</p>}
          </div>
        </div>
        <Button onClick={exportToMarkdown} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Markdown
        </Button>
      </div>

      {/* Carousel */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Summary Content</h2>
          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {currentSlide + 1} of {summary.slides.length}
          </div>
        </div>

        {/* Slide content with better styling */}
        <div className="min-h-[500px] mb-8">
          <div className="max-w-none bg-background/50 rounded-lg p-6 border">
            <MarkdownRenderer 
              content={summary.slides[currentSlide]} 
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground"
            />
          </div>
        </div>

        {/* Enhanced navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="default"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-6"
          >
            ← Previous
          </Button>

          {/* Slide indicators with better design */}
          <div className="flex gap-1 bg-muted/30 p-2 rounded-full">
            {summary.slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => setCurrentSlide(Math.min(summary.slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === summary.slides.length - 1}
            className="px-6"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
