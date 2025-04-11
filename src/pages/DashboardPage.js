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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
          <h1 className="text-2xl font-bold">📊 Bảng điều khiển</h1>
          <button onClick={toggleSidebar} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 font-medium">
            {sidebarOpen ? 'Ẩn menu' : 'Hiện menu'}
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">📋 Danh sách công việc được giao</h2>
          {isLoading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : taskList.length === 0 ? (
            <p className="text-gray-500 italic">Không có dữ liệu công việc.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
              <table className="min-w-full border-collapse table-auto text-sm text-left text-slate-800">
                <thead className="bg-indigo-100 text-slate-900 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 border">#</th>
                    <th className="px-4 py-3 border w-[380px]">Tên công việc</th>
                    <th className="px-4 py-3 border">Lĩnh vực</th>
                    <th className="px-4 py-3 border">Tiến độ</th>
                    <th className="px-4 py-3 border">Chủ trì</th>
                    <th className="px-4 py-3 border">Hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList.map((task, index) => (
                    <tr key={index} className="hover:bg-indigo-50">
                      <td className="px-4 py-3 border text-center font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 border whitespace-pre-wrap break-words leading-snug">{task['Tên công việc']}</td>
                      <td className="px-4 py-3 border">{task['Các lĩnh vực công tác']}</td>
                      <td className="px-4 py-3 border">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          task['Tiến độ']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-800' :
                          task['Tiến độ']?.toLowerCase().includes('chậm') ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {task['Tiến độ']}
                        </span>
                      </td>
                      <td className="px-4 py-3 border">{task['Người chủ trì']}</td>
                      <td className="px-4 py-3 border">{task['Thời gian hoàn thành']}</td>
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
