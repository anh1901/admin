/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Chip } from "@mui/material";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import userApi from "../../../../api/UserApi";
import UserApi from "../../../../api/UserApi";
import Select from "react-select";
import categoryApi from "../../../../api/categoryApi";
import registerApi from "../../../../api/registerApi";

const roleList = [
  {
    value: 2,
    label: "Staff",
  },
  {
    value: 3,
    label: "Editor",
  },
];
const EmployeeTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [temp, setTemp] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [idcard, setIdcard] = useState("");
  const [specialize, setSpecialize] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const loadUsers = async () => {
    try {
      const params = {};
      const response = await UserApi.getAll(params);
      setUsers(
        response.filter(
          (user) => user.role.roleId === 3 || user.role.roleId === 2
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };
  const fetchCategoryList = async () => {
    try {
      const params = {};
      await categoryApi.getAllRoot(params).then((list) =>
        list.map((category) =>
          categoryList.push({
            value: category.rootCategoryId,
            label: category.type,
          })
        )
      );
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleShowModel2 = () => {
    setShow2(true);
    setEmail();
    setPassword();
    setPhone();
    setRole();
    setUsername();
    setAddress();
    setIdcard();
    setSpecialize();
    try {
      loadUsers();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleShowModel = (user_data) => {
    setSelectedUser(user_data);
    setPassword(user_data.password);
    setUsername(user_data.accountInfo.username);
    setAddress(user_data.accountInfo.address);
    setIdcard(user_data.accountInfo.identityCard);
    setShow(true);
    try {
      loadUsers();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleUpdate = async () => {
    try {
      const params = {
        accountID: selectedUser.accountId,
        password: password,
        username: username,
        address: address,
        identityCard: idcard,
        specialize: specialize.value,
      };
      const response = await userApi.update(params);
      if (!JSON.stringify(response).includes("error")) {
        setShow(false);
        setSelectedUser();
        setPassword();
        setUsername();
        setAddress();
        setIdcard();
        toast.success(response.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const create_user = async () => {
    try {
      const params = {
        email: email,
        password: password,
        roleId: role.value,
        phoneNumber: phone,
        username: username,
        address: address,
        identityCard: idcard,
      };
      const response = await registerApi.createUser(params);
      if (!JSON.stringify(response).includes("error")) {
        setShow2(false);
        setEmail();
        setPassword();
        setPhone();
        setRole();
        setUsername();
        setAddress();
        setIdcard();
        setSpecialize();
        toast.success(response.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleClose = () => {
    setShow(false);
    setSelectedUser();
    setPassword();
    setUsername();
    setAddress();
    setIdcard();
    setSpecialize();
  };
  const handleClose2 = () => {
    setShow2(false);
    setEmail();
    setPassword();
    setPhone();
    setRole();
    setUsername();
    setAddress();
    setIdcard();
    setSpecialize();
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleRoleChange = (e) => {
    setRole(e);
    if (e.value !== 3) {
      setSpecialize();
    }
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleIdcardChange = (e) => {
    setIdcard(e.target.value);
  };
  const handleSpecializeChange = (e) => {
    setSpecialize(e);
  };
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadUsers();
    if (categoryList.length === 0) {
      fetchCategoryList();
    }
  }, [temp]);

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
                  label="Người dùng"
                  color="primary"
                />
              </div>
            );
          case "Staff":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label="Nhân viên"
                  color="secondary"
                />
              </div>
            );
          case "Editor":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label="Biên tập viên"
                  color="error"
                />
              </div>
            );
          case "Editor Manager":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label="Quản lý biên tập viên"
                  color="info"
                />
              </div>
            );
          case "Admin":
            return (
              <div>
                <Chip
                  key={item.role.roleId}
                  label="Quản trị viên"
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
    {
      title: "Chuyên môn",
      field: "accountInfo",
      width: "10%",
      render: (rowData) => {
        return (
          <div>
            {rowData.role.roleId === 3 &&
              (rowData.accountInfo.specializeNavigation === null
                ? "Không có"
                : rowData.accountInfo.specializeNavigation.type)}
          </div>
        );
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
          <Modal.Title>Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              {selectedUser && (
                <>
                  <Row className="mb-3">
                    <Col md="12">
                      <b style={{ color: "black", fontSize: "20px" }}>
                        Thông tin chung
                      </b>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Email:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        value={selectedUser.email}
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Mật khẩu:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => handlePasswordChange(e)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Số điện thoại:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="number"
                        className="form-control"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={
                          selectedUser.phoneNumber
                            ? selectedUser.phoneNumber
                            : ""
                        }
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Vai trò:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="text"
                        className="form-control"
                        name="role"
                        value={selectedUser.role.roleName}
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="12">
                      <b style={{ color: "black", fontSize: "20px" }}>
                        Thông tin chi tiết
                      </b>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Tên người dùng:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>Địa chỉ:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={address ? address : ""}
                        onChange={(e) => handleAddressChange(e)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b style={{ color: "black" }}>CCCD:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <input
                        type="text"
                        className="form-control"
                        name="CCCD"
                        value={idcard ? idcard : ""}
                        onChange={(e) => handleIdcardChange(e)}
                      />
                    </Col>
                  </Row>
                  {selectedUser.role.roleId === 3 && (
                    <Row className="mb-3">
                      <Col md="3">
                        <b style={{ color: "black" }}>Chuyên môn</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        <Select
                          className="mw-100"
                          name="categoryId"
                          // isDisabled={categoryList.length === 0}
                          options={categoryList}
                          placeholder="Chọn chuyên môn"
                          value={specialize}
                          onChange={(option) => handleSpecializeChange(option)}
                        />
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleUpdate()}>
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
          <Modal.Title>Tạo người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              <>
                <Row className="mb-3">
                  <Col md="12">
                    <b style={{ color: "black", fontSize: "20px" }}>
                      Thông tin chung
                    </b>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Email:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => handleEmailChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Mật khẩu:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => handlePasswordChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Số điện thoại:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Vai trò:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <Select
                      className="mw-100"
                      name="role"
                      type="text"
                      // isDisabled={categoryList.length === 0}
                      options={roleList}
                      value={role}
                      placeholder="Chọn vai trò"
                      onChange={(e) => handleRoleChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="12">
                    <b style={{ color: "black", fontSize: "20px" }}>
                      Thông tin chi tiết
                    </b>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Tên người dùng:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Tên người dùng"
                      value={username}
                      onChange={(e) => handleUsernameChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>Địa chỉ:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Địa chỉ"
                      value={address ? address : ""}
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md="3">
                    <b style={{ color: "black" }}>CCCD:</b>
                  </Col>
                  <Col md="9" className="ml-auto">
                    <input
                      type="text"
                      className="form-control"
                      name="CCCD"
                      placeholder="Số định danh"
                      value={idcard}
                      onChange={(e) => handleIdcardChange(e)}
                    />
                  </Col>
                </Row>
              </>
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => create_user()}>
            Tạo người dùng
          </Button>
        </Modal.Footer>
      </Modal>
      <MaterialTable
        columns={columns}
        data={users}
        title="Danh sách nhân viên"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo người dùng",
            isFreeAction: true,
            onClick: () => handleShowModel2(),
          },
          {
            icon: "edit",
            tooltip: "Sửa chi tiết người dùng",
            onClick: (event, rowData) => handleShowModel(rowData),
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

export default EmployeeTable;
