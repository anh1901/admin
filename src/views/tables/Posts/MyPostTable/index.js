/* eslint-disable react-hooks/exhaustive-deps */
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import postApi from "../../../../api/postApi";
import moment from "moment";
import { Markup } from "interweave";
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { Chip } from "@mui/material";
import MyTasksTable from "../../../tasks/MyTasksTable";
import { toast } from "react-toastify";
import taskApi from "../../../../api/TaskApi";

const MyPostTable = ({ taskId, setPostShowInTask, setShowInTask }) => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [selectedImg, setSelectedImg] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [selectedPostId, setSelectedPostId] = useState();
  const [temp, setTemp] = useState(0);
  const loadPost = async () => {
    try {
      const params = {
        EditorID: user_info !== null && user_info.accountId,
        Status: 1,
      };
      const response = await postApi.getByIdAndStatus(params);
      setPosts(
        taskId === undefined
          ? response
              .sort(
                (a, b) => new moment(a.createTime) - new moment(b.createTime)
              )
              .reverse()
          : response
              .sort(
                (a, b) => new moment(a.createTime) - new moment(b.createTime)
              )
              .reverse()
              .filter((e) => e.taskId === null)
      );
    } catch (err) {
      alert(err.message);
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
      title: "Trạng thái",
      field: "taskId",
      width: "1%",
      render: (rowData) => {
        return (
          <div className="bluebag">
            {rowData.taskId !== null ? (
              <Chip
                key={rowData.tableData.id}
                label={"Đã có công việc đính kèm"}
                color="success"
              />
            ) : (
              <Chip
                key={rowData.tableData.id}
                label={"Chưa có công việc đính kèm"}
                color="error"
              />
            )}
          </div>
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
  const handlePreviewModel = async (post_data) => {
    setSelectedPost(post_data);
    setPreview(true);
    loadPost();
  };
  const handleTasksView = (postId) => {
    console.log(postId);
    setShowTasks(true);
    setSelectedPostId(postId);
    loadPost();
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleClosePreview = () => {
    setPreview(false);
  };
  const handleCloseImg = () => {
    setShowImg(false);
  };
  const handleCloseTasks = () => {
    setShowTasks(false);
    setSelectedPostId();
  };
  const viewImg = (image) => {
    setSelectedImg(image);
    setShowImg(true);
  };
  const handleTaskDone = async (post) => {
    console.log("post");
    try {
      const params = {
        taskId: taskId,
        status: 3,
        postId: post.postId,
      };
      const response = await taskApi.updateStatus(params);
      if (!JSON.stringify(response).includes("error")) {
        toast.success(response.message);
        setPostShowInTask(false);
        setShowInTask(false);
        loadPost();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <div style={{ maxWidth: "100%" }}>
      <Modal
        scrollable={true}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
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
          {selectedPost && selectedPost.taskId === null && (
            <Button
              variant="warning"
              onClick={() => handleTasksView(selectedPost.postId)}
            >
              Hoàn thành công việc
            </Button>
          )}
        </Modal.Footer>
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
          {taskId === undefined &&
            selectedPost &&
            selectedPost.taskId === null && (
              <Button
                variant="warning"
                onClick={() => handleTasksView(selectedPost.postId)}
              >
                Hoàn thành công việc
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
      <Modal
        scrollable={true}
        show={showTasks}
        onHide={handleCloseTasks}
        centered
        size="xl"
      >
        <Modal.Header>Chọn công việc để hoàn thành</Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <MyTasksTable
            selectedPostId={selectedPostId}
            setShowInPost={setShow}
            setPreviewInPost={setPreview}
            setShowTasksInPost={setShowTasks}
          />
        </Modal.Body>
      </Modal>
      <MaterialTable
        columns={columns}
        data={posts}
        title="Bài viết của tôi"
        actions={
          taskId === undefined
            ? [
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
              ]
            : [
                {
                  icon: "newspaper",
                  tooltip: "Xem preview bài viết",
                  onClick: (event, rowData) => handlePreviewModel(rowData),
                },
                {
                  icon: "check",
                  tooltip: "Chọn bài viết",
                  onClick: (event, rowData) => handleTaskDone(rowData),
                },
              ]
        }
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
              rowData.tableData.id % 2 !== 0 ? "lightgray" : "white",
          }),
        }}
      />
    </div>
  );
};

export default MyPostTable;
