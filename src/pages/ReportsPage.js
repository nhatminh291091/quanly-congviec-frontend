import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import Header from '../components/Header';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
        const data = rawData.flat();
        const filtered = data.filter(task => task['Mô tả kết quả thực hiện']);
        setReports(filtered);
      } catch (error) {
        console.error('Lỗi tải dữ liệu báo cáo:', error);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleEvaluate = (index) => {
    const updated = [...reports];
    updated[index]['Đánh giá kết quả'] = selectedEvaluation;
    setReports(updated);
    setEditingIndex(null);
    setSelectedEvaluation('');
    alert('Đã cập nhật đánh giá kết quả (giả lập)');
  };

  return (
    <div className="p-6">
      <Header title="Công việc đã báo cáo" />
      {isLoading ? (
        <p className="italic text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-auto">
          <table className="table-auto w-full border">
            <thead className="bg-blue-100">
              <tr>
                <th>#</th>
                <th>Tên công việc</th>
                <th>Tiến độ</th>
                <th>Người thực hiện</th>
                <th>Đơn vị phối hợp</th>
                <th>Mô tả kết quả</th>
                <th>Tồn tại</th>
                <th>Hoàn thành</th>
                <th>Đề xuất</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-t">
                  <td>{i + 1}</td>
                  <td className="font-semibold text-blue-700">{r['Tên công việc']}</td>
                  <td>{r['Tiến độ']}</td>
                  <td>{r['Người thực hiện']}</td>
                  <td>{r['Đơn vị phối hợp']}</td>
                  <td>{r['Mô tả kết quả thực hiện']}</td>
                  <td>{r['Tồn tại, nguyên nhân']}</td>
                  <td>{r['Thời gian hoàn thành']}</td>
                  <td>{r['Đề xuất, kiến nghị']}</td>
                  <td>
                    {editingIndex === i ? (
                      <div className="flex gap-2">
                        <select
                          value={selectedEvaluation}
                          onChange={e => setSelectedEvaluation(e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="">-- Chọn --</option>
                          <option>Hoàn thành</option>
                          <option>Theo tiến độ</option>
                          <option>Chậm tiến độ</option>
                          <option>Không hoàn thành</option>
                        </select>
                        <button
                          className="bg-green-500 text-white px-2 rounded"
                          onClick={() => handleEvaluate(i)}
                        >✔</button>
                      </div>
                    ) : (
                      <button
                        className="text-indigo-600 underline text-sm"
                        onClick={() => setEditingIndex(i)}
                      >Đánh giá</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;