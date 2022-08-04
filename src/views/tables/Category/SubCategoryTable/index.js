import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import categoryApi from "../../../../api/categoryApi";

const SubCategoryTable = () => {
  const [subCategoryList, setSubCategoryList] = useState([]);
  const loadSubCategory = async () => {
    try {
      const params = {};
      const response = await categoryApi.getAllSub(params);
      setSubCategoryList(response);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    loadSubCategory();
  }, []);
  const columns = [
    {
      title: "Thứ tự",
      field: "categoryId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    { title: "Tên", field: "subCategory", width: "10%" },
    {
      title: "Danh mục gốc",
      field: "rootCategoryNavigation",
      width: "10%",
      render: (rowData) => {
        return <div>{rowData.rootCategoryNavigation.type}</div>;
      },
    },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={columns}
        data={subCategoryList}
        title="Danh sách danh mục phụ"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo danh mục phụ",
            isFreeAction: true,
            onClick: (event) => alert("Tạo danh mục phụ"),
          },
          {
            icon: "visibility",
            tooltip: "Xem chi tiết",
            onClick: (event) => alert("Xem chi tiết"),
          },
          {
            icon: "edit",
            tooltip: "Sửa chi tiết",
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

export default SubCategoryTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
