
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    linhVuc: "Tất cả",
    chuTri: "Tất cả",
    hoanThanh: "Tất cả",
    danhGia: "Tất cả",
  });

  useEffect(() => {
    axios.get("https://quanly-congviec-backend.onrender.com/api/quanly")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  useEffect(() => {
    const { linhVuc, chuTri, hoanThanh, danhGia } = filters;
    const filtered = data.filter((item) => {
      const matchLinhVuc = linhVuc === "Tất cả" || item.linhvuc === linhVuc;
      const matchChuTri = chuTri === "Tất cả" || item.chutri === chuTri;
      const matchHoanThanh = hoanThanh === "Tất cả" || item.hoanthanh === hoanThanh;
      const matchDanhGia = danhGia === "Tất cả" || item.danhgia === danhGia;
      return matchLinhVuc && matchChuTri && matchHoanThanh && matchDanhGia;
    });
    setFilteredData(filtered);
  }, [filters, data]);

  const uniqueValues = (key) => [...new Set(data.map(item => item[key]).filter(Boolean))];

  const getProgressStyle = (dateStr) => {
    try {
      const [day, month, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        return "bg-yellow-100 text-yellow-800";
      } else if (date < now) {
        return "bg-gray-100 text-gray-700 border border-gray-400";
      } else {
        return "";
      }
    } catch {
      return "";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📋 Danh sách công việc được giao</h1>
      <p className="italic text-sm text-gray-500 mb-2">Tổng số công việc: {filteredData.length}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left text-sm">
              <th className="p-2 w-6">#</th>
              <th className="p-2 w-[30%]">TÊN CÔNG VIỆC</th>
              <th className="p-2 w-[15%]">
                <select className="w-full" value={filters.linhVuc} onChange={(e) => setFilters({...filters, linhVuc: e.target.value})}>
                  <option>Tất cả</option>
                  {uniqueValues("linhvuc").map(val => <option key={val}>{val}</option>)}
                </select>
              </th>
              <th className="p-2 w-[10%]">TIẾN ĐỘ</th>
              <th className="p-2 w-[15%]">
                <select className="w-full" value={filters.chuTri} onChange={(e) => setFilters({...filters, chuTri: e.target.value})}>
                  <option>Tất cả</option>
                  {uniqueValues("chutri").map(val => <option key={val}>{val}</option>)}
                </select>
              </th>
              <th className="p-2 w-[10%]">
                <select className="w-full" value={filters.hoanThanh} onChange={(e) => setFilters({...filters, hoanThanh: e.target.value})}>
                  <option>Tất cả</option>
                  {uniqueValues("hoanthanh").map(val => <option key={val}>{val}</option>)}
                </select>
              </th>
              <th className="p-2 w-[10%]">
                <select className="w-full" value={filters.danhGia} onChange={(e) => setFilters({...filters, danhGia: e.target.value})}>
                  <option>Tất cả</option>
                  {["Hoàn thành", "Theo tiến độ", "Chậm tiến độ", "Không hoàn thành", "Chưa đánh giá"].map(val => (
                    <option key={val}>{val}</option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.tencongviec}</td>
                <td className="p-2">{item.linhvuc}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full text-center inline-block ${getProgressStyle(item.tiendo)}`}>
                    {item.tiendo}
                  </span>
                </td>
                <td className="p-2">{item.chutri}</td>
                <td className="p-2">{item.hoanthanh}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full text-center inline-block ${
                    item.danhgia === "Hoàn thành" ? "bg-green-100 text-green-800" :
                    item.danhgia === "Theo tiến độ" ? "bg-blue-100 text-blue-800" :
                    item.danhgia === "Chậm tiến độ" ? "bg-yellow-100 text-yellow-800" :
                    item.danhgia === "Không hoàn thành" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {item.danhgia}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
