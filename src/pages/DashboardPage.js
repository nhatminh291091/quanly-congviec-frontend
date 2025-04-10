import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { apiService } from '../services/api';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const data = await apiService.get('api/tasks/all');
        setTaskList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error);
        setTaskList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

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
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Danh sách công việc được giao</h2>
          {isLoading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : taskList.length === 0 ? (
            <p className="text-gray-500 italic">Không có dữ liệu công việc.</p>
          ) : (
            <div className="overflow-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">STT</th>
                    <th className="py-2 px-4 text-left">Tên công việc</th>
                    <th className="py-2 px-4 text-left">Lĩnh vực</th>
                    <th className="py-2 px-4 text-left">Tiến độ</th>
                    <th className="py-2 px-4 text-left">Người chủ trì</th>
                    <th className="py-2 px-4 text-left">Thời gian hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((task, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{task.STT}</td>
                      <td className="py-2 px-4">{task['Tên công việc']}</td>
                      <td className="py-2 px-4">{task['Các lĩnh vực công tác']}</td>
                      <td className="py-2 px-4">{task['Tiến độ']}</td>
                      <td className="py-2 px-4">{task['Người chủ trì']}</td>
                      <td className="py-2 px-4">{task['Thời gian hoàn thành']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
