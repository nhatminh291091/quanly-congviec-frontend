import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DashboardPage = () => {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   const fetchAllTasks = async () => {
  try {
    const rawData = await apiService.get('api/tasks/all');
    console.log("📦 rawData", rawData);

    // Làm phẳng mảng 2 cấp: [[{...}], [{...}], ...] → [{...}, {...}, ...]
    const tasks = rawData.flat();

    setTaskList(tasks);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách công việc:', error);
    setTaskList([]);
  } finally {
    setIsLoading(false);
  }
};

    fetchAllTasks();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight">🎨 Tổng hợp công việc</h1>
      </header>

      <main className="flex-1 p-8 bg-white/70 backdrop-blur-lg overflow-y-auto rounded-tl-3xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          📋 <span>Danh sách công việc được giao</span>
        </h2>

        {isLoading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : taskList.length === 0 ? (
          <p className="text-gray-500 italic">Không có dữ liệu công việc.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-200 to-indigo-300 text-indigo-900 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left w-[400px]">Tên công việc</th>
                  <th className="px-6 py-3 text-left">Lĩnh vực</th>
                  <th className="px-6 py-3 text-left">Tiến độ</th>
                  <th className="px-6 py-3 text-left">Chủ trì</th>
                  <th className="px-6 py-3 text-left">Hoàn thành</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {taskList.map((task, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-medium text-center">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-pre-wrap break-words leading-snug">{task['Tên công việc']}</td>
                    <td className="px-6 py-4">{task['Các lĩnh vực công tác']}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        task['Tiến độ']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-800' :
                        task['Tiến độ']?.toLowerCase().includes('chậm') ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {task['Tiến độ']}
                      </span>
                    </td>
                    <td className="px-6 py-4">{task['Người chủ trì']}</td>
                    <td className="px-6 py-4">{task['Thời gian hoàn thành']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
