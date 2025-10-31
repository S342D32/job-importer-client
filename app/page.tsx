'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/import-logs`);
      setLogs(res.data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerImport = async () => {
    try {
      await axios.post(`${API_URL}/api/trigger-import`);
      alert('Import triggered successfully!');
      setTimeout(fetchLogs, 2000);
    } catch (error) {
      alert('Error triggering import');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Job Import History</h1>
      <button 
        onClick={triggerImport} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Trigger Manual Import
      </button>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">File Name</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">New</th>
              <th className="border p-2">Updated</th>
              <th className="border p-2">Failed</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="border p-2 text-sm">{log.fileName}</td>
                <td className="border p-2 text-center">{log.totalImported}</td>
                <td className="border p-2 text-center text-green-600">{log.newJobs}</td>
                <td className="border p-2 text-center text-blue-600">{log.updatedJobs}</td>
                <td className="border p-2 text-center text-red-600">{log.failedJobs}</td>
                <td className="border p-2 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
