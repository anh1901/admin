/* eslint-disable react-hooks/exhaustive-deps */
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import postApi from "../../../../api/postApi";
import moment from "moment";
import { Markup } from "interweave";
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const UnpublishedPostTable = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [temp, setTemp] = useState(0);
  const [preview, setPreview] = useState(false);
  const loadPost = async () => {
    try {
      const params = {
        EditorID: user_info !== null && user_info.accountId,
        Status: 2,
      };
      const params2 = {
        Status: 2,
      };
      if (user_info !== null && user_info.role.roleId === 3) {
        const response = await postApi.getByIdAndStatus(params);
        setPosts(
          response
            .sort((a, b) => new moment(a.createTime) - new moment(b.createTime))
            .reverse()
        );
      } else if (user_info !== null && user_info.role.roleId === 4) {
        console.log("User");
        const response = await postApi.getByStatus(params2);
        setPosts(
          response
            .sort((a, b) => new moment(a.createTime) - new moment(b.createTime))
            .reverse()
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };
  const publicPost = async (id) => {
    setShow(false);
    setPreview(false);
    try {
      const params = {
        postId: id,
        status: 3,
      };
      const response = await postApi.editStatus(params);
      if (!JSON.stringify(response).includes("error")) {
        toast.success("Đăng bài thành công");
        loadPost();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadPost();
  }, [temp]);
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
        return (
          <div>
            {rowData.title.length > 30
              ? rowData.title.substring(0, 30) + "..."
              : rowData.title}
          </div>
        );
      },
    },
    {
      title: "Phụ đề",
      field: "subTitle",
      width: "1%",
      render: (rowData) => {
        return (
          <div>
            {rowData.subTitle.length > 50
              ? rowData.subTitle.substring(0, 50) + "..."
              : rowData.subTitle}
          </div>
        );
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
  const handleShowModel = async (post_data) => {
    setSelectedPost(post_data);
    setShow(true);
    loadPost();
  };
  const handleClose = () => {
    setShow(false);
  };
  const handlePreviewModel = async (post_data) => {
    setSelectedPost(post_data);
    setPreview(true);
    loadPost();
  };
  const handleClosePreview = () => {
    setPreview(false);
  };
  const handleCloseImg = () => {
    setShowImg(false);
  };
  const viewImg = (image) => {
    setSelectedImg(image);
    setShowImg(true);
  };
  return (
    <div style={{ maxWidth: "100%" }}>
      <Modal
        scrollable={true}
        show={show}
        onHide={handleClose}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              {selectedPost && (
                <>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Tác giả:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {selectedPost.editor.accountInfo.username}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Tiêu đề:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {selectedPost.title}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Phụ đề:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {selectedPost.subTitle}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Thời điểm tạo:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {moment(selectedPost.createTime).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Nội dung:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <Markup
                        content={selectedPost.description}
                        allowAttributes
                        allowElements
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Ảnh cover:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      <img
                        src={selectedPost.image}
                        width="200"
                        length="200"
                        alt="img"
                        onClick={() => viewImg(selectedPost.image)}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          {user_info.role.roleId === 4 && (
            <Button
              variant="warning"
              onClick={() => publicPost(selectedPost.postId)}
            >
              Đăng bài
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        scrollable={true}
        show={showImg}
        onHide={handleCloseImg}
        centered
        size="xl"
      >
        <Modal.Body style={{ color: "black" }}>
          <img
            src={selectedImg}
            alt="large-img"
            width="1100px"
            height="870px"
          />
        </Modal.Body>
      </Modal>
      {/* Preview */}
      <Modal
        scrollable={true}
        show={preview}
        onHide={handleClosePreview}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              {selectedPost && (
                <div className="form-card">
                  <p
                    className="mb-1"
                    style={{
                      color: "blue",
                      fontSize: "20px",
                      marginLeft: "10rem",
                      marginRight: "10rem",
                    }}
                  >
                    {selectedPost.category.subCategory}
                  </p>
                  <p
                    className="mb-1"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "30px",
                      marginLeft: "10rem",
                      marginRight: "10rem",
                    }}
                  >
                    {selectedPost.title}
                  </p>
                  <p
                    className="mb-4"
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginLeft: "10rem",
                      marginRight: "10rem",
                    }}
                  >
                    <strong>{selectedPost.subTitle}</strong>
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-7">
                      <Image
                        src={selectedPost.image}
                        className="img-fluid"
                        alt="fit-image"
                      />
                    </div>
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginLeft: "10rem",
                      marginRight: "10rem",
                    }}
                  >
                    <Markup
                      content={selectedPost.description}
                      allowAttributes
                      allowElements
                    />
                  </p>
                </div>
              )}
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePreview}>
            Đóng
          </Button>
          {user_info.role.roleId === 4 && (
            <Button
              variant="warning"
              onClick={() => publicPost(selectedPost.postId)}
            >
              Đăng bài
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <MaterialTable
        columns={columns}
        data={posts}
        title="Bài viết chưa đăng"
        actions={[
          {
            icon: "visibility",
            tooltip: "Xem chi tiết",
            onClick: (event, rowData) => handleShowModel(rowData),
          },
          {
            icon: "newspaper",
            tooltip: "Xem preview bài viết",
            onClick: (event, rowData) => handlePreviewModel(rowData),
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

export default UnpublishedPostTable;

// cellStyle: {
//             backgroundColor: '#039be5',
//             color: '#FFF'
//           },
