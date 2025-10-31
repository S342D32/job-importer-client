'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ImportLog {
  _id: string;
  fileName: string;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
  timestamp: string;
}

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [queueStats, setQueueStats] = useState<QueueStats>({ 
    waiting: 0, 
    active: 0, 
    completed: 0, 
    failed: 0 
  });

  useEffect(() => {
    setMounted(true); // Prevent hydration mismatch
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetchLogs();
    fetchQueueStats();

    // Refresh logs every 10 seconds
    const interval = setInterval(() => {
      fetchLogs();
      fetchQueueStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [mounted]);

  const fetchLogs = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/api/import-logs`, {
        timeout: 5000,
      });
      setLogs(res.data.data || []);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch import logs';
      setError(errorMessage);
      console.error('Error fetching logs:', err);
      setLoading(false);
    }
  };

  const fetchQueueStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/queue-stats`, {
        timeout: 5000,
      });
      if (res.data.success) {
        setQueueStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching queue stats:', err);
    }
  };

  const triggerImport = async () => {
    try {
      setTriggering(true);
      setError(null);
      const res = await axios.post(`${API_URL}/api/trigger-import`, {}, {
        timeout: 5000,
      });
      alert('✅ Import triggered successfully!');
      // Refresh immediately
      setTimeout(() => {
        fetchLogs();
        fetchQueueStats();
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to trigger import';
      alert(`❌ Error: ${errorMessage}`);
      setError(errorMessage);
      console.error('Error triggering import:', err);
    } finally {
      setTriggering(false);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Job Import History</h1>
              <p className="text-sm text-slate-600 mt-1">Monitor job import queue and processing</p>
            </div>
            <button
              onClick={triggerImport}
              disabled={triggering}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {triggering ? 'Processing...' : '🚀 Trigger Import'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              <strong>⚠️ Error:</strong> {error}
            </p>
            <p className="text-red-600 text-xs mt-1">
              Make sure your backend server is running at: <code>{API_URL}</code>
            </p>
          </div>
        )}

        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-orange-600">{queueStats.waiting}</div>
            <div className="text-sm text-slate-600">Waiting Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">{queueStats.active}</div>
            <div className="text-sm text-slate-600">Active Jobs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-green-600">{queueStats.completed}</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-red-600">{queueStats.failed}</div>
            <div className="text-sm text-slate-600">Failed</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin">
                <div className="text-slate-400">⏳ Loading import history...</div>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No import logs yet. Click "Trigger Import" to start.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">New</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Failed</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium max-w-xs truncate">
                        {log.fileName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">
                        {log.totalImported}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          {log.newJobs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {log.updatedJobs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          {log.failedJobs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            💡 <strong>Info:</strong> Import runs automatically every 1 minute. Queue stats auto-refresh every 10 seconds.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            🔗 API URL: <code className="bg-white px-2 py-1 rounded">{API_URL}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
