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
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Danh sách công việc được giao</h2>
          {isLoading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : taskList.length === 0 ? (
            <p className="text-gray-500 italic">Không có dữ liệu công việc.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700 bg-white">
                <thead className="bg-blue-50 text-gray-800 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">STT</th>
                    <th className="px-4 py-3 whitespace-nowrap w-[350px]">Tên công việc</th>
                    <th className="px-4 py-3 whitespace-nowrap">Lĩnh vực</th>
                    <th className="px-4 py-3 whitespace-nowrap">Tiến độ</th>
                    <th className="px-4 py-3 whitespace-nowrap">Người chủ trì</th>
                    <th className="px-4 py-3 whitespace-nowrap">Thời gian hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((task, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-pre-wrap break-words">{task['Tên công việc']}</td>
                      <td className="px-4 py-3">{task['Các lĩnh vực công tác']}</td>
                      <td className="px-4 py-3">
                        <span className={
                          `inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            task['Tiến độ']?.toLowerCase().includes('hoàn thành') ? 'bg-green-100 text-green-800' :
                            task['Tiến độ']?.toLowerCase().includes('chậm') ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`
                        }>
                          {task['Tiến độ']}
                        </span>
                      </td>
                      <td className="px-4 py-3">{task['Người chủ trì']}</td>
                      <td className="px-4 py-3">{task['Thời gian hoàn thành']}</td>
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
