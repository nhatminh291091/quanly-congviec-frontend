import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

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
    setTimeout(() => {
      const mockData = [
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
      ];

      setReports(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isLoading && selectedIdFromUrl) {
      const matched = reports.find(r => r.title === selectedIdFromUrl);
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
    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          description: formData.description,
          evaluation: formData.evaluation,
          issues: formData.issues,
          completionDate: formData.completionDate,
          suggestions: formData.suggestions,
          status: formData.evaluation
        };
      }
      return report;
    });
    setReports(updatedReports);
    setShowUpdateForm(false);
    setSelectedReport(null);
    alert('Cập nhật báo cáo thành công!');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Hoàn thành': return 'status-hoanthanh';
      case 'Theo tiến độ': return 'status-theotiendos';
      case 'Chậm tiến độ': return 'status-chamtiendos';
      case 'Không hoàn thành': return 'status-khonghoanthanh';
      default: return '';
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredReports = reports.filter(report => {
    if (user?.role === 'manager') return true;
    return report.assignee === user?.name;
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
                <button className="btn btn-icon" onClick={() => setShowUpdateForm(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>/* form giữ nguyên như cũ */</form>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Danh sách công việc cần báo cáo</h2>
              </div>
              <div className="table-container">
                <table className="table">/* bảng giữ nguyên */</table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
