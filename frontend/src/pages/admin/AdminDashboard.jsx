import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { Card } from '../../components/ui/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500 dark:text-gray-400 p-4">Loading...</div>;
  if (!stats) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Failed to load stats.</div>;

  const { stats: numbers, recentCampaigns, recentUsers } = stats;

  const statCards = [
    { title: 'Total Users', value: numbers.usersCount },
    { title: 'Total Campaigns', value: numbers.campaignsCount },
    { title: 'Active Campaigns', value: numbers.activeCampaignsCount },
    { title: 'Total Raised', value: `₹${numbers.donationsTotal.toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-6 flex flex-col justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Goal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentCampaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium truncate max-w-[150px]">{c.title}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">₹{c.goalAmount}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 capitalize">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
