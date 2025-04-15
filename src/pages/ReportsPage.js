import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

const ReportsPage = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    evaluation: '',
    issues: '',
    completionDate: '',
    suggestions: ''
  });

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const selectedIdFromUrl = query.get('id');

  const evaluationOptions = ['Hoàn thành', 'Theo tiến độ', 'Chậm tiến độ', 'Không hoàn thành'];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const rawData = await apiService.get('api/tasks/all');
        const data = rawData.flat();
        setReports(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!isLoading && selectedIdFromUrl) {
      const matched = reports.find(r => String(r.id) === selectedIdFromUrl);
      if (matched) {
        handleSelectReport(matched);
      }
    }
  }, [isLoading, reports, selectedIdFromUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setFormData({
      description: report['Mô tả kết quả thực hiện'] || '',
      evaluation: report['Đánh giá kết quả'] || '',
      issues: report['Tồn tại, nguyên nhân'] || '',
      completionDate: report['Thời gian hoàn thành'] || '',
      suggestions: report['Đề xuất, kiến nghị'] || ''
    });
    setShowUpdateForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API cập nhật dữ liệu thực tế
    alert('Đã cập nhật (giả lập).');
  };

  return (
    <div className="reports-page">
      <Header title="Báo cáo công việc" />
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {showUpdateForm && selectedReport ? (
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="card-title">Cập nhật báo cáo: {selectedReport['Tên công việc']}</h2>
                <button className="btn btn-icon" onClick={() => setShowUpdateForm(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="form p-4">
                <div className="mb-3"><strong>Tên công việc:</strong> {selectedReport['Tên công việc']}</div>
                <div className="mb-3"><strong>Lĩnh vực:</strong> {selectedReport['Các lĩnh vực công tác']}</div>
                <div className="mb-3"><strong>Người chủ trì:</strong> {selectedReport['Người chủ trì']}</div>
                <div className="mb-3"><strong>Thời hạn:</strong> {selectedReport['Tiến độ']}</div>

                <div className="form-group">
                  <label htmlFor="description">Mô tả kết quả thực hiện</label>
                  <textarea id="description" name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="evaluation">Đánh giá kết quả</label>
                    <select id="evaluation" name="evaluation" className="form-control" value={formData.evaluation} onChange={handleInputChange} required>
                      <option value="">-- Chọn đánh giá --</option>
                      {evaluationOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="completionDate">Thời gian hoàn thành</label>
                    <input type="date" id="completionDate" name="completionDate" className="form-control" value={formData.completionDate} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="issues">Tồn tại, nguyên nhân</label>
                  <textarea id="issues" name="issues" className="form-control" rows="2" value={formData.issues} onChange={handleInputChange}></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="suggestions">Đề xuất, kiến nghị</label>
                  <textarea id="suggestions" name="suggestions" className="form-control" rows="2" value={formData.suggestions} onChange={handleInputChange}></textarea>
                </div>

                <div className="form-actions mt-4">
                  <button type="submit" className="btn btn-primary mr-2">Cập nhật báo cáo</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>Hủy</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Danh sách công việc cần báo cáo</h2>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tên công việc</th>
                      <th>Lĩnh vực</th>
                      <th>Người chủ trì</th>
                      <th>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i}>
                        <td>{r['Tên công việc']}</td>
                        <td>{r['Các lĩnh vực công tác']}</td>
                        <td>{r['Người chủ trì']}</td>
                        <td>{r['Tiến độ']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
