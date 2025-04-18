// src/pages/SoDoLienKet.js
import React, { useEffect } from 'react';

const SoDoLienKet = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    script.onload = () => {
      window.mermaid.initialize({ startOnLoad: true });
      window.mermaid.contentLoaded(); // render lại
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Sơ đồ liên kết văn bản</h1>
      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <div className="mermaid">
          {`
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
          `}
        </div>
      </div>
    </div>
  );
};

export default SoDoLienKet;
