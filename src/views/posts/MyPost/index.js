import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyPostTable from "../../tables/Posts/MyPostTable";
import PublishedPostTable from "../../tables/Posts/PublishedTable";
import UnpublishedPostTable from "../../tables/Posts/UnPublishedTable";

const MyPost = () => {
  const [show, setShow] = useState("Draft");
  return (
    <div>
      <ul id="top-tab-list" className="p-0 row list-inline">
        <li
          className={` ${
            show === "Draft" ? "active" : ""
          } col-lg-3 col-md-6 text-start mb-2`}
          id="draft"
          onClick={() => setShow("Draft")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-pen"
                onClick={() => setShow("Draft")}
              ></i>
            </div>
            <span>Bản nháp</span>
          </Link>
        </li>
        <li
          id="unpublished"
          className={` ${
            show === "Unpublished" ? " active" : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("Unpublished")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-hourglass"
                onClick={() => setShow("Unpublished")}
              ></i>
            </div>
            <span>Đã nộp</span>
          </Link>
        </li>
        <li
          id="published"
          className={`${
            show === "Published" ? "active" : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("Published")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-check"
                onClick={() => setShow("Published")}
              ></i>
            </div>
            <span>Đã đăng</span>
          </Link>
        </li>
      </ul>
      {show === "Draft" && <MyPostTable />}
      {show === "Unpublished" && <UnpublishedPostTable />}
      {show === "Published" && <PublishedPostTable />}
    </div>
  );
};

export default MyPost;
