import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterLinhVuc, setFilterLinhVuc] = useState('');
  const [filterChuTri, setFilterChuTri] = useState('');
  const [filterHoanThanh, setFilterHoanThanh] = useState('');
  const [filterDanhGia, setFilterDanhGia] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
        const tasks = rawData.flat().map((task, index) => ({ ...task, id: task.id || index }));

        // Sắp xếp: chưa đánh giá lên đầu
        tasks.sort((a, b) => {
          const aEval = a['Đánh giá kết quả']?.toLowerCase() || '';
          const bEval = b['Đánh giá kết quả']?.toLowerCase() || '';
          const isAChua = !aEval || aEval === 'chưa đánh giá';
          const isBChua = !bEval || bEval === 'chưa đánh giá';
          return isBChua - isAChua;
        });

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

  const handleNavigateWithDelay = (id) => {
    const row = document.getElementById(`task-row-${id}`);
    if (row) {
      row.classList.add('animate-pulse');
      setTimeout(() => {
        navigate(`/bao-cao?id=${id}`);
      }, 200);
    } else {
      navigate(`/bao-cao?id=${id}`);
    }
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

        <p className="text-sm text-gray-500 italic mb-1">
          Tổng số công việc: {filteredTasks.length}
        </p>
        <p className="text-sm text-gray-700 italic mb-4">
          👉 Click vào tên công việc để cập nhật báo cáo thực hiện công việc.
        </p>

        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
          <table className="table-fixed w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-blue-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3 w-80">Tên công việc</th>
                <th className="px-4 py-3 w-44">Lĩnh vực</th>
                <th className="px-4 py-3 w-20">Tiến độ</th>
                <th className="px-4 py-3 w-40 whitespace-nowrap">Chủ trì</th>
                <th className="px-4 py-3 w-20">Hoàn thành</th>
                <th className="px-4 py-3 w-36">Đánh giá</th>
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
                  <tr
                    key={index}
                    id={`task-row-${task.id}`}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3 w-10 text-center">{index + 1}</td>
                    <td
                      className="px-4 py-3 w-80 break-words whitespace-pre-wrap text-blue-600 hover:underline"
                      onClick={() => handleNavigateWithDelay(task.id)}
                    >
                      {task['Tên công việc']}
                    </td>
                    <td className="px-4 py-3 w-44 break-words whitespace-pre-wrap">{task['Các lĩnh vực công tác']}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 w-20 rounded-full text-xs font-medium
                        ${isCurrentMonth(task['Tiến độ']) ? 'bg-yellow-100 text-yellow-800' : isPastMonth(task['Tiến độ']) ? 'bg-gray-100 border border-gray-400 text-gray-700' : ''}`}>
                        {task['Tiến độ']}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-40 whitespace-nowrap">{task['Người chủ trì']}</td>
                    <td className="px-4 py-3 w-20 whitespace-nowrap">{task['Thời gian hoàn thành']}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 w-36 rounded-full text-xs font-semibold shadow-sm
                        ${task['Đánh giá kết quả']?.toLowerCase().includes('hoàn thành') ? 'bg-green-200 text-green-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('theo tiến độ') ? 'bg-blue-200 text-blue-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('chậm') ? 'bg-yellow-200 text-yellow-800' :
                          task['Đánh giá kết quả']?.toLowerCase().includes('không hoàn thành') ? 'bg-red-200 text-red-800' :
                          'bg-gray-100 text-gray-500'}`}>
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
