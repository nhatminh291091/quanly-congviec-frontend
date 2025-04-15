import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DashboardPage = () => {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formVisibleIndex, setFormVisibleIndex] = useState(null);
  const [dulieuOptions, setDulieuOptions] = useState([]);
  const [formData, setFormData] = useState({});

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
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDulieu = async () => {
      try {
        const raw = await apiService.get('api/dulieu');
        const names = raw.flat().map(row => row['Email chuyên viên']).filter(Boolean);
        setDulieuOptions(names);
      } catch (e) {
        console.error('Lỗi lấy dữ liệu DULIEU:', e);
      }
    };

    fetchAllTasks();
    fetchDulieu();
  }, []);

  const handleToggleForm = (index, task) => {
    if (formVisibleIndex === index) {
      setFormVisibleIndex(null);
      setFormData({});
    } else {
      setFormVisibleIndex(index);
      setFormData({
        description: task['Mô tả kết quả thực hiện'] || '',
        issues: task['Tồn tại, nguyên nhân'] || '',
        suggestions: task['Đề xuất, kiến nghị'] || '',
        completionDate: task['Thời gian hoàn thành'] || '',
        performers: task['Người thực hiện']?.split(',').map(s => s.trim()) || []
      });
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = e => {
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
      'Người thực hiện': formData.performers.join(', ')
    };
    const newList = [...taskList];
    newList[index] = updated;
    setTaskList(newList);
    setFormVisibleIndex(null);
    alert('Đã lưu báo cáo (giả lập)');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Danh sách công việc</h1>
      <p className="text-sm italic text-gray-600 mb-6">👉 Click vào tên công việc để cập nhật báo cáo thực hiện.</p>
      <div className="overflow-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th>#</th>
              <th>Tên công việc</th>
              <th>Lĩnh vực</th>
              <th>Tiến độ</th>
              <th>Chủ trì</th>
              <th>Hoàn thành</th>
              <th>Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-indigo-50 cursor-pointer" onClick={() => handleToggleForm(index, task)}>
                  <td>{index + 1}</td>
                  <td className="text-blue-600 underline">{task['Tên công việc']}</td>
                  <td>{task['Các lĩnh vực công tác']}</td>
                  <td>{task['Tiến độ']}</td>
                  <td>{task['Người chủ trì']}</td>
                  <td>{task['Thời gian hoàn thành']}</td>
                  <td>{task['Đánh giá kết quả'] || 'Chưa đánh giá'}</td>
                </tr>
                {formVisibleIndex === index && (
                  <tr>
                    <td colSpan="7" className="bg-gray-50 p-4">
                      <form className="space-y-4">
                        <div>
                          <label className="font-semibold">Người thực hiện</label>
                          <select
                            multiple
                            className="w-full border rounded p-2"
                            value={formData.performers}
                            onChange={handleMultiSelectChange}
                          >
                            {dulieuOptions.map((name, idx) => (
                              <option key={idx} value={name}>{name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold">Mô tả kết quả</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                        </div>
                        <div>
                          <label className="font-semibold">Tồn tại, nguyên nhân</label>
                          <textarea name="issues" value={formData.issues} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                        </div>
                        <div>
                          <label className="font-semibold">Thời gian hoàn thành</label>
                          <input type="date" name="completionDate" value={formData.completionDate} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>
                        <div>
                          <label className="font-semibold">Đề xuất, kiến nghị</label>
                          <textarea name="suggestions" value={formData.suggestions} onChange={handleInputChange} className="w-full border rounded p-2" rows="2" />
                        </div>
                        <div className="flex gap-4">
                          <button type="button" onClick={() => handleSave(index)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Lưu báo cáo</button>
                          <button type="button" onClick={() => setFormVisibleIndex(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
