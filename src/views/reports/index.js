import React, { useState } from "react";
import { Link } from "react-router-dom";
import AllReportTable from "../tables/Report/AllReportTable";
import ApprovedReportTable from "../tables/Report/ApprovedReportTable";
import DeniedReportTable from "../tables/Report/DeniedReportTable";
import PendingReportTable from "../tables/Report/PendingReportTable";

const Reports = () => {
  const [show, setShow] = useState("New");
  return (
    <div>
      <ul id="top-tab-list" className="p-0 row list-inline">
        <li
          className={` ${
            show === "New" ? "active" : ""
          } col-lg-3 col-md-6 text-start mb-2`}
          id="new"
          onClick={() => setShow("New")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i class="fa fa-solid fa-flag" onClick={() => setShow("New")}></i>
            </div>
            <span>Tất cả</span>
          </Link>
        </li>
        <li
          id="pending"
          className={` ${
            show === "Pending" ? " active" : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("Pending")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-hourglass"
                onClick={() => setShow("Pending")}
              ></i>
            </div>
            <span>Đang xử lý</span>
          </Link>
        </li>
        <li
          id="approved"
          className={`${
            show === "Approved" ? "active" : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("Approved")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-check"
                onClick={() => setShow("Approved")}
              ></i>
            </div>
            <span>Đã xác thực</span>
          </Link>
        </li>
        <li
          id="denied"
          className={`${
            show === "Denied" ? " active " : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("Denied")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-ban"
                onClick={() => setShow("Denied")}
              ></i>
            </div>
            <span>Đã từ chối</span>
          </Link>
        </li>
      </ul>
      {show === "New" && <AllReportTable />}
      {show === "Pending" && <PendingReportTable />}
      {show === "Approved" && <ApprovedReportTable />}
      {show === "Denied" && <DeniedReportTable />}
    </div>
  );
};

export default Reports;
