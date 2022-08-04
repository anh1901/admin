import { Markup } from "interweave";
import MaterialTable from "material-table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import reportApi from "../../../../api/reportApi";

const PendingReportTable = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [reports, setReports] = useState([]);
  const loadReports = async () => {
    try {
      const params = { status: 2, staffID: user_info.accountId };
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
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={reports}
        title="Tất cả báo cáo đang xem xét"
        actions={[
          {
            icon: "visibility",
            tooltip: "Xem chi tiết báo cáo",
            onClick: (event) => alert("Xem chi tiết"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: {
            backgroundColor: "#1669f0",
            color: "#FFF",
          },
        }}
      />
    </div>
  );
};

export default PendingReportTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
