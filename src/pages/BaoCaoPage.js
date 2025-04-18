// ✅ BẢN CẬP NHẬT TỐI ƯU: Giao diện cố định, phân vùng rõ sidebar và form
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
    description: '',
    issues: '',
    completionDate: '',
    suggestions: '',
    nguoiThucHien: []
  });
  const [allTasks, setAllTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchTasksAndStaff = async () => {
      try {
        const taskRes = await apiService.get('api/tasks');
        const flatTasks = taskRes.flat();
        setAllTasks(flatTasks);

        const fallback = state?.task || flatTasks.find((t, i) => i === parseInt(id));
        if (fallback) setTask(fallback);

        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1V4vduiq2a2zL020mWmd1MSFoknfL2XLTSOdD0c2dPoI/gviz/tq?tqx=out:json&sheet=DULIEU';
        const res = await fetch(sheetUrl);
        const text = await res.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const names = json.table.rows.map(row => row.c[4]?.v).filter(Boolean);
        const uniqueNames = [...new Set(names)];
        setStaffList(uniqueNames);
      } catch (err) {
        console.error("Lỗi tải dữ liệu nhân sự:", err);
      }
    };
    fetchTasksAndStaff();
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const exists = prev.nguoiThucHien.includes(value);
        return {
          ...prev,
          nguoiThucHien: exists
            ? prev.nguoiThucHien.filter(n => n !== value)
            : [...prev.nguoiThucHien, value]
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    alert('Gửi báo cáo thành công (giả lập)');
    navigate('/');
  };

  const tasksChuaBaoCao = allTasks.filter(t => !t['Mô tả kết quả thực hiện']);

  if (!task) {
    return <div className="p-8 text-center text-red-600">❌ Không tìm thấy công việc phù hợp với ID: {id}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8">
      {/* MAIN FORM */}
      <div className="flex-1 max-w-4xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📝 Báo cáo công việc</h2>

        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-400 text-sm rounded-xl shadow-md p-4 mb-6">
          <p><strong className="text-indigo-800">Tên công việc:</strong> {task['Tên công việc']}</p>
          <p><strong className="text-indigo-800">Lĩnh vực:</strong> {task['Các lĩnh vực công tác']}</p>
          <p><strong className="text-indigo-800">Người chủ trì:</strong> {task['Người chủ trì']}</p>
          <p><strong className="text-indigo-800">Tiến độ:</strong> {task['Tiến độ']}</p>
        </div>

        <div className="bg-white border border-gray-200 shadow rounded-xl p-6">
          <div className="mb-4">
            <label className="block font-medium mb-1">Người thực hiện</label>
            <div className="grid grid-cols-2 gap-2">
              {staffList.map((name, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm hover:text-indigo-600">
                  <input
                    type="checkbox"
                    value={name}
                    checked={formData.nguoiThucHien.includes(name)}
                    onChange={handleChange}
                  />
                  {name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Thời gian hoàn thành</label>
              <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Đề xuất, kiến nghị</label>
              <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} className="w-full border rounded p-2" rows="2" />
            </div>
          </div>
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Gửi báo cáo</button>
        </div>
      </div>

      {/* SIDEBAR CỐ ĐỊNH */}
      <aside className="w-full md:w-96 h-screen sticky top-0 overflow-y-auto bg-indigo-50 border-l border-indigo-300 shadow-inner rounded-xl p-4">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">📌 DS công việc chưa báo cáo</h3>
        <div className="flex flex-col gap-2 text-sm">
          {tasksChuaBaoCao.map((t, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/bao-cao?id=${t.id || idx}`, { state: { task: t } })}
              className="p-2 border border-gray-300 bg-white rounded-md cursor-pointer hover:bg-indigo-100 hover:text-indigo-700"
            >
              <div className="font-medium line-clamp-2">{t['Tên công việc']}</div>
              <div className="text-xs text-gray-500">{t['Các lĩnh vực công tác']} - {t['Người chủ trì']}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default BaoCaoPage;
