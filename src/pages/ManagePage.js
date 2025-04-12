import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Header from '../components/Header';

const ManagePage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    field: '',
    title: '',
    deadline: '',
    manager: '',
    assignees: [],
    collaborators: [],
    description: ''
  });
  
  // Mock data for dropdowns
  const fields = ['Báo cáo thống kê', 'Kế hoạch', 'Nhân sự', 'Hành chính', 'Dự án', 'Tài chính'];
  const managers = ['Nguyễn Văn A', 'Trần Thị B'];
  const specialists = ['Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Vũ Thị F'];
  const collaborators = ['Phòng Kế hoạch', 'Phòng Nhân sự', 'Phòng Hành chính', 'Phòng Tài chính', 'Ban Giám đốc'];

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setTasks([
        {
          id: 1,
          title: 'Báo cáo tổng hợp quý I/2025',
          deadline: '2025-04-15',
          status: 'Theo tiến độ',
          field: 'Báo cáo thống kê',
          manager: 'Nguyễn Văn A',
          assignees: ['Lê Văn C', 'Phạm Thị D'],
          collaborators: ['Phòng Kế hoạch', 'Phòng Tài chính']
        },
        {
          id: 2,
          title: 'Xây dựng kế hoạch phát triển 6 tháng cuối năm',
          deadline: '2025-04-20',
          status: 'Theo tiến độ',
          field: 'Kế hoạch',
          manager: 'Trần Thị B',
          assignees: ['Hoàng Văn E'],
          collaborators: ['Ban Giám đốc']
        },
        {
          id: 3,
          title: 'Rà soát hồ sơ nhân sự mới',
          deadline: '2025-04-12',
          status: 'Chậm tiến độ',
          field: 'Nhân sự',
          manager: 'Nguyễn Văn A',
          assignees: ['Lê Văn C'],
          collaborators: ['Phòng Nhân sự']
        },
        {
          id: 4,
          title: 'Chuẩn bị tài liệu họp ban lãnh đạo',
          deadline: '2025-04-10',
          status: 'Theo tiến độ',
          field: 'Hành chính',
          manager: 'Trần Thị B',
          assignees: ['Phạm Thị D'],
          collaborators: ['Phòng Hành chính', 'Ban Giám đốc']
        },
        {
          id: 5,
          title: 'Kiểm tra tiến độ dự án XYZ',
          deadline: '2025-04-08',
          status: 'Hoàn thành',
          field: 'Dự án',
          manager: 'Nguyễn Văn A',
          assignees: ['Hoàng Văn E', 'Vũ Thị F'],
          collaborators: ['Phòng Kế hoạch', 'Phòng Tài chính']
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

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData({
      ...formData,
      [name]: selectedValues
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would send data to the API
    // For now, we'll just add it to our local state
    const newTask = {
      id: tasks.length + 1,
      title: formData.title,
      deadline: formData.deadline,
      status: 'Theo tiến độ',
      field: formData.field,
      manager: formData.manager,
      assignees: formData.assignees,
      collaborators: formData.collaborators
    };
    
    setTasks([...tasks, newTask]);
    setShowForm(false);
    setFormData({
      field: '',
      title: '',
      deadline: '',
      manager: '',
      assignees: [],
      collaborators: [],
      description: ''
    });
  };

  const handleAssignTask = (taskId) => {
    // In a real implementation, this would send data to the API
    // For now, we'll just log it
    console.log(`Assigning task ${taskId} to report sheet`);
    alert('Công việc đã được giao và chuyển sang sheet Báo cáo');
  };

  const handlePlanTask = (taskId) => {
    // In a real implementation, this would send data to the API
    // For now, we'll just log it
    console.log(`Adding task ${taskId} to plan sheet`);
    alert('Công việc đã được thêm vào sheet Kế hoạch');
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

  return (
    <div className="manage-page">
      <Header title="Quản lý công việc" />
      
      <div className="page-actions mb-4">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tạo công việc mới
        </button>
      </div>
      
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">Tạo công việc mới</h2>
            <button 
              className="btn btn-icon"
              onClick={() => setShowForm(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label" htmlFor="field">Lĩnh vực công tác</label>
                <select 
                  className="form-control" 
                  id="field" 
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn lĩnh vực --</option>
                  {fields.map((field, index) => (
                    <option key={index} value={field}>{field}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label className="form-label" htmlFor="manager">Người chủ trì</label>
                <select 
                  className="form-control" 
                  id="manager" 
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn người chủ trì --</option>
                  {managers.map((manager, index) => (
                    <option key={index} value={manager}>{manager}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="title">Tên công việc</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label" htmlFor="assignees">Người thực hiện</label>
                <select 
                  className="form-control" 
                  id="assignees" 
                  name="assignees"
                  multiple
                  value={formData.assignees}
                  onChange={handleMultiSelectChange}
                  required
                >
                  {specialists.map((specialist, index) => (
                    <option key={index} value={specialist}>{specialist}</option>
                  ))}
                </select>
                <small className="form-text text-muted">Giữ Ctrl để chọn nhiều người</small>
              </div>
              <div className="form-group col-md-6">
                <label className="form-label" htmlFor="collaborators">Đơn vị phối hợp</label>
                <select 
                  className="form-control" 
                  id="collaborators" 
                  name="collaborators"
                  multiple
                  value={formData.collaborators}
                  onChange={handleMultiSelectChange}
                >
                  {collaborators.map((collaborator, index) => (
                    <option key={index} value={collaborator}>{collaborator}</option>
                  ))}
                </select>
                <small className="form-text text-muted">Giữ Ctrl để chọn nhiều đơn vị</small>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">Thời hạn</label>
              <input 
                type="date" 
                className="form-control" 
                id="deadline" 
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="description">Mô tả công việc</label>
              <textarea 
                className="form-control" 
                id="description" 
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary mr-2">Lưu công việc</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Danh sách công việc</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>TT</th>
                  <th>Tên công việc</th>
                  <th>Lĩnh vực</th>
                  <th>Người chủ trì</th>
                  <th>Người thực hiện</th>
                  <th>Thời hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.field}</td>
                    <td>{task.manager}</td>
                    <td>{task.assignees.join(', ')}</td>
                    <td>
                      {task.deadline}
                      {getDaysRemaining(task.deadline) <= 10 && getDaysRemaining(task.deadline) > 0 && (
                        <span className="badge badge-warning ml-2">
                          Còn {getDaysRemaining(task.deadline)} ngày
                        </span>
                      )}
                      {getDaysRemaining(task.deadline) <= 0 && (
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
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-primary mr-1"
                          onClick={() => handleAssignTask(task.id)}
                        >
                          Giao việc
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handlePlanTask(task.id)}
                        >
                          Lập kế hoạch
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePage;
