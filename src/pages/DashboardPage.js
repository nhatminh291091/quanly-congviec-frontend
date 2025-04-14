import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DashboardPage = () => {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterLinhVuc, setFilterLinhVuc] = useState('');
  const [filterChuTri, setFilterChuTri] = useState('');
  const [filterHoanThanh, setFilterHoanThanh] = useState('');
  const [filterDanhGia, setFilterDanhGia] = useState('');

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
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

  const filteredTasks = taskList.filter(task =>
    (!filterLinhVuc || task['Các lĩnh vực công tác'] === filterLinhVuc) &&
    (!filterChuTri || task['Người chủ trì'] === filterChuTri) &&
    (!filterHoanThanh || task['Thời gian hoàn thành'] === filterHoanThanh) &&
    (!filterDanhGia ||
      (filterDanhGia === 'Chưa đánh giá' && !task['Đánh giá kết quả']) ||
      (task['Đánh giá kết quả']?.includes(filterDanhGia)))
  );

  const unique = (arr, key) => Array.from(new Set(arr.map(item => item[key]).filter(Boolean)));

  const isCurrentMonth = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const today = new Date();
    return month === today.getMonth() + 1 && year === today.getFullYear();
  };

  const isPastMonth = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const today = new Date();
    return year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1);
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight">🎨 Tổng hợp công việc</h1>
      </header>

      <main className="flex-1 p-8 bg-white/70 backdrop-blur-lg overflow-y-auto rounded-tl-3xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          📋 <span>Danh sách công việc được giao</span>
        </h2>

        <p className="text-sm text-gray-500 italic mb-4">
          Tổng số công việc: {filteredTasks.length}
        </p>

        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
          <table className="table-fixed w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left w-[140px]">Tên công việc</th>
                <th className="px-4 py-3 text-left w-[200px]">Lĩnh vực</th>
                <th className="px-4 py-3 text-left">Tiến độ</th>
                <th className="px-4 py-3 text-left w-[240px]">Chủ trì</th>
                <th className="px-4 py-3 text-left">Hoàn thành</th>
                <th className="px-4 py-3 text-left">Đánh giá</th>
              </tr>
              <tr className="bg-white text-gray-700 text-xs">
                <th></th><th></th>
                <th>
                  <select className="w-full px-2 py-1 border rounded" value={filterLinhVuc} onChange={e => setFilterLinhVuc(e.target.value)}>
                    <option value="">Tất cả</option>
                    {unique(taskList, 'Các lĩnh vực công tác').map((v, i) => <option key={i} value={v}>{v}</option>)}
                  </select>
                </th>
                <th></th>
                <th>
                  <select className="w-full px-2 py-1 border rounded" value={filterChuTri} onChange={e => setFilterChuTri(e.target.value)}>
                    <option value="">Tất cả</option>
                    {unique(taskList, 'Người chủ trì').map((v, i) => <option key={i} value={v}>{v}</option>)}
                  </select>
                </th>
                <th>
                  <select className="w-full px-2 py-1 border rounded" value={filterHoanThanh} onChange={e => setFilterHoanThanh(e.target.value)}>
                    <option value="">Tất cả</option>
                    {unique(taskList, 'Thời gian hoàn thành').map((v, i) => <option key={i} value={v}>{v}</option>)}
                  </select>
                </th>
                <th>
                  <select className="w-full px-2 py-1 border rounded" value={filterDanhGia} onChange={e => setFilterDanhGia(e.target.value)}>
                    <option value="">Tất cả</option>
                    {['Hoàn thành', 'Theo tiến độ', 'Chậm tiến độ', 'Không hoàn thành', 'Chưa đánh giá'].map((v, i) => <option key={i} value={v}>{v}</option>)}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 italic text-gray-500">
                    Không có dữ liệu phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition">
                    <td className="px-4 py-3 font-medium text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-pre-wrap break-words">{task['Tên công việc']}</td>
                    <td className="px-4 py-3 whitespace-pre-wrap break-words">{task['Các lĩnh vực công tác']}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${isCurrentMonth(task['Tiến độ'])
                            ? 'bg-yellow-100 text-yellow-800'
                            : isPastMonth(task['Tiến độ'])
                            ? 'bg-gray-100 border border-gray-400 text-gray-700'
                            : ''}`}
                      >
                        {task['Tiến độ']}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-pre-wrap break-words">{task['Người chủ trì']}</td>
                    <td className="px-4 py-3">{task['Thời gian hoàn thành']}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                        ${
                          task['Đánh giá kết quả']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('theo tiến độ') ? 'bg-blue-200 text-blue-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('chậm') ? 'bg-yellow-200 text-yellow-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('không hoàn thành') ? 'bg-red-200 text-red-800' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                        {task['Đánh giá kết quả'] || 'Chưa đánh giá'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
