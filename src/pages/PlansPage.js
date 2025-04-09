import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';

const PlansPage = () => {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setPlans([
        {
          id: 1,
          title: 'Xây dựng kế hoạch đào tạo nhân sự quý II/2025',
          deadline: '2025-05-15',
          status: 'Theo tiến độ',
          field: 'Nhân sự',
          manager: 'Nguyễn Văn A',
          assignees: ['Lê Văn C', 'Phạm Thị D'],
          collaborators: ['Phòng Nhân sự', 'Phòng Đào tạo'],
          description: 'Xây dựng kế hoạch đào tạo cho nhân sự mới và nâng cao kỹ năng cho nhân sự hiện tại',
          details: 'Kế hoạch bao gồm các khóa đào tạo kỹ năng mềm, kỹ năng chuyên môn và kỹ năng quản lý.'
        },
        {
          id: 2,
          title: 'Lập kế hoạch ngân sách quý III/2025',
          deadline: '2025-06-20',
          status: 'Theo tiến độ',
          field: 'Tài chính',
          manager: 'Trần Thị B',
          assignees: ['Hoàng Văn E'],
          collaborators: ['Phòng Tài chính', 'Ban Giám đốc'],
          description: 'Lập kế hoạch ngân sách cho các hoạt động trong quý III/2025',
          details: 'Kế hoạch bao gồm ngân sách cho các dự án, hoạt động đào tạo, marketing và vận hành.'
        },
        {
          id: 3,
          title: 'Kế hoạch triển khai dự án XYZ',
          deadline: '2025-05-30',
          status: 'Theo tiến độ',
          field: 'Dự án',
          manager: 'Nguyễn Văn A',
          assignees: ['Vũ Thị F'],
          collaborators: ['Phòng Kỹ thuật', 'Phòng Kinh doanh'],
          description: 'Lập kế hoạch triển khai dự án XYZ trong quý II/2025',
          details: 'Kế hoạch bao gồm các giai đoạn triển khai, phân công nhiệm vụ và thời gian hoàn thành.'
        },
        {
          id: 4,
          title: 'Kế hoạch marketing sản phẩm mới',
          deadline: '2025-05-10',
          status: 'Theo tiến độ',
          field: 'Marketing',
          manager: 'Trần Thị B',
          assignees: ['Phạm Thị D', 'Hoàng Văn E'],
          collaborators: ['Phòng Marketing', 'Phòng Kinh doanh'],
          description: 'Xây dựng kế hoạch marketing cho sản phẩm mới sắp ra mắt',
          details: 'Kế hoạch bao gồm chiến lược truyền thông, kênh marketing và ngân sách dự kiến.'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleViewDetail = (plan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
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

  // Filter plans based on user role
  const filteredPlans = plans.filter(plan => {
    if (user?.role === 'manager') {
      return true; // Managers see all plans
    } else {
      return plan.assignees.includes(user?.name); // Specialists see only their plans
    }
  });

  return (
    <div className="plans-page">
      <Header title="Kế hoạch công việc" />
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Danh sách kế hoạch công việc</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên kế hoạch</th>
                    <th>Lĩnh vực</th>
                    <th>Người chủ trì</th>
                    <th>Người thực hiện</th>
                    <th>Thời hạn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map(plan => (
                      <tr key={plan.id}>
                        <td>{plan.title}</td>
                        <td>{plan.field}</td>
                        <td>{plan.manager}</td>
                        <td>{plan.assignees.join(', ')}</td>
                        <td>
                          {plan.deadline}
                          {getDaysRemaining(plan.deadline) <= 10 && getDaysRemaining(plan.deadline) > 0 && (
                            <span className="badge badge-warning ml-2">
                              Còn {getDaysRemaining(plan.deadline)} ngày
                            </span>
                          )}
                          {getDaysRemaining(plan.deadline) <= 0 && (
                            <span className="badge badge-error ml-2">
                              Quá hạn
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getStatusClass(plan.status)}`}>
                            {plan.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewDetail(plan)}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">Không có kế hoạch nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {showDetailModal && selectedPlan && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Chi tiết kế hoạch</h2>
                  <button 
                    className="btn btn-icon"
                    onClick={() => setShowDetailModal(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="detail-item">
                    <h3 className="detail-label">Tên kế hoạch:</h3>
                    <p className="detail-value">{selectedPlan.title}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Lĩnh vực:</h3>
                    <p className="detail-value">{selectedPlan.field}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Người chủ trì:</h3>
                    <p className="detail-value">{selectedPlan.manager}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Người thực hiện:</h3>
                    <p className="detail-value">{selectedPlan.assignees.join(', ')}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Đơn vị phối hợp:</h3>
                    <p className="detail-value">{selectedPlan.collaborators.join(', ')}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Thời hạn:</h3>
                    <p className="detail-value">{selectedPlan.deadline}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Trạng thái:</h3>
                    <p className="detail-value">
                      <span className={`badge ${getStatusClass(selectedPlan.status)}`}>
                        {selectedPlan.status}
                      </span>
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Mô tả:</h3>
                    <p className="detail-value">{selectedPlan.description}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3 className="detail-label">Chi tiết kế hoạch:</h3>
                    <p className="detail-value">{selectedPlan.details}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlansPage;
