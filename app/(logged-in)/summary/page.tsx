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
      // Each slide comes as a JSON string containing an object with a 'slide' property
      slides = rawSlides.map((slideData: string) => {
        try {
          const parsed = JSON.parse(slideData);
          return parsed.slide || slideData;
        } catch {
          // If it's not a JSON string, return it as is
          return slideData;
        }
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

${summary.slides.map((slide, index) => `### Slide ${index + 1}\n\n${slide}`).join('\n\n')}
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
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Summary Slides</h2>
          <div className="text-sm text-muted-foreground">
            Slide {currentSlide + 1} of {summary.slides.length}
          </div>
        </div>

        {/* Slide content */}
        <div className="min-h-[400px] mb-6 slide-transition">
          <div className="max-w-none">
            <MarkdownRenderer 
              content={summary.slides[currentSlide]} 
              className="prose-lg slide-transition"
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
          >
            Previous
          </Button>

          {/* Slide indicators */}
          <div className="flex gap-2">
            {summary.slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted hover:bg-muted-foreground/20'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentSlide(Math.min(summary.slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === summary.slides.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
