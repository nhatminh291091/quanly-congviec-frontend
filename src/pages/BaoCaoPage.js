// 📄 BaoCaoPage.js - Giao diện báo cáo công việc kèm danh sách các công việc chưa có mô tả
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BaoCaoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const state = location.state;

  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    chuyenViens: [],
    description: '',
    issues: '',
    completionDate: '',
    suggestions: ''
  });
  const [chuyenVienList, setChuyenVienList] = useState([]);
  const [unreportedTasks, setUnreportedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dulieu = await apiService.get('api/dulieu');
        const names = [...new Set(dulieu.flat().map(row => row['Tên chuyên viên']).filter(Boolean))];
        setChuyenVienList(names);

        const taskData = await apiService.get('api/tasks');
        const flatData = taskData.flat();

        setUnreportedTasks(flatData.filter(t => !t['Mô tả kết quả thực hiện']));

        if (state && state.task) {
          setTask(state.task);
        } else {
          const fallback = flatData.find(t => t.id?.toString() === id || flatData.indexOf(t).toString() === id);
          setTask(fallback || null);
        }
      } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
      }
    };
    fetchData();
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    setFormData(prev => ({
      ...prev,
      chuyenViens: prev.chuyenViens.includes(name)
        ? prev.chuyenViens.filter(n => n !== name)
        : [...prev.chuyenViens, name]
    }));
  };

  const handleSubmit = () => {
    alert('Gửi báo cáo thành công (giả lập)');
    navigate('/');
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        📝 Báo cáo công việc
      </h2>

      {task && (
        <div className="bg-indigo-100 border-l-8 border-indigo-500 text-indigo-800 p-6 rounded-xl shadow mb-8">
          <p><strong>Tên công việc:</strong> {task['Tên công việc']}</p>
          <p><strong>Lĩnh vực:</strong> {task['Các lĩnh vực công tác']}</p>
          <p><strong>Người chủ trì:</strong> {task['Người chủ trì']}</p>
          <p><strong>Tiến độ:</strong> {task['Tiến độ']}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-xl mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Người thực hiện</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chuyenVienList.map((name, i) => (
                <label key={i} className="flex items-center gap-2 hover:text-indigo-600">
                  <input type="checkbox" className="accent-indigo-500" checked={formData.chuyenViens.includes(name)} onChange={() => handleCheckboxChange(name)} />
                  {name}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Mô tả kết quả thực hiện</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-300" rows="3" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Tồn tại, nguyên nhân</label>
            <textarea name="issues" value={formData.issues} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-300" rows="2" />
          </div>

          <div>
            <label className="block font-semibold mb-2">Thời gian hoàn thành</label>
            <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block font-semibold mb-2">Đề xuất, kiến nghị</label>
            <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-300" rows="2" />
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition">Gửi báo cáo</button>
        </div>
      </div>

      {/* Danh sách công việc chưa báo cáo */}
      <div className="bg-white p-6 rounded-xl shadow border border-indigo-100">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">📌 Các công việc chưa có báo cáo</h3>
        <ul className="list-disc ml-5 space-y-2">
          {unreportedTasks.map((t, i) => (
            <li key={i} className="hover:text-blue-700 cursor-pointer" onClick={() => navigate(`/bao-cao?id=${t.id || i}`, { state: { task: t } })}>
              {t['Tên công việc']}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BaoCaoPage;
