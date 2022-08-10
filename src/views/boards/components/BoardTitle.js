/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import topHeader from "../../../assets/images/dashboard/top-header.png";
import { toast } from "react-toastify";
import userApi from "../../../api/UserApi";

export const BoardTitle = ({
  title,
  date,
  managerId,
  handleBoardClick,
  addition,
  settingType,
}) => {
  const [editor, setEditor] = useState();
  const getEditor = async () => {
    try {
      const param = { id: managerId };
      const response = await userApi.getById(param);
      setEditor(response);
      console.log(response);
    } catch (e) {
      toast.error(e);
    }
  };
  useEffect(() => {
    getEditor();
  }, []);
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={() => {}}
      onClick={() => handleBoardClick()}
      style={{
        height: "8rem",
        backgroundImage:
          !addition && settingType !== "None" && `url(${topHeader})`,
        backgroundSize: "800px 1000px",
      }}
      className={`title rounded p-3 font-weight-bold mb-2 ${
        addition
          ? `bg-secondary text-white d-flex justify-content-between`
          : `bg-opacity-25 text-white`
      }`}
    >
      <div className={addition ? "m-auto" : ""}>
        {addition && <i className="fa fa-plus"></i>}{" "}
        <span
          className={`h4 ${addition ? "" : "d-flex justify-content-between"}`}
        >
          <span className="text-white">{title}</span>
        </span>
        {!addition && (
          <>
            <div className="h6 text-white position-relative">
              <div className="mb-4">
                Ngày tạo: {moment(date).format("DD-MM-YYYY")}
              </div>
              <div>
                Quản lí:{" "}
                {editor && editor.accountInfo && editor.accountInfo.username}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

BoardTitle.propTypes = {
  settingType: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  bgColors: PropTypes.string.isRequired,
  managerId: PropTypes.string.isRequired,
  handleBoardClick: PropTypes.func,
};
