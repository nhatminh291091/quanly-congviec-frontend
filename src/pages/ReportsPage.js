import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import Header from '../components/Header';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const selectedId = query.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
        const tasks = rawData.flat().map((task, index) => ({ ...task, id: task.id ?? index }));
        setReports(tasks);
        const found = tasks.find(task => String(task.id) === selectedId);
        if (found) {
          setSelectedReport(found);
          setFormData({
            description: found['Mô tả kết quả thực hiện'] || '',
            evaluation: found['Đánh giá kết quả'] || '',
            issues: found['Tồn tại, nguyên nhân'] || '',
            completionDate: found['Thời gian hoàn thành'] || '',
            suggestions: found['Đề xuất, kiến nghị'] || ''
          });
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu cập nhật lên Google Sheet
    alert('Đã lưu cập nhật báo cáo (giả lập)');
  };

  return (
    <div className="p-6">
      <Header title="Báo cáo công việc" />
      {isLoading ? (
        <p className="italic text-gray-500">Đang tải dữ liệu...</p>
      ) : selectedReport ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Cập nhật báo cáo: {selectedReport['Tên công việc']}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><strong>Lĩnh vực:</strong> {selectedReport['Các lĩnh vực công tác']}</div>
            <div><strong>Người chủ trì:</strong> {selectedReport['Người chủ trì']}</div>
            <div><strong>Tiến độ:</strong> {selectedReport['Tiến độ']}</div>

            <div>
              <label className="block font-semibold">Mô tả kết quả thực hiện</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Đánh giá kết quả</label>
                <select
                  name="evaluation"
                  value={formData.evaluation}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Chọn --</option>
                  <option>Hoàn thành</option>
                  <option>Theo tiến độ</option>
                  <option>Chậm tiến độ</option>
                  <option>Không hoàn thành</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold">Thời gian hoàn thành</label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold">Tồn tại, nguyên nhân</label>
              <textarea
                name="issues"
                rows="2"
                value={formData.issues}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Đề xuất, kiến nghị</label>
              <textarea
                name="suggestions"
                rows="2"
                value={formData.suggestions}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Lưu báo cáo
            </button>
          </form>
        </div>
      ) : (
        <p className="text-red-500">Không tìm thấy công việc với ID phù hợp.</p>
      )}
    </div>
  );
};

export default ReportsPage;
