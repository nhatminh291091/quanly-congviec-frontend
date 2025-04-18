import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const toISODate = (str) => {
  if (!str) return '';
  const [d, m, y] = str.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const fromISODate = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
};

const DashboardPage = () => {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [filterLinhVuc, setFilterLinhVuc] = useState('');
  const [filterDanhGia, setFilterDanhGia] = useState('');
  const [filterChuTri, setFilterChuTri] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTasks = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const rawData = await apiService.get('api/tasks');
        if (!Array.isArray(rawData)) {
          throw new Error('Invalid data format received');
        }

        const tasks = rawData.flat().map((task, index) => {
          if (!task['Tên công việc']) {
            console.warn(`Task at index ${index} is missing required fields`);
          }
          return { ...task, id: task.id || index };
        });

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
        setError(error.message);
        setTaskList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  const toggleForm = (index, task) => {
    if (activeFormIndex === index) {
      setActiveFormIndex(null);
      setFormData({});
    } else {
      setActiveFormIndex(index);
      setFormData({
        description: task['Mô tả kết quả thực hiện'] || '',
        issues: task['Tồn tại, nguyên nhân'] || '',
        suggestions: task['Đề xuất, kiến nghị'] || '',
        completionDate: task['Thời gian hoàn thành'] || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (index) => {
    const task = taskList[index];
    const updated = {
      ...task,
      'Mô tả kết quả thực hiện': formData.description,
      'Tồn tại, nguyên nhân': formData.issues,
      'Đề xuất, kiến nghị': formData.suggestions,
      'Thời gian hoàn thành': formData.completionDate
    };
    const newList = [...taskList];
    newList[index] = updated;
    setTaskList(newList);
    setActiveFormIndex(null);
    alert('Đã lưu báo cáo (giả lập)');
  };

  const isCurrentMonth = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const today = new Date();
    return month === today.getMonth() + 1 && year === today.getFullYear();
  };
const getDeadlineStatusClass = (dateStr) => {
  if (!dateStr) return 'bg-gray-100 text-gray-500';
  const [day, month, year] = dateStr.split('/').map(Number);
  const deadline = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'bg-red-100 text-red-800'; // Quá hạn
  if (diffDays <= 3) return 'bg-orange-100 text-orange-800'; // Gần đến hạn
  return 'bg-green-100 text-green-800'; // Còn xa
};

  const isPastMonth = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const today = new Date();
    return year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1);
  };

  const filteredTasks = taskList.filter(task => {
    const matchLinhVuc = filterLinhVuc ? task['Các lĩnh vực công tác'] === filterLinhVuc : true;
    const matchDanhGia = filterDanhGia ? (task['Đánh giá kết quả'] || '').toLowerCase() === filterDanhGia.toLowerCase() : true;
    const matchChuTri = filterChuTri ? task['Người chủ trì'] === filterChuTri : true;
    return matchLinhVuc && matchDanhGia && matchChuTri;
  });

  return (
    <div className="flex flex-col flex-1">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight">🎨 Tổng hợp công việc</h1>
      </header>

      <main className="flex-1 p-8 bg-white/70 backdrop-blur-lg overflow-y-auto rounded-tl-3xl">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Lỗi: {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
              📋 <span>Danh sách công việc được giao</span>
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              <select onChange={(e) => setFilterLinhVuc(e.target.value)} className="border p-2 rounded w-52">
                <option value="">🔎 Lọc theo lĩnh vực</option>
                {[...new Set(taskList.map(t => t['Các lĩnh vực công tác']))].filter(Boolean).map((lv, i) => (
                  <option key={i} value={lv}>{lv}</option>
                ))}
              </select>

              <select onChange={(e) => setFilterDanhGia(e.target.value)} className="border p-2 rounded w-52">
                <option value="">🔎 Lọc theo đánh giá</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Theo tiến độ">Theo tiến độ</option>
                <option value="Chậm tiến độ">Chậm tiến độ</option>
                <option value="Không hoàn thành">Không hoàn thành</option>
                <option value="Chưa đánh giá">Chưa đánh giá</option>
              </select>

              <select onChange={(e) => setFilterChuTri(e.target.value)} className="border p-2 rounded w-52">
                <option value="">🔎 Lọc theo chủ trì</option>
                {[...new Set(taskList.map(t => t['Người chủ trì']))].filter(Boolean).map((ct, i) => (
                  <option key={i} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

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
                    <th className="px-4 py-3 w-32 whitespace-nowrap">Chủ trì</th>
                    <th className="px-4 py-3 w-20">Hoàn thành</th>
                    <th className="px-4 py-3 w-36">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTasks.map((task, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-indigo-50 transition cursor-pointer">
                        <td className="px-4 py-3 w-10 text-center">{taskList.indexOf(task) + 1}</td>
                        <td
                          className="px-4 py-3 text-blue-600 hover:underline"
                          onClick={() => navigate(`/bao-cao?id=${task.id || index}`, { state: { task } })}
                        >
                          {task['Tên công việc']}
                        </td>
                        <td className="px-4 py-3">{task['Các lĩnh vực công tác']}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 w-24 rounded-full text-xs font-medium shadow-sm ${getDeadlineStatusClass(task['Tiến độ'])}`}>
                            {task['Tiến độ']}
                          </span>
                        </td>
                        <td className="px-4 py-3">{task['Người chủ trì']}</td>
                        <td className="px-4 py-3">{task['Thời gian hoàn thành']}</td>
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
                      {activeFormIndex === index && (
                        <tr>
                          <td colSpan="7" className="bg-gray-50 px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-medium">Mô tả kết quả thực hiện</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                              </div>
                              <div>
                                <label className="block font-medium">Tồn tại, nguyên nhân</label>
                                <textarea name="issues" value={formData.issues} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                              </div>
                              <div>
                                <label className="block font-medium">Thời gian hoàn thành</label>
                                <input
                                  type="date"
                                  name="completionDate"
                                  value={toISODate(formData.completionDate)}
                                  onChange={(e) => handleInputChange({ target: { name: 'completionDate', value: fromISODate(e.target.value) } })}
                                  className="w-full border rounded p-2"
                                />
                              </div>
                              <div>
                                <label className="block font-medium">Đề xuất, kiến nghị</label>
                                <textarea name="suggestions" value={formData.suggestions} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                              </div>
                            </div>
                            <div className="mt-4 flex gap-4">
                              <button onClick={() => handleSave(index)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Lưu báo cáo</button>
                              <button onClick={() => setActiveFormIndex(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
