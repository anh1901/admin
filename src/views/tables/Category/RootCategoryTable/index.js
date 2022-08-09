import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import CategoryApi from "../../../../api/categoryApi";

const RootCategoryTable = () => {
  const [rootCategoryList, setRootCategoryList] = useState([]);
  const loadrootCategory = async () => {
    try {
      const params = {};
      const response = await CategoryApi.getAllRoot(params);
      setRootCategoryList(response);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    loadrootCategory();
  }, []);
  const columns = [
    {
      title: "Thứ tự",
      field: "rootcategoryId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    { title: "Tên", field: "type", width: "10%" },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={rootCategoryList}
        title="Danh mục gốc"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo danh mục gốc",
            isFreeAction: true,
            onClick: (event) => alert("Tạo danh mục gốc"),
          },
          {
            icon: "edit",
            tooltip: "Sửa danh mục gốc",
            onClick: (event) => alert("Sửa"),
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

export default RootCategoryTable;
