// ✅ Cập nhật: giữ lại khung thông tin công việc, thêm phần check người thực hiện và danh sách công việc chưa báo cáo

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
    users: [],
    description: '',
    issues: '',
    completionDate: '',
    suggestions: ''
  });
  const [userList, setUserList] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const loadTask = async () => {
      if (state && state.task) {
        setTask(state.task);
      } else {
        try {
          const raw = await apiService.get('/api/tasks');
          const flat = raw.flat();
          const fallback = flat[parseInt(id)];
          if (fallback) setTask(fallback);
        } catch (err) {
          console.error('Lỗi khi tải task fallback:', err);
        }
      }
    };

    const loadUsers = async () => {
      try {
        const raw = await apiService.get('/api/dulieu');
        const names = raw.map(row => row['Tên chuyên viên']).filter(Boolean);
        setUserList(names);
      } catch (err) {
        console.error('Lỗi tải danh sách chuyên viên:', err);
      }
    };

    const loadPendingTasks = async () => {
      try {
        const raw = await apiService.get('/api/tasks');
        const flat = raw.flat();
        const pending = flat.filter(t => !t['Mô tả kết quả thực hiện']);
        setPendingTasks(pending);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách chưa báo cáo:', err);
      }
    };

    loadTask();
    loadUsers();
    loadPendingTasks();
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      const exists = prev.users.includes(value);
      return {
        ...prev,
        users: exists ? prev.users.filter(u => u !== value) : [...prev.users, value]
      };
    });
  };

  const handleSubmit = () => {
    alert('Gửi báo cáo thành công (giả lập)');
    navigate('/');
  };

  if (!task) return <div className="p-8 text-center text-red-600">❌ Không tìm thấy công việc phù hợp với ID: {id}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        📝 <span>Báo cáo công việc</span>
      </h2>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow mb-8">
        <p><strong className="text-indigo-700">Tên công việc:</strong> {task['Tên công việc']}</p>
        <p><strong className="text-indigo-700">Lĩnh vực:</strong> {task['Các lĩnh vực công tác']}</p>
        <p><strong className="text-indigo-700">Người chủ trì:</strong> {task['Người chủ trì']}</p>
        <p><strong className="text-indigo-700">Tiến độ:</strong> {task['Tiến độ']}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <label className="block font-medium mb-1">Người thực hiện</label>
          <div className="flex flex-wrap gap-3">
            {userList.map((name, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={name}
                  checked={formData.users.includes(name)}
                  onChange={handleCheckboxChange}
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Mô tả kết quả thực hiện</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Tồn tại, nguyên nhân</label>
          <textarea name="issues" value={formData.issues} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Thời gian hoàn thành</label>
            <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Đề xuất, kiến nghị</label>
            <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
          </div>
        </div>

        <button onClick={handleSubmit} className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Gửi báo cáo
        </button>
      </div>

      {pendingTasks.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-purple-600 mb-3">📌 Các công việc chưa có báo cáo</h3>
          <ul className="space-y-2">
            {pendingTasks.map((t, i) => (
              <li key={i} className="bg-white rounded p-3 shadow hover:shadow-md transition">
                <p className="font-semibold text-indigo-700">{t['Tên công việc']}</p>
                <p className="text-sm text-gray-600">{t['Các lĩnh vực công tác']} • {t['Người chủ trì']}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BaoCaoPage;
