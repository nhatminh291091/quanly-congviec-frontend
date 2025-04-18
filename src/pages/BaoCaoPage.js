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
    name: '',
    description: '',
    issues: '',
    completionDate: '',
    suggestions: ''
  });

  useEffect(() => {
    const loadTask = async () => {
      if (state && state.task) {
        setTask(state.task);
      } else {
        try {
          const rawData = await apiService.get('api/tasks');
          const flatData = rawData.flat();
          const fallback = flatData[parseInt(id)];
          if (fallback) setTask(fallback);
        } catch (err) {
          console.error("Lỗi khi gọi API:", err);
        }
      }
    };
    loadTask();
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert('Gửi báo cáo thành công (giả lập)');
    navigate('/');
  };

  if (!task) {
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        ❌ Không tìm thấy công việc phù hợp với ID: {id}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📝 Báo cáo công việc</h2>

      <div className="bg-indigo-50 border border-indigo-300 text-indigo-800 rounded-xl p-6 shadow mb-8">
        <p className="mb-2"><span className="font-semibold">Tên công việc:</span> {task['Tên công việc']}</p>
        <p className="mb-2"><span className="font-semibold">Lĩnh vực:</span> {task['Các lĩnh vực công tác']}</p>
        <p className="mb-2"><span className="font-semibold">Người chủ trì:</span> {task['Người chủ trì']}</p>
        <p><span className="font-semibold">Tiến độ:</span> {task['Tiến độ']}</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Tên người thực hiện</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Mô tả kết quả thực hiện</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Tồn tại, nguyên nhân</label>
          <textarea
            name="issues"
            value={formData.issues}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Thời gian hoàn thành</label>
          <input
            type="date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Đề xuất, kiến nghị</label>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:shadow"
          />
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl transition duration-200"
          >
            Gửi báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

export default BaoCaoPage;
