import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import postApi from "../../../../api/postApi";
import { Markup } from "interweave";
import moment from "moment";
const MyPostTable = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [posts, setPosts] = useState([]);
  const loadPost = async () => {
    try {
      const params = {
        EditorID: user_info !== null && user_info.accountId,
        Status: 1,
      };
      const response = await postApi.getByIdAndStatus(params);
      setPosts(response);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    loadPost();
  }, []);
  const columns = [
    {
      title: "Thứ tự",
      field: "postId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    {
      title: "Tiêu đề ",
      field: "title",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.title.substring(0, 30) + "..."}</div>;
      },
    },
    {
      title: "Phụ đề",
      field: "subTitle",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.subTitle.substring(0, 50) + "..."}</div>;
      },
    },
    {
      title: "Thời gian tạo",
      field: "createTime",
      width: "1%",
      render: (rowData) => {
        return (
          <div>{moment(rowData.createTime).format("DD MM, yyyy HH:mm:ss")}</div>
        );
      },
    },
    {
      title: "Danh mục",
      field: "category",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.category.subCategory}</div>;
      },
    },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={posts}
        title="Bài viết của tôi"
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

export default MyPostTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
