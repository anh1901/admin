import { Chip } from "@mui/material";
import { Markup } from "interweave";
import MaterialTable from "material-table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import reportApi from "../../../../api/reportApi";
import "../../style.css";
const AllReportTable = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [reports, setReports] = useState([]);
  const loadReports = async () => {
    try {
      const params = { status: 1 };
      const response = await reportApi.getByStatus(params);
      setReports(response);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    loadReports();
  }, []);
  const columns = [
    {
      title: "Thứ tự",
      field: "reportId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    { title: "Địa diểm", field: "location", width: "10%" },
    {
      title: "Thời gian gửi",
      field: "createTime",
      width: "10%",
      render: (rowData) => {
        return (
          <div>{moment(rowData.createTime).format("DD.MM.YYYY HH:mm:ss")}</div>
        );
      },
    },
    {
      title: "Nội dung",
      field: "description",
      width: "10%",
      render: (rowData) => {
        return (
          <td
            className="py font-weight-bold"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "20rem",
            }}
          >
            <Markup
              content={rowData.description}
              allowAttributes
              allowElements
              blockList={["img", "iframe"]}
              noHtml={true}
            />
          </td>
        );
      },
    },
    {
      title: "Trạng thái",
      field: "reportViews",
      width: "10%",
      render: (rowData) => {
        return (
          <div className="bluebag">
            {!(
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
            ) && (
              <Chip
                key={rowData.tableData.id}
                label={"Chưa đọc"}
                color="error"
              />
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={reports}
        title="Tất cả báo cáo mới"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo báo cáo",
            isFreeAction: true,
            onClick: (event) => alert("Tạo báo cáo"),
          },
          {
            icon: "visibility",
            tooltip: "Xem chi tiết báo cáo",
            onClick: (event) => alert("Xem chi tiết"),
          },
        ]}
        options={{
          pageSize: 10,
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: {
            backgroundColor: "#1669f0",
            color: "#FFF",
          },
          rowStyle: (rowData) => ({
            // Check if read or not
            backgroundColor:
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
                ? "white"
                : "lightgray",
            fontWeight:
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
                ? ""
                : "bold",
          }),
        }}
      />
    </div>
  );
};

export default AllReportTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
