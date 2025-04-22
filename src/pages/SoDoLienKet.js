import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SoDoLienKet() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetch('/api/tonghop') // gọi API đã setup sẵn lấy từ sheet TONGHOP
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error('Lỗi tải dữ liệu:', err));
  }, []);

  const capLabels = {
    I: 'Văn bản cấp I',
    II: 'Văn bản cấp II',
    III: 'Văn bản cấp III',
    IV: 'Văn bản cấp IV',
    V: 'Văn bản cấp V'
  };

  // Nhóm văn bản theo cấp
  const grouped = docs.reduce((acc, item) => {
    const cap = item.cap?.toUpperCase() || 'Khác';
    if (!acc[cap]) acc[cap] = [];
    acc[cap].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Sơ đồ liên kết văn bản</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {['I', 'II', 'III', 'IV', 'V'].map(cap => (
          <motion.div
            key={cap}
            className="bg-white border shadow rounded-2xl p-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">{capLabels[cap]}</h2>
            <ul className="space-y-2">
              {(grouped[cap] || []).map((doc, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setSelectedDoc(doc)}
                >
                  {doc.ten}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            className="fixed bottom-6 right-6 w-full max-w-md bg-white border border-indigo-200 rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-indigo-700">Chi tiết văn bản</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-red-500">✕</button>
            </div>
            <p className="text-gray-800 font-semibold mb-2">{selectedDoc.ten}</p>
            <p className="text-gray-600 text-sm whitespace-pre-line">{selectedDoc.mota || 'Chưa có mô tả chi tiết.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
