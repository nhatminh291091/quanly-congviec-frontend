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
        const formatted = data.map((item, index) => ({
          id: index + 1,
          title: item.tenCongViec,
          field: item.linhVuc,
          dueDate: formatDate(item.thoiGianHoanThanh),
          status: 'Theo tiến độ',
          assignee: ''
        }));
        setUpcomingTasks(formatted);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc sắp đến hạn:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingTasks();
  }, []);

  const formatDate = (dateStr) => {
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
          <button onClick={toggleSidebar} className="text-blue-600">
            {sidebarOpen ? 'Ẩn menu' : 'Hiện menu'}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Công việc sắp đến hạn</h2>
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">STT</th>
                  <th className="py-2 px-4 border-b">Tên công việc</th>
                  <th className="py-2 px-4 border-b">Lĩnh vực</th>
                  <th className="py-2 px-4 border-b">Thời gian hoàn thành</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{task.title}</td>
                    <td className="py-2 px-4 border-b">{task.field}</td>
                    <td className="py-2 px-4 border-b text-center">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="text-xl font-semibold mt-8 mb-4">Thống kê công việc</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={upcomingTasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="field" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="id" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
