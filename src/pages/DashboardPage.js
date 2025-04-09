import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    onTrack: 0,
    delayed: 0,
    failed: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setStats({
        total: 24,
        completed: 8,
        onTrack: 10,
        delayed: 4,
        failed: 2
      });
      
      setUpcomingTasks([
        {
          id: 1,
          title: 'Báo cáo tổng hợp quý I/2025',
          dueDate: '2025-04-15',
          status: 'Theo tiến độ',
          field: 'Báo cáo thống kê',
          assignee: 'Nguyễn Văn A'
        },
        {
          id: 2,
          title: 'Xây dựng kế hoạch phát triển 6 tháng cuối năm',
          dueDate: '2025-04-20',
          status: 'Theo tiến độ',
          field: 'Kế hoạch',
          assignee: 'Trần Thị B'
        },
        {
          id: 3,
          title: 'Rà soát hồ sơ nhân sự mới',
          dueDate: '2025-04-12',
          status: 'Chậm tiến độ',
          field: 'Nhân sự',
          assignee: 'Lê Văn C'
        },
        {
          id: 4,
          title: 'Chuẩn bị tài liệu họp ban lãnh đạo',
          dueDate: '2025-04-10',
          status: 'Theo tiến độ',
          field: 'Hành chính',
          assignee: 'Phạm Thị D'
        },
        {
          id: 5,
          title: 'Kiểm tra tiến độ dự án XYZ',
          dueDate: '2025-04-08',
          status: 'Hoàn thành',
          field: 'Dự án',
          assignee: 'Hoàng Văn E'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

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

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="dashboard-page">
      <Header title="Dashboard" />
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#3f51b5' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Tổng số công việc</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#4caf50' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Hoàn thành</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#2196f3' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.onTrack}</div>
                <div className="stat-label">Theo tiến độ</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#ff9800' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.delayed}</div>
                <div className="stat-label">Chậm tiến độ</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#f44336' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.failed}</div>
                <div className="stat-label">Không hoàn thành</div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Công việc sắp đến hạn</h2>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tên công việc</th>
                        <th>Lĩnh vực</th>
                        <th>Người thực hiện</th>
                        <th>Thời hạn</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingTasks.map(task => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>{task.field}</td>
                          <td>{task.assignee}</td>
                          <td>
                            {task.dueDate}
                            {getDaysRemaining(task.dueDate) <= 10 && getDaysRemaining(task.dueDate) > 0 && (
                              <span className="badge badge-warning ml-2">
                                Còn {getDaysRemaining(task.dueDate)} ngày
                              </span>
                            )}
                            {getDaysRemaining(task.dueDate) <= 0 && (
                              <span className="badge badge-error ml-2">
                                Quá hạn
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getStatusClass(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Phân bổ trạng thái</h2>
                </div>
                <div className="chart-container">
                  {/* In a real implementation, this would be a chart */}
                  <div className="placeholder-chart">
                    <div className="chart-segment" style={{ height: '33%', backgroundColor: '#4caf50' }}>
                      <span>Hoàn thành: {Math.round(stats.completed / stats.total * 100)}%</span>
                    </div>
                    <div className="chart-segment" style={{ height: '42%', backgroundColor: '#2196f3' }}>
                      <span>Theo tiến độ: {Math.round(stats.onTrack / stats.total * 100)}%</span>
                    </div>
                    <div className="chart-segment" style={{ height: '17%', backgroundColor: '#ff9800' }}>
                      <span>Chậm tiến độ: {Math.round(stats.delayed / stats.total * 100)}%</span>
                    </div>
                    <div className="chart-segment" style={{ height: '8%', backgroundColor: '#f44336' }}>
                      <span>Không hoàn thành: {Math.round(stats.failed / stats.total * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
