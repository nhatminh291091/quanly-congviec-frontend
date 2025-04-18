// src/pages/SoDoLienKet.js

import React, { useEffect } from 'react';
import mermaid from 'mermaid';

const SoDoLienKet = () => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded(); // render lại khi nội dung thay đổi
  }, []);

  const chart = `
    graph TD
      A[Quy chế tổ chức và hoạt động] --> B[Quy chế làm việc]
      C[Quy chế quản lý tài chính] --> B
      D[Quy chế thực hiện dân chủ] --> B
      B --> B1[Quy chế Khoa học và Công nghệ]
      B --> B2[Quy chế chi tiêu nội bộ]
      B --> B3[Quy chế quản lý lưu học sinh]
      B --> B4[Quy chế quản lý văn bản, chứng chỉ]
      E[Quy định chức năng, nhiệm vụ, cơ cấu tổ chức] --> B
      F[Quyết định thành lập các đơn vị] --> B
  `;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-blue-800 mb-6">Sơ đồ liên kết văn bản</h1>
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <div className="mermaid">
          {chart}
        </div>
      </div>
    </div>
  );
};

export default SoDoLienKet;
