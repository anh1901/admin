import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import "moment/locale/vi";

export const BoardTitle = ({
  title,
  date,
  managerId,
  handleBoardClick,
  addition,
  settingType,
}) => {
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={() => {}}
      onClick={() => handleBoardClick()}
      style={{
        height: "8rem",
        background:
          !addition &&
          (settingType === "Delete"
            ? `linear-gradient(to right,#FE0944,#FEAE96)`
            : settingType === "Renamed"
            ? `linear-gradient(to right,#009FFD,#2A2A72)`
            : settingType === "None"
            ? `linear-gradient(to right,#D65BCA,#1FD1F9)`
            : `linear-gradient(to right,#D65BCA,#1FD1F9)`),
      }}
      className={`title rounded p-3 font-weight-bold mb-2  ${
        addition
          ? `bg-secondary text-white d-flex justify-content-between`
          : `bg-opacity-25 text-white`
      }`}
    >
      <div className={addition ? "m-auto" : ""}>
        {addition && <i className="fa fa-plus"></i>}{" "}
        <span
          className={`h3 ${addition ? "" : "d-flex justify-content-between"}`}
        >
          <span>{title}</span>
        </span>
        {!addition && (
          <>
            <div className="h6 text-white">
              {moment(date).format("MMM Do YYYY")}
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
