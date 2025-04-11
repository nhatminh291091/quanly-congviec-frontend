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
            <div className="grid gap-4">
              <div className="hidden md:grid grid-cols-6 gap-4 bg-indigo-100 text-indigo-900 font-semibold px-4 py-2 rounded shadow-sm uppercase text-sm">
                <div>#</div>
                <div className="col-span-2">Tên công việc</div>
                <div>Lĩnh vực</div>
                <div>Tiến độ</div>
                <div>Hoàn thành</div>
              </div>
              {taskList.map((task, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 bg-white shadow hover:shadow-md transition rounded px-4 py-3 text-sm text-slate-800">
                  <div className="font-semibold text-center">{index + 1}</div>
                  <div className="col-span-2 whitespace-pre-wrap break-words leading-snug">{task['Tên công việc']}</div>
                  <div>{task['Các lĩnh vực công tác']}</div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      task['Tiến độ']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-800' :
                      task['Tiến độ']?.toLowerCase().includes('chậm') ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {task['Tiến độ']}
                    </span>
                  </div>
                  <div>{task['Thời gian hoàn thành']}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
