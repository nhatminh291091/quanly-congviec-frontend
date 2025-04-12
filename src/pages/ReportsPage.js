import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';

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
  
  // Mock data for dropdowns
  const evaluationOptions = ['Hoàn thành', 'Theo tiến độ', 'Chậm tiến độ', 'Không hoàn thành'];

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: 'Báo cáo tổng hợp quý I/2025',
          deadline: '2025-04-15',
          status: 'Theo tiến độ',
          field: 'Báo cáo thống kê',
          manager: 'Nguyễn Văn A',
          assignee: 'Lê Văn C',
          collaborators: ['Phòng Kế hoạch', 'Phòng Tài chính'],
          description: '',
          evaluation: '',
          issues: '',
          completionDate: '',
          suggestions: ''
        },
        {
          id: 2,
          title: 'Xây dựng kế hoạch phát triển 6 tháng cuối năm',
          deadline: '2025-04-20',
          status: 'Theo tiến độ',
          field: 'Kế hoạch',
          manager: 'Trần Thị B',
          assignee: 'Hoàng Văn E',
          collaborators: ['Ban Giám đốc'],
          description: 'Đã hoàn thành bản thảo đầu tiên, đang chờ góp ý',
          evaluation: 'Theo tiến độ',
          issues: '',
          completionDate: '2025-04-18',
          suggestions: ''
        },
        {
          id: 3,
          title: 'Rà soát hồ sơ nhân sự mới',
          deadline: '2025-04-12',
          status: 'Chậm tiến độ',
          field: 'Nhân sự',
          manager: 'Nguyễn Văn A',
          assignee: 'Lê Văn C',
          collaborators: ['Phòng Nhân sự'],
          description: 'Đã rà soát 70% hồ sơ',
          evaluation: 'Chậm tiến độ',
          issues: 'Thiếu thông tin từ ứng viên',
          completionDate: '2025-04-14',
          suggestions: 'Cần bổ sung quy trình thu thập thông tin'
        },
        {
          id: 4,
          title: 'Chuẩn bị tài liệu họp ban lãnh đạo',
          deadline: '2025-04-10',
          status: 'Hoàn thành',
          field: 'Hành chính',
          manager: 'Trần Thị B',
          assignee: 'Phạm Thị D',
          collaborators: ['Phòng Hành chính', 'Ban Giám đốc'],
          description: 'Đã hoàn thành và gửi tài liệu cho các thành viên',
          evaluation: 'Hoàn thành',
          issues: '',
          completionDate: '2025-04-09',
          suggestions: ''
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setFormData({
      description: report.description || '',
      evaluation: report.evaluation || '',
      issues: report.issues || '',
      completionDate: report.completionDate || '',
      suggestions: report.suggestions || ''
    });
    setShowUpdateForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would send data to the API
    // For now, we'll just update our local state
    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          description: formData.description,
          evaluation: formData.evaluation,
          issues: formData.issues,
          completionDate: formData.completionDate,
          suggestions: formData.suggestions,
          status: formData.evaluation // Update status based on evaluation
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    setShowUpdateForm(false);
    setSelectedReport(null);
    
    // Show success message
    alert('Cập nhật báo cáo thành công!');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Hoàn thành':
        return 'status-hoanthanh';
      case 'Theo tiến độ':
        return 'status-theotiendos';
      case 'Chậm tiến độ':
        return 'status-chamtiendos';
      case 'Không hoàn thành':
        return 'status-khonghoanthanh';
      default:
        return '';
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter reports based on user role
  const filteredReports = reports.filter(report => {
    if (user?.role === 'manager') {
      return true; // Managers see all reports
    } else {
      return report.assignee === user?.name; // Specialists see only their reports
    }
  });

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
                <h2 className="card-title">Cập nhật báo cáo: {selectedReport.title}</h2>
                <button 
                  className="btn btn-icon"
                  onClick={() => setShowUpdateForm(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Mô tả kết quả thực hiện</label>
                  <textarea 
                    className="form-control" 
                    id="description" 
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="evaluation">Đánh giá kết quả</label>
                    <select 
                      className="form-control" 
                      id="evaluation" 
                      name="evaluation"
                      value={formData.evaluation}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Chọn đánh giá --</option>
                      {evaluationOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="completionDate">Thời gian hoàn thành</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="completionDate" 
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="issues">Tồn tại, nguyên nhân</label>
                  <textarea 
                    className="form-control" 
                    id="issues" 
                    name="issues"
                    rows="2"
                    value={formData.issues}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="suggestions">Đề xuất, kiến nghị</label>
                  <textarea 
                    className="form-control" 
                    id="suggestions" 
                    name="suggestions"
                    rows="2"
                    value={formData.suggestions}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="form-actions">
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
                      <th>Thời hạn</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map(report => (
                        <tr key={report.id}>
                          <td>{report.title}</td>
                          <td>{report.field}</td>
                          <td>{report.manager}</td>
                          <td>
                            {report.deadline}
                            {getDaysRemaining(report.deadline) <= 10 && getDaysRemaining(report.deadline) > 0 && (
                              <span className="badge badge-warning ml-2">
                                Còn {getDaysRemaining(report.deadline)} ngày
                              </span>
                            )}
                            {getDaysRemaining(report.deadline) <= 0 && (
                              <span className="badge badge-error ml-2">
                                Quá hạn
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getStatusClass(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleSelectReport(report)}
                            >
                              Cập nhật
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">Không có công việc nào cần báo cáo</td>
                      </tr>
                    )}
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
