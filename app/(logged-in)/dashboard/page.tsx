'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Plus, 
  Eye, 
  Download,
  Loader2,
  BarChart3,
  Upload
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface SummaryItem {
  id: string;
  title: string;
  slides: any[];
  metadata: any;
  created_at: string;
  original_filename: string;
  file_size: number;
  upload_timestamp: string;
}

interface DashboardData {
  user: any;
  summaries: SummaryItem[];
  isNewUser: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchDashboardData();
    }
  }, [isLoaded, clerkUser]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        
        // If new user, redirect to upload page
        if (result.data.isNewUser) {
          router.push('/upload');
          return;
        }
      } else {
        setError(result.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (summary: SummaryItem) => {
    const params = new URLSearchParams({
      title: summary.title,
      slides: JSON.stringify(summary.slides),
      fileName: summary.original_filename,
      pageCount: summary.metadata?.pageCount?.toString() || '0',
      wordCount: summary.metadata?.wordCount?.toString() || '0',
      processingTime: summary.metadata?.processingTime?.toString() || '0'
    });
    
    router.push(`/summary?${params.toString()}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading || !isLoaded) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No data available</h1>
          <Button onClick={() => router.push('/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Summary
          </Button>
        </div>
      </div>
    );
  }

  const { summaries } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-muted-foreground">AI-Powered PDF Summaries</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/upload')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload PDF
              </Button>
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaries.filter(s => {
                const summaryDate = new Date(s.created_at);
                const now = new Date();
                return summaryDate.getMonth() === now.getMonth() && 
                       summaryDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slides</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaries.reduce((acc, s) => acc + (s.slides?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summaries List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Summaries</h2>
        
        {summaries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No summaries yet</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-sm">
                Upload your first PDF to create an AI-powered summary and get started.
              </p>
              <Button onClick={() => router.push('/upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Summary
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map((summary) => (
              <Card key={summary.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2" title={summary.title}>
                    {summary.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="truncate">{summary.original_filename}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slides:</span>
                      <span className="font-medium">{summary.slides?.length || 0}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium">{formatFileSize(summary.file_size || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {formatDate(summary.created_at)}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewSummary(summary)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}