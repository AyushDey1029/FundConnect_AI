import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await adminService.getReports();
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await adminService.resolveReport(id);
      toast.success('Report resolved');
      fetchReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  if (loading) return <div className="text-gray-500 dark:text-gray-400 p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Reports</h1>

      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Reported Item</th>
                <th className="px-4 py-3 font-medium">Reported By</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium capitalize">{r.onModel}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={r.reason}>{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${r.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}
                    `}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status !== 'resolved' && (
                      <Button variant="outline" size="sm" onClick={() => handleResolve(r._id)}>
                        Resolve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;
