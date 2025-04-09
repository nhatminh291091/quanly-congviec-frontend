import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';

const StatisticsPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    byField: [],
    byAssignee: [],
    byStatus: [],
    byMonth: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('field'); // 'field', 'assignee', 'status', 'month'
  
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setStats({
        byField: [
          { field: 'Báo cáo thống kê', total: 8, completed: 3, onTrack: 4, delayed: 1, failed: 0 },
          { field: 'Kế hoạch', total: 6, completed: 2, onTrack: 3, delayed: 1, failed: 0 },
          { field: 'Nhân sự', total: 5, completed: 1, onTrack: 2, delayed: 1, failed: 1 },
          { field: 'Hành chính', total: 4, completed: 2, onTrack: 1, delayed: 1, failed: 0 },
          { field: 'Dự án', total: 7, completed: 3, onTrack: 2, delayed: 1, failed: 1 }
        ],
        byAssignee: [
          { assignee: 'Lê Văn C', total: 7, completed: 3, onTrack: 3, delayed: 1, failed: 0 },
          { assignee: 'Phạm Thị D', total: 6, completed: 2, onTrack: 3, delayed: 1, failed: 0 },
          { assignee: 'Hoàng Văn E', total: 5, completed: 2, onTrack: 2, delayed: 0, failed: 1 },
          { assignee: 'Vũ Thị F', total: 4, completed: 1, onTrack: 2, delayed: 1, failed: 0 }
        ],
        byStatus: [
          { status: 'Hoàn thành', count: 8 },
          { status: 'Theo tiến độ', count: 10 },
          { status: 'Chậm tiến độ', count: 4 },
          { status: 'Không hoàn thành', count: 2 }
        ],
        byMonth: [
          { month: 'Tháng 1', total: 20, completed: 18, onTrack: 0, delayed: 1, failed: 1 },
          { month: 'Tháng 2', total: 22, completed: 19, onTrack: 0, delayed: 2, failed: 1 },
          { month: 'Tháng 3', total: 25, completed: 20, onTrack: 0, delayed: 3, failed: 2 },
          { month: 'Tháng 4', total: 24, completed: 8, onTrack: 10, delayed: 4, failed: 2 }
        ]
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExportPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert('Chức năng xuất báo cáo PDF sẽ được triển khai trong phiên bản tiếp theo.');
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

  const renderFieldReport = () => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Lĩnh vực</th>
            <th>Tổng số</th>
            <th>Hoàn thành</th>
            <th>Theo tiến độ</th>
            <th>Chậm tiến độ</th>
            <th>Không hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {stats.byField.map((item, index) => (
            <tr key={index}>
              <td>{item.field}</td>
              <td>{item.total}</td>
              <td className="status-hoanthanh">{item.completed}</td>
              <td className="status-theotiendos">{item.onTrack}</td>
              <td className="status-chamtiendos">{item.delayed}</td>
              <td className="status-khonghoanthanh">{item.failed}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td><strong>Tổng cộng</strong></td>
            <td><strong>{stats.byField.reduce((sum, item) => sum + item.total, 0)}</strong></td>
            <td className="status-hoanthanh"><strong>{stats.byField.reduce((sum, item) => sum + item.completed, 0)}</strong></td>
            <td className="status-theotiendos"><strong>{stats.byField.reduce((sum, item) => sum + item.onTrack, 0)}</strong></td>
            <td className="status-chamtiendos"><strong>{stats.byField.reduce((sum, item) => sum + item.delayed, 0)}</strong></td>
            <td className="status-khonghoanthanh"><strong>{stats.byField.reduce((sum, item) => sum + item.failed, 0)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderAssigneeReport = () => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Người thực hiện</th>
            <th>Tổng số</th>
            <th>Hoàn thành</th>
            <th>Theo tiến độ</th>
            <th>Chậm tiến độ</th>
            <th>Không hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {stats.byAssignee.map((item, index) => (
            <tr key={index}>
              <td>{item.assignee}</td>
              <td>{item.total}</td>
              <td className="status-hoanthanh">{item.completed}</td>
              <td className="status-theotiendos">{item.onTrack}</td>
              <td className="status-chamtiendos">{item.delayed}</td>
              <td className="status-khonghoanthanh">{item.failed}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td><strong>Tổng cộng</strong></td>
            <td><strong>{stats.byAssignee.reduce((sum, item) => sum + item.total, 0)}</strong></td>
            <td className="status-hoanthanh"><strong>{stats.byAssignee.reduce((sum, item) => sum + item.completed, 0)}</strong></td>
            <td className="status-theotiendos"><strong>{stats.byAssignee.reduce((sum, item) => sum + item.onTrack, 0)}</strong></td>
            <td className="status-chamtiendos"><strong>{stats.byAssignee.reduce((sum, item) => sum + item.delayed, 0)}</strong></td>
            <td className="status-khonghoanthanh"><strong>{stats.byAssignee.reduce((sum, item) => sum + item.failed, 0)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderStatusReport = () => (
    <div className="chart-container">
      <div className="status-chart">
        {stats.byStatus.map((item, index) => (
          <div key={index} className="status-bar-container">
            <div className="status-label">{item.status}</div>
            <div 
              className={`status-bar ${getStatusClass(item.status)}`} 
              style={{ 
                width: `${(item.count / stats.byStatus.reduce((sum, i) => sum + i.count, 0)) * 100}%` 
              }}
            >
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonthlyReport = () => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Tổng số</th>
            <th>Hoàn thành</th>
            <th>Theo tiến độ</th>
            <th>Chậm tiến độ</th>
            <th>Không hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {stats.byMonth.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>
              <td>{item.total}</td>
              <td className="status-hoanthanh">{item.completed}</td>
              <td className="status-theotiendos">{item.onTrack}</td>
              <td className="status-chamtiendos">{item.delayed}</td>
              <td className="status-khonghoanthanh">{item.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSelectedReport = () => {
    switch(selectedReport) {
      case 'field':
        return renderFieldReport();
      case 'assignee':
        return renderAssigneeReport();
      case 'status':
        return renderStatusReport();
      case 'month':
        return renderMonthlyReport();
      default:
        return renderFieldReport();
    }
  };

  return (
    <div className="statistics-page">
      <Header title="Thống kê báo cáo" />
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">Báo cáo thống kê</h2>
              <div className="card-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleExportPDF}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Xuất PDF
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="report-tabs mb-4">
                <button 
                  className={`btn ${selectedReport === 'field' ? 'btn-primary' : 'btn-secondary'} mr-2`}
                  onClick={() => setSelectedReport('field')}
                >
                  Theo lĩnh vực
                </button>
                <button 
                  className={`btn ${selectedReport === 'assignee' ? 'btn-primary' : 'btn-secondary'} mr-2`}
                  onClick={() => setSelectedReport('assignee')}
                >
                  Theo người thực hiện
                </button>
                <button 
                  className={`btn ${selectedReport === 'status' ? 'btn-primary' : 'btn-secondary'} mr-2`}
                  onClick={() => setSelectedReport('status')}
                >
                  Theo trạng thái
                </button>
                <button 
                  className={`btn ${selectedReport === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedReport('month')}
                >
                  Theo tháng
                </button>
              </div>
              
              {renderSelectedReport()}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Biểu đồ tiến độ theo thời gian</h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <div className="timeline-chart">
                  {stats.byMonth.map((item, index) => (
                    <div key={index} className="month-column">
                      <div className="month-label">{item.month}</div>
                      <div className="month-bars">
                        <div 
                          className="month-bar status-hoanthanh" 
                          style={{ height: `${(item.completed / item.total) * 100}%` }}
                          title={`Hoàn thành: ${item.completed}`}
                        ></div>
                        <div 
                          className="month-bar status-theotiendos" 
                          style={{ height: `${(item.onTrack / item.total) * 100}%` }}
                          title={`Theo tiến độ: ${item.onTrack}`}
                        ></div>
                        <div 
                          className="month-bar status-chamtiendos" 
                          style={{ height: `${(item.delayed / item.total) * 100}%` }}
                          title={`Chậm tiến độ: ${item.delayed}`}
                        ></div>
                        <div 
                          className="month-bar status-khonghoanthanh" 
                          style={{ height: `${(item.failed / item.total) * 100}%` }}
                          title={`Không hoàn thành: ${item.failed}`}
                        ></div>
                      </div>
                      <div className="month-total">{item.total}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-legend mt-3">
                <div className="legend-item">
                  <div className="legend-color status-hoanthanh"></div>
                  <div className="legend-label">Hoàn thành</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color status-theotiendos"></div>
                  <div className="legend-label">Theo tiến độ</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color status-chamtiendos"></div>
                  <div className="legend-label">Chậm tiến độ</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color status-khonghoanthanh"></div>
                  <div className="legend-label">Không hoàn thành</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
