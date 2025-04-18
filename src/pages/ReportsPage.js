import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BaoCaoPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    issues: '',
    completionDate: '',
    suggestions: ''
  });

  useEffect(() => {
    const fetchTask = async () => {
      const rawData = await apiService.get('api/tasks');
      const flatData = rawData.flat();
      const currentTask = flatData.find((t, index) => t.id == id || index.toString() === id);
      if (currentTask) {
        setTask(currentTask);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert('Gửi báo cáo thành công (giả lập)');
    navigate('/');
  };

  if (!task) return <div className="p-8">Đang tải công việc...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">📝 Báo cáo công việc</h2>

      <div className="bg-white shadow rounded p-6 mb-6">
        <p><strong>Tên công việc:</strong> {task['Tên công việc']}</p>
        <p><strong>Lĩnh vực:</strong> {task['Các lĩnh vực công tác']}</p>
        <p><strong>Người chủ trì:</strong> {task['Người chủ trì']}</p>
        <p><strong>Tiến độ:</strong> {task['Tiến độ']}</p>
      </div>

      <div className="bg-white shadow rounded p-6">
        <div className="mb-4">
          <label className="block font-medium mb-1">Tên người thực hiện</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Mô tả kết quả thực hiện</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Tồn tại, nguyên nhân</label>
          <textarea name="issues" value={formData.issues} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Thời gian hoàn thành</label>
          <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Đề xuất, kiến nghị</label>
          <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
        </div>
        <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Gửi báo cáo
        </button>
      </div>
    </div>
  );
};

export default BaoCaoPage;
