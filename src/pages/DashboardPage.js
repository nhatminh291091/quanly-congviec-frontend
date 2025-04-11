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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
          <h1 className="text-2xl font-bold">📊 Bảng điều khiển</h1>
          <button onClick={toggleSidebar} className="bg-white text-blue-600 font-medium px-3 py-1 rounded hover:bg-gray-100">
            {sidebarOpen ? 'Ẩn menu' : 'Hiện menu'}
          </button>
        </header>
        <main className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Danh sách công việc được giao</h2>
          {isLoading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : taskList.length === 0 ? (
            <p className="text-gray-500 italic">Không có dữ liệu công việc.</p>
          ) : (
            <div className="w-full max-w-full overflow-x-auto rounded-xl shadow border border-gray-300 bg-white">
              <table className="min-w-full table-fixed border-collapse text-sm text-left text-gray-800">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b">
                    <th className="px-4 py-3 border w-14">#</th>
                    <th className="px-4 py-3 border w-[350px]">📝 Tên công việc</th>
                    <th className="px-4 py-3 border w-[200px]">📂 Lĩnh vực</th>
                    <th className="px-4 py-3 border w-[150px]">📈 Tiến độ</th>
                    <th className="px-4 py-3 border w-[200px]">👤 Chủ trì</th>
                    <th className="px-4 py-3 border w-[180px]">📅 Hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((task, index) => (
                    <tr key={index} className="hover:bg-indigo-50">
                      <td className="px-4 py-3 border text-center font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 border whitespace-pre-wrap break-words font-medium text-gray-700">
                        {task['Tên công việc']}
                      </td>
                      <td className="px-4 py-3 border text-blue-700 font-medium">{task['Các lĩnh vực công tác']}</td>
                      <td className="px-4 py-3 border">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                          task['Tiến độ']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-900' :
                          task['Tiến độ']?.toLowerCase().includes('chậm') ? 'bg-red-200 text-red-900' :
                          'bg-yellow-200 text-yellow-900'
                        }`}>
                          {task['Tiến độ']}
                        </span>
                      </td>
                      <td className="px-4 py-3 border text-gray-700">{task['Người chủ trì']}</td>
                      <td className="px-4 py-3 border text-gray-700">{task['Thời gian hoàn thành']}</td>
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