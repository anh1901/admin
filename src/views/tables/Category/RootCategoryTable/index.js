import { Input } from "@material-ui/core";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import categoryApi from "../../../../api/categoryApi";
const RootCategoryTable = () => {
  const [rootCategoryList, setRootCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [isTypeUpdate, setIsTypeUpdate] = useState(false);
  const [temp, setTemp] = useState(0);
  const [rootCategoryType, setRootCategoryType] = useState("");
  const handleTypeChange = (e) => {
    setUpdateType(e.target.value);
  };
  async function updateCategory(id, type) {
    try {
      const param = {
        id: id,
        rootType: updateType === null ? type : updateType,
      };
      const response = await categoryApi.updateRoot(param);
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
  async function loadCategories() {
    try {
      const param = {};
      const response = await categoryApi.getAllRoot(param);
      setRootCategoryList(response);
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function deleteCategory(id) {
    try {
      const params = { id: id };
      const response = await categoryApi.deleteRoot(params);
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
  const createRootCategory = async () => {
    try {
      const params = { rootType: rootCategoryType };
      const response = await categoryApi.addRoot(params);
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
  const handleInputChange = (e) => {
    setRootCategoryType(e.target.value);
  };
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadCategories();
  }, [temp]);
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
        <Modal.Body>
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
      {/* Tạo người dùng */}
      <Modal
        scrollable={true}
        show={show2}
        onHide={handleClose2}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mm-example-row">
            <Row>
              <Col md="3">
                <b>Tên danh mục gốc </b>{" "}
              </Col>
              <Col md="9">
                <Input
                  type="text"
                  name="type"
                  id="type"
                  value={rootCategoryType}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Tên danh mục"
                ></Input>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => createRootCategory()}>
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
        <Modal.Body>
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
        data={rootCategoryList}
        title="Danh mục gốc"
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
        }}
      />
    </div>
  );
};

export default RootCategoryTable;
