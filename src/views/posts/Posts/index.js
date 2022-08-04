import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublishedPostTable from "../../tables/Posts/PublishedTable";
import UnpublishedPostTable from "../../tables/Posts/UnPublishedTable";

const Posts = () => {
  const [show, setShow] = useState("UnPublished");

  return (
    <div>
      <ul id="top-tab-list" className="p-0 row list-inline">
        <li
          id="unPublished"
          className={` ${
            show === "UnPublished" ? " active" : ""
          } col-lg-3 col-md-6 mb-2 text-start`}
          onClick={() => setShow("UnPublished")}
        >
          <Link to="#">
            <div className="iq-icon me-3">
              <i
                class="fa fa-solid fa-hourglass"
                onClick={() => setShow("UnPublished")}
              ></i>
            </div>
            <span>Chưa đăng</span>
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
      {show === "UnPublished" && <UnpublishedPostTable />}
      {show === "Published" && <PublishedPostTable />}
    </div>
  );
};

export default Posts;
