/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@mui/material";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import categoryApi from "../../../../api/categoryApi";

const SubCategoryTable = () => {
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [isTypeUpdate, setIsTypeUpdate] = useState(false);
  const [temp, setTemp] = useState(0);
  const [subCategoryType, setSubCategoryType] = useState("");
  // const [rootCategoryType, setRootCategoryType] = useState("");
  const [selected, setSelected] = useState();
  const loadSubCategory = async () => {
    try {
      const params = {};
      const response = await categoryApi.getAllSub(params);
      setSubCategoryList(response);
    } catch (err) {
      alert(err.message);
    }
  };
  async function loadCategory() {
    try {
      const params = {};
      const response = await categoryApi.getAllRoot(params);
      response.map((item) =>
        categoryList.push({
          value: item.rootCategoryId,
          label: item.type,
        })
      );
    } catch (e) {
      toast.error(e.message);
    }
  }
  const handleTypeChange = (e) => {
    setUpdateType(e.target.value);
  };
  async function updateCategory(id, type, root) {
    try {
      const params = {
        categoryId: id,
        subCategory: updateType === "" ? type : updateType,
        rootCategory: selected === null ? root : selected.value,
      };
      const response = await categoryApi.updateSub(params);
      if (!JSON.stringify(response).includes("error")) {
        setUpdateType("");
        toast.success(response.message);
        setShow3(false);
        setShow2(false);
        setShow(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function deleteCategory(id) {
    try {
      const params = { id: id };
      const response = await categoryApi.deleteSub(params);
      if (!JSON.stringify(response).includes("error")) {
        setDeletedCategory("");
        toast.success(response.message);
        setShow3(false);
        setShow2(false);
        setShow(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  const createCategory = async () => {
    try {
      const params = {
        subCategory: subCategoryType,
        rootCategoryID: selected.value,
      };
      const response = await categoryApi.addSub(params);
      if (!JSON.stringify(response).includes("error")) {
        toast.success(response.message);
        setShow3(false);
        setShow2(false);
        setShow(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleClose = () => {
    setShow(false);
    setIsTypeUpdate(false);
  };
  const handleClose2 = () => {
    setShow2(false);
    setIsTypeUpdate(false);
  };
  const handleClose3 = () => {
    setShow3(false);
    setIsTypeUpdate(false);
  };
  const handleShowModel3 = (data) => {
    setShow3(true);
    setDeletedCategory(data.rootCategoryId);
  };
  const handleShowModel2 = (data) => {
    setShow2(true);
    setSelectedCategory(data);
  };
  const handleShowModel = (data) => {
    setSelectedCategory(data);
    setShow(true);
  };
  const handleSubInputChange = (e) => {
    setSubCategoryType(e.target.value);
  };
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadSubCategory();
    if (categoryList.length === 0) {
      loadCategory();
    }
  }, [temp]);
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
      {/* Cập nhật */}
      <Modal
        scrollable={true}
        show={show}
        onHide={handleClose}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              <Row>
                <Col md="3">
                  <b>Tên danh mục: </b>
                </Col>
                <Col md="7">
                  {isTypeUpdate ? (
                    <Input
                      type="text"
                      name="type"
                      id="type"
                      placeholder="Tên danh mục gốc mới"
                      onChange={(e) => handleTypeChange(e)}
                    ></Input>
                  ) : (
                    <Input
                      type="text"
                      name="type"
                      id="type"
                      disabled
                      value={selectedCategory && selectedCategory.type}
                    ></Input>
                  )}
                </Col>
                <Col md="1">
                  <Button onClick={() => setIsTypeUpdate(!isTypeUpdate)}>
                    <i class="fa fa-edit"></i>
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              updateCategory(selectedCategory.rootCategoryId, updateType.type)
            }
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Tạo  */}
      <Modal show={show2} onHide={handleClose2} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tạo danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Container fluid>
            <Row className="pb-2">
              <Col md="3">
                <b>Tên danh mục phụ: </b>{" "}
              </Col>
              <Col md="9">
                <Input
                  type="text"
                  name="type"
                  id="type"
                  value={subCategoryType}
                  onChange={(e) => handleSubInputChange(e)}
                  placeholder="Tên danh mục phụ"
                ></Input>
              </Col>
            </Row>
            <Row styles={{ paddingBottom: "10rem" }}>
              <Col md="3">
                <b>Chọn danh mục gốc:</b>
              </Col>
              <Col md="7">
                <Select
                  name="category"
                  options={categoryList}
                  onChange={(option) => setSelected(option)}
                  placeholder="Chọn danh mục gốc"
                  defaultValue={selected}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => createCategory()}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Xóa */}
      <Modal
        scrollable={true}
        show={show3}
        onHide={handleClose3}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xóa danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">Bạn chắc chắn muốn xóa?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Đóng
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteCategory(deletedCategory)}
          >
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <MaterialTable
        columns={columns}
        data={subCategoryList}
        title="Danh sách danh mục phụ"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo",
            isFreeAction: true,
            onClick: (event, rowData) => handleShowModel2(rowData),
          },
          {
            icon: "edit",
            tooltip: "Sửa",
            onClick: (event, rowData) => handleShowModel(rowData),
          },
          {
            icon: "delete",
            tooltip: "Xóa",
            onClick: (event, rowData) => handleShowModel3(rowData),
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
              rowData.tableData.id % 2 !== 0 ? "lightgray" : "white",
          }),
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
