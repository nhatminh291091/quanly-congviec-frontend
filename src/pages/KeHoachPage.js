import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const KeHoachPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dulieu, setDulieu] = useState([]);

  const [formData, setFormData] = useState({
    tenCongViec: '',
    linhVuc: '',
    tienDo: '',
    chuTri: '',
    thoiGianHoanThanh: '',
    nguoiThucHien: []
  });

  const parseDMY = (dateStr) => {
    if (!dateStr) return null;
    try {
      const [d, m, y] = dateStr.split('/');
      const date = new Date(`${y}-${m}-${d}`);
      return isNaN(date.getTime()) ? null : date;
    } catch (err) {
      console.error('Invalid date format:', dateStr);
      return null;
    }
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allTasks = await apiService.get('api/tasks');
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = allTasks.filter(task => {
          const d1 = parseDMY(task['Tiến độ']);
          const d2 = parseDMY(task['Thời gian hoàn thành']);
          return (
            (d1 && d1.getMonth() === currentMonth && d1.getFullYear() === currentYear) ||
            (d2 && d2.getMonth() === currentMonth && d2.getFullYear() === currentYear)
          );
        });

        setTasks(filtered);

        const dulieuRes = await apiService.get('api/dulieu');
        setDulieu(dulieuRes);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu:', err);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData(prev => ({ ...prev, nguoiThucHien: selected }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!formData.tenCongViec.trim()) {
      alert('Vui lòng nhập tên công việc');
      return false;
    }
    if (!formData.linhVuc) {
      alert('Vui lòng chọn lĩnh vực');
      return false;
    }
    if (!formData.tienDo) {
      alert('Vui lòng chọn tiến độ');
      return false;
    }
    if (!formData.chuTri) {
      alert('Vui lòng chọn người chủ trì');
      return false;
    }
    if (!formData.thoiGianHoanThanh) {
      alert('Vui lòng chọn thời gian hoàn thành');
      return false;
    }
    if (formData.nguoiThucHien.length === 0) {
      alert('Vui lòng chọn ít nhất một người thực hiện');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      tenCongViec: '',
      linhVuc: '',
      tienDo: '',
      chuTri: '',
      thoiGianHoanThanh: '',
      nguoiThucHien: []
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload = {
        "Tên công việc": formData.tenCongViec,
        "Các lĩnh vực công tác": formData.linhVuc,
        "Tiến độ": formatDate(formData.tienDo),
        "Người chủ trì": formData.chuTri,
        "Thời gian hoàn thành": formatDate(formData.thoiGianHoanThanh),
        "Người thực hiện": formData.nguoiThucHien.join('; ')
      };

      await apiService.post('api/tasks/add', payload);
      alert('✅ Công việc đã được lưu!');
      setShowForm(false);
      resetForm();
      
      // Refresh tasks list without page reload
      const newTasks = await apiService.get('api/tasks');
      setTasks(newTasks);
    } catch (error) {
      console.error('❌ Lỗi khi lưu công việc:', error);
      setError('Đã có lỗi xảy ra khi lưu công việc.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-white shadow-md">
        <h1 className="text-2xl font-bold">🗓️ Kế hoạch tháng</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 font-semibold"
        >
          ➕ Tạo công việc
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 m-6 rounded-xl shadow border border-gray-200 space-y-4">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">🎯 Thêm công việc mới</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên công việc</label>
              <input type="text" name="tenCongViec" value={formData.tenCongViec} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lĩnh vực</label>
              <select name="linhVuc" value={formData.linhVuc} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">-- Chọn --</option>
                {dulieu.map((item, idx) => (
                  <option key={idx} value={item['Lĩnh vực công tác']}>
                    {item['Lĩnh vực công tác']}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tiến độ</label>
              <input type="date" name="tienDo" value={formData.tienDo} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chủ trì</label>
              <select name="chuTri" value={formData.chuTri} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">-- Chọn --</option>
                {dulieu.map((item, idx) => (
                  <option key={idx} value={item['Quản lý']}>
                    {item['Quản lý']}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời hạn hoàn thành</label>
              <input type="date" name="thoiGianHoanThanh" value={formData.thoiGianHoanThanh} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Người thực hiện</label>
              <select multiple name="nguoiThucHien" value={formData.nguoiThucHien} onChange={handleMultiSelect}
                className="w-full border border-gray-300 rounded px-3 py-2 h-[120px]">
                {dulieu.map((item, idx) => (
                  <option key={idx} value={item['Chuyên viên']}>
                    {item['Chuyên viên']}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isSubmitting ? '⏳ Đang lưu...' : '💾 Lưu công việc'}
            </button>
            {error && (
              <div className="text-red-500 mt-2">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 p-6 bg-white/80 backdrop-blur-md rounded-tl-3xl overflow-auto">
        {isLoading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 italic">Không có công việc nào trong tháng này.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-200 to-indigo-300 text-indigo-900 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Tên công việc</th>
                  <th className="px-4 py-2 text-left">Lĩnh vực</th>
                  <th className="px-4 py-2 text-left">Tiến độ</th>
                  <th className="px-4 py-2 text-left">Chủ trì</th>
                  <th className="px-4 py-2 text-left">Hoàn thành</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tasks.map((task, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">{task['Tên công việc']}</td>
                    <td className="px-4 py-2">{task['Các lĩnh vực công tác']}</td>
                    <td className="px-4 py-2">{task['Tiến độ']}</td>
                    <td className="px-4 py-2">{task['Người chủ trì']}</td>
                    <td className="px-4 py-2">{task['Thời gian hoàn thành']}</td>
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

export default KeHoachPage;
