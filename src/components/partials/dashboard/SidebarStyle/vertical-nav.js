import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion } from "react-bootstrap";

const VerticalNav = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  //location
  let location = useLocation();
  return (
    <>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Quản lí chung</span>
            <span className="mini-icon">-</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`${
              location.pathname === "/admin/dashboard" ? "active" : ""
            } nav-link `}
            aria-current="page"
            to="/admin/dashboard"
            onClick={() => {}}
          >
            <i className="fa fa-solid fa-chart-line"></i>
            <span className="item-name">Bảng điều khiển</span>
          </Link>
        </li>
        {user_info.role.roleId === 5 && (
          <li className="nav-item">
            <Link
              className={`${
                location.pathname === "/users" ? "active" : ""
              } nav-link `}
              aria-current="page"
              to="/admin/users"
              onClick={() => {}}
            >
              <i className="fa fa-solid fa-users"></i>
              <span className="item-name">Quản lí người dùng</span>
            </Link>
          </li>
        )}
        {user_info.role.roleId === 4 && (
          <li className="nav-item">
            <Link
              className={`${
                location.pathname === "/employees" ? "active" : ""
              } nav-link `}
              aria-current="page"
              to="/admin/employees"
              onClick={() => {}}
            >
              <i className="fa fa-solid fa-user-tag"></i>
              <span className="item-name">Quản lí nhân viên</span>
            </Link>
          </li>
        )}
        {(user_info.role.roleId === 4 || user_info.role.roleId === 5) && (
          <>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/category/root" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/category/root"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-tag"></i>
                <span className="item-name">Quản lí danh mục gốc</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/category/sub" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/category/sub"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-tags"></i>
                <span className="item-name">Quản lí danh mục phụ</span>
              </Link>
            </li>
          </>
        )}
        {user_info.role.roleId === 2 && (
          <>
            <li className="nav-item static-item">
              <Link
                className="nav-link static-item disabled"
                to="#"
                tabIndex="-1"
              >
                <span className="default-icon">Staff</span>
                <span className="mini-icon">-</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/create-report" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/create-report"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-file-signature"></i>
                <span className="item-name">Tạo báo cáo</span>
              </Link>
            </li>
            <li>
              <hr className="hr-horizontal" />
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/reports" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/reports"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-list"></i>
                <span className="item-name">Danh sách báo cáo</span>
              </Link>
            </li>
          </>
        )}
        {user_info.role.roleId === 3 && (
          <>
            <li className="nav-item static-item">
              <Link
                className="nav-link static-item disabled"
                to="#"
                tabIndex="-1"
              >
                <span className="default-icon">Editor</span>
                <span className="mini-icon">-</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/my-tasks" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/my-tasks"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-bars"></i>
                <span className="item-name">Công việc của tôi</span>
              </Link>
            </li>
            <li>
              <hr className="hr-horizontal" />
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/create-post" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/create-post"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-pen-nib"></i>
                <span className="item-name">Tạo bài viết</span>
              </Link>
            </li>
            <li>
              <hr className="hr-horizontal" />
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/my-posts" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/my-posts"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-newspaper"></i>
                <span className="item-name">Bài viết của tôi</span>
              </Link>
            </li>
          </>
        )}
        {user_info.role.roleId === 4 && (
          <>
            <li className="nav-item static-item">
              <Link
                className="nav-link static-item disabled"
                to="#"
                tabIndex="-1"
              >
                <span className="default-icon">Editor Manager</span>
                <span className="mini-icon">-</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/task-boards" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/task-boards"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-bars"></i>
                <span className="item-name">Quản lí công việc</span>
              </Link>
            </li>
            <li>
              <hr className="hr-horizontal" />
            </li>
            <li className="nav-item">
              <Link
                className={`${
                  location.pathname === "/posts" ? "active" : ""
                } nav-link `}
                aria-current="page"
                to="/admin/posts"
                onClick={() => {}}
              >
                <i className="fa fa-solid fa-pen-nib"></i>
                <span className="item-name">Quản lí bài viết</span>
              </Link>
            </li>
          </>
        )}
      </Accordion>
    </>
  );
};

export default VerticalNav;
