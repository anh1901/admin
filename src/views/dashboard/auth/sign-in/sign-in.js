import React from "react";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import loginApi from "../../../../api/loginApi";
import { toast } from "react-toastify";
import "./sign-in-style.css";
const SignIn = () => {
  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Cần nhập mật khẩu";
    }
    if (!values.account) {
      errors.account = "Cần nhập account /số điện thoại";
    } else if (isNaN(values.account) === true) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.account)) {
        errors.account = "Không đúng định dạng account ";
      } else {
        return;
      }
    } else if (isNaN(values.account) === false) {
      if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(values.account)) {
        errors.account = "Không đúng định dạng số điện thoại ";
      } else {
        return;
      }
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      account: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      user_login(values);
    },
  });

  async function user_login(values) {
    console.log("Login");
    try {
      const json = JSON.stringify({
        account: values.account,
        password: values.password,
      });
      const response = await loginApi.getAll(json);
      console.log("Response", response);
      if (
        !JSON.stringify(response).includes("error") &&
        response.role.roleId === 1
      ) {
        toast.warning("Tài khoản này không có quyền vào hệ thống");
      } else if (!JSON.stringify(response).includes("error")) {
        localStorage.setItem("user_info", JSON.stringify(response));
        window.location.href = "/admin/dashboard";
      } else if (JSON.stringify(response).includes("error")) {
        toast.error("Thông tin đăng nhập không chính xác hãy kiểm tra lại.");
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <>
      <div className="SignIn">
        <div className="appAside"></div>
        <div className="appForm">
          <h2 className="mb-2 text-center">Đăng nhập</h2>
          <p className="text-center">Trang quản lí báo cáo</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="">
              <label className="" for="account">
                Email / Số điện thoại
              </label>
              <input
                id="account"
                name="account"
                type="text"
                className="formFieldInput"
                placeholder="Email / Số điện thoại"
                value={formik.values.account}
                onChange={formik.handleChange}
              />
            </div>
            <div className="formField">
              <label className="formFieldLabel" htmlFor="password">
                Mật khẩu
              </label>
              <input
                className="formFieldInput"
                id="password"
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
            <div className="d-flex justify-content-center">
              <Button type="submit" variant="btn btn-primary">
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
