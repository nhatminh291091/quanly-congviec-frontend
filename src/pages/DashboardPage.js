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
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [nguoiThucHienList, setNguoiThucHienList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
        const tasks = rawData.flat().map((task, index) => ({ ...task, id: task.id || index }));

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

    const fetchNguoiThucHien = async () => {
      try {
        const raw = await apiService.get('api/dulieu');
        const names = raw.flat().map(row => row['Tên chuyên viên']).filter(Boolean);
        setNguoiThucHienList(names);
      } catch (error) {
        console.error('❌ Lỗi khi lấy người thực hiện:', error);
      }
    };

    fetchAllTasks();
    fetchNguoiThucHien();
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
        completionDate: task['Thời gian hoàn thành'] || '',
        performers: task['Người thực hiện']?.split(',').map(s => s.trim()) || []
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData(prev => ({ ...prev, performers: selected }));
  };

  const handleSave = (index) => {
    const task = taskList[index];
    const updated = {
      ...task,
      'Mô tả kết quả thực hiện': formData.description,
      'Tồn tại, nguyên nhân': formData.issues,
      'Đề xuất, kiến nghị': formData.suggestions,
      'Thời gian hoàn thành': formData.completionDate,
      'Người thực hiện': formData.performers?.join(', ') || ''
    };
    const newList = [...taskList];
    newList[index] = updated;
    setTaskList(newList);
    setActiveFormIndex(null);
    alert('Đã lưu báo cáo (giả lập)');
  };

  const filteredTasks = taskList;

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
              {filteredTasks.map((task, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-indigo-50 transition cursor-pointer">
                    <td className="px-4 py-3 w-10 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-blue-600 hover:underline" onClick={() => toggleForm(index, task)}>{task['Tên công việc']}</td>
                    <td className="px-4 py-3">{task['Các lĩnh vực công tác']}</td>
                    <td className="px-4 py-3">{task['Tiến độ']}</td>
                    <td className="px-4 py-3">{task['Người chủ trì']}</td>
                    <td className="px-4 py-3">{task['Thời gian hoàn thành']}</td>
                    <td className="px-4 py-3">{task['Đánh giá kết quả'] || 'Chưa đánh giá'}</td>
                  </tr>
                  {activeFormIndex === index && (
                    <tr>
                      <td colSpan="7" className="bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium">Người thực hiện</label>
                            <select multiple value={formData.performers} onChange={handleSelectChange} className="w-full border rounded p-2">
                              {nguoiThucHienList.map((name, i) => (
                                <option key={i} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
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
      </main>
    </div>
  );
};

export default DashboardPage;
