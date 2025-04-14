
import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    linhVuc: "Tất cả",
    chuTri: "Tất cả",
    hoanThanh: "Tất cả",
    danhGia: "Tất cả",
  });

  useEffect(() => {
    axios.get("https://quanly-congviec-backend.onrender.com/api/quanly").then((response) => {
      const resData = response.data;
      setData(resData);
      setFilteredData(resData);
    });
  }, []);

  useEffect(() => {
    let result = [...data];
    if (filters.linhVuc !== "Tất cả") {
      result = result.filter((task) => task["Lĩnh vực"] === filters.linhVuc);
    }
    if (filters.chuTri !== "Tất cả") {
      result = result.filter((task) => task["Người chủ trì"] === filters.chuTri);
    }
    if (filters.hoanThanh !== "Tất cả") {
      result = result.filter((task) => task["Thời gian hoàn thành"] === filters.hoanThanh);
    }
    if (filters.danhGia !== "Tất cả") {
      result = result.filter((task) => task["Đánh giá kết quả"] === filters.danhGia);
    }
    setFilteredData(result);
  }, [filters, data]);

  const uniqueValues = (key) =>
    Array.from(new Set(data.map((item) => item[key]).filter(Boolean)));

  const isCurrentMonth = (dateString) => {
    const dateParts = dateString.split("/");
    if (dateParts.length !== 3) return false;
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const now = new Date();
    return now.getMonth() + 1 === month && now.getFullYear() === year;
  };

  const isPastMonth = (dateString) => {
    const dateParts = dateString.split("/");
    if (dateParts.length !== 3) return false;
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const now = new Date();
    return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Danh sách công việc được giao</h1>
      <p className="italic text-sm mb-2">
        Tổng số công việc: {filteredData.length}
      </p>
      <div className="overflow-x-auto rounded-md shadow border">
        <table className="table-fixed w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-100 text-gray-700 text-sm">
            <tr>
              <th className="w-[40px] px-2 py-2">#</th>
              <th className="w-[300px] px-2 py-2">TÊN CÔNG VIỆC</th>
              <th className="w-[160px] px-2 py-2">
                LĨNH VỰC
                <select
                  className="block w-full mt-1"
                  onChange={(e) =>
                    setFilters({ ...filters, linhVuc: e.target.value })
                  }
                >
                  <option>Tất cả</option>
                  {uniqueValues("Lĩnh vực").map((value, idx) => (
                    <option key={idx}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="w-[130px] px-2 py-2">TIẾN ĐỘ</th>
              <th className="w-[160px] px-2 py-2 whitespace-nowrap">
                CHỦ TRÌ
                <select
                  className="block w-full mt-1"
                  onChange={(e) =>
                    setFilters({ ...filters, chuTri: e.target.value })
                  }
                >
                  <option>Tất cả</option>
                  {uniqueValues("Người chủ trì").map((value, idx) => (
                    <option key={idx}>{value}</option>
                  ))}
                </select>
              </th>
              <th className="w-[130px] px-2 py-2">HOÀN THÀNH</th>
              <th className="w-[130px] px-2 py-2">
                ĐÁNH GIÁ
                <select
                  className="block w-full mt-1"
                  onChange={(e) =>
                    setFilters({ ...filters, danhGia: e.target.value })
                  }
                >
                  <option>Tất cả</option>
                  {uniqueValues("Đánh giá kết quả").map((value, idx) => (
                    <option key={idx}>{value}</option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center italic py-4">
                  Không có dữ liệu phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredData.map((task, index) => (
                <tr key={index} className="border-t">
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">{task["Tên công việc"]}</td>
                  <td className="px-2 py-2">{task["Lĩnh vực"]}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        isCurrentMonth(task["Tiến độ"])
                          ? "bg-yellow-100 text-yellow-800"
                          : isPastMonth(task["Tiến độ"])
                          ? "bg-gray-100 text-gray-700 border border-gray-400"
                          : ""
                      }`}
                    >
                      {task["Tiến độ"]}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">{task["Người chủ trì"]}</td>
                  <td className="px-2 py-2">{task["Thời gian hoàn thành"]}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        task["Đánh giá kết quả"] === "Hoàn thành"
                          ? "bg-green-200 text-green-800"
                          : task["Đánh giá kết quả"] === "Theo tiến độ"
                          ? "bg-yellow-200 text-yellow-800"
                          : task["Đánh giá kết quả"] === "Chậm tiến độ"
                          ? "bg-orange-200 text-orange-800"
                          : task["Đánh giá kết quả"] === "Không hoàn thành"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {task["Đánh giá kết quả"]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardPage;
