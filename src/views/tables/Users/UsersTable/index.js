import { Chip } from "@mui/material";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import UserApi from "../../../../api/UserApi";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const loadUsers = async () => {
    try {
      const params = {};
      const response = await UserApi.getAll(params);
      setUsers(response);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  const columns = [
    {
      title: "Thứ tự",
      field: "accountId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    { title: "Email", field: "email", width: "10%" },
    { title: "Số điện thoại", field: "phoneNumber", width: "10%" },
    {
      title: "Vai trò",
      field: "role",
      width: "10%",
      render: (item) => {
        switch (item.role.roleName) {
          case "User":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label={item.role.roleName}
                  color="primary"
                />
              </div>
            );
          case "Staff":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label={item.role.roleName}
                  color="secondary"
                />
              </div>
            );
          case "Editor":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label={item.role.roleName}
                  color="error"
                />
              </div>
            );
          case "Editor Manager":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label={item.role.roleName}
                  color="info"
                />
              </div>
            );
          case "Admin":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label={item.role.roleName}
                  color="warning"
                />
              </div>
            );
          default:
            return (
              <td className="py-2">
                <span className="badge badge-light">Not found</span>
              </td>
            );
        }
      },
    },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={users}
        title="Danh sách người dùng"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo người dùng",
            isFreeAction: true,
            onClick: (event) => alert("Tạo người dùng"),
          },
          {
            icon: "visibility",
            tooltip: "Xem chi tiết người dùng",
            onClick: (event) => alert("Xem chi tiết"),
          },
          {
            icon: "edit",
            tooltip: "Sửa chi tiết người dùng",
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
          rowStyle: (rowData) => ({
            // Check if read or not
            backgroundColor:
              rowData.accountId.length < 9 ? "lightgray" : "white",
            fontWeight: rowData.accountId.length < 9 ? "bold" : "",
          }),
        }}
      />
    </div>
  );
};

export default UsersTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
