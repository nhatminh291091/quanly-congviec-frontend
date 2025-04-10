import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';
import { apiService } from '../services/api';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        const data = await apiService.get('api/tasks/upcoming');
        if (Array.isArray(data)) {
          const formatted = data.map((item, index) => ({
            id: index + 1,
            title: item.tenCongViec,
            field: item.linhVuc,
            dueDate: formatDate(item.thoiGianHoanThanh),
            status: 'Theo tiến độ',
            assignee: ''
          }));
          setUpcomingTasks(formatted);
        } else {
          setUpcomingTasks([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc sắp đến hạn:', error);
        setUpcomingTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingTasks();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${day}/${month}/${year}`;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b-4 border-blue-600">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button onClick={toggleSidebar} className="text-blue-600 font-medium hover:underline">
            {sidebarOpen ? 'Ẩn menu' : 'Hiện menu'}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Công việc sắp đến hạn</h2>
          {isLoading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : upcomingTasks.length === 0 ? (
            <p className="text-gray-500 italic">Không có công việc nào sắp đến hạn.</p>
          ) : (
            <div className="overflow-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">STT</th>
                    <th className="py-2 px-4 text-left">Tên công việc</th>
                    <th className="py-2 px-4 text-left">Lĩnh vực</th>
                    <th className="py-2 px-4 text-left">Thời gian hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTasks.map((task, index) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{task.title}</td>
                      <td className="py-2 px-4">{task.field}</td>
                      <td className="py-2 px-4">{task.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-700">Thống kê công việc</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={upcomingTasks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="id" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
