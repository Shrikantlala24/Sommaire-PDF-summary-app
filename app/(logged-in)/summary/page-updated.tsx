'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      slides = JSON.parse(searchParams.get('slides') || '[]');
    } catch {
      slides = [];
    }
    
    if (title && slides.length) {
      return { 
        title, 
        slides, 
        metadata: {
          fileName,
          pageCount: pageCount ? parseInt(pageCount) : null,
          wordCount: wordCount ? parseInt(wordCount) : null,
          processingTime: processingTime ? parseInt(processingTime) : null
        }
      };
    }
    
    // fallback to mock data
    return {
      title: 'Sample PDF Summary',
      slides: [
        'This is the first summary slide. It covers the introduction and main points.',
        'Second slide: Key findings and analysis are presented here.',
        'Third slide: Conclusions and recommendations are summarized.',
      ],
      metadata: {
        fileName: null,
        pageCount: null,
        wordCount: null,
        processingTime: null
      }
    };
  }, [searchParams]);

  const handleExport = () => {
    if (!summary) return;
    let md = `# ${summary.title}\n\n`;
    
    // Add metadata if available
    if (summary.metadata.fileName) {
      md += `**Source:** ${summary.metadata.fileName}\n`;
    }
    if (summary.metadata.pageCount) {
      md += `**Pages:** ${summary.metadata.pageCount}\n`;
    }
    if (summary.metadata.wordCount) {
      md += `**Words:** ${summary.metadata.wordCount}\n`;
    }
    if (summary.metadata.processingTime) {
      md += `**Processing Time:** ${summary.metadata.processingTime}ms\n`;
    }
    
    md += '\n---\n\n';
    md += summary.slides.map((s, i) => `## Slide ${i + 1}\n\n${s}`).join('\n\n');
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {summary.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            AI-generated summary with interactive slides
          </p>
          
          {/* Metadata display */}
          {(summary.metadata.fileName || summary.metadata.pageCount || summary.metadata.wordCount) && (
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  {summary.metadata.fileName && (
                    <span>📄 {summary.metadata.fileName}</span>
                  )}
                  {summary.metadata.pageCount && (
                    <span>📖 {summary.metadata.pageCount} pages</span>
                  )}
                  {summary.metadata.wordCount && (
                    <span>📝 {summary.metadata.wordCount} words</span>
                  )}
                  {summary.metadata.processingTime && (
                    <span>⚡ {summary.metadata.processingTime}ms</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <Carousel slides={summary.slides} />
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Download className="h-5 w-5" /> Export as Markdown
          </Button>
        </div>
      </div>
    </div>
  );
}

function Carousel({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);
  if (!slides.length) return null;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 min-h-[200px] shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {slides[current]}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setCurrent((c) => Math.max(0, c - 1))} 
          disabled={current === 0}
          className="px-6"
        >
          Previous
        </Button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Slide {current + 1} of {slides.length}
          </span>
          <div className="flex space-x-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === current 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))} 
          disabled={current === slides.length - 1}
          className="px-6"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
