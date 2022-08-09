/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import taskApi from "../../../api/TaskApi";
import { Markup } from "interweave";
import reportApi from "../../../api/reportApi";
import "./MyTasksTableStyle.css";
import MyPostTable from "../../tables/Posts/MyPostTable";

const MyTasksTable = ({
  selectedPostId,
  setShowInPost,
  setPreviewInPost,
  setShowTasksInPost,
}) => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [temp, setTemp] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [show, setShow] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [postShow, setPostShow] = useState(false);
  const [selectedImg, setSelectedImg] = useState();
  const [selectedTaskId, setSelectedTaskId] = useState();

  const loadAllTasks = async () => {
    try {
      const params = {
        EditorID: user_info.accountId,
        status: "",
      };
      const response = await taskApi.getAllByIdAndStatus(params);
      setTasks(
        selectedPostId === undefined
          ? response.sort(
              (a, b) => new moment(a.deadLineTime) - new moment(b.deadLineTime)
            )
          : response
              .sort(
                (a, b) =>
                  new moment(a.deadLineTime) - new moment(b.deadLineTime)
              )
              .filter((e) => e.status === "New" || e.status === "Pending")
      );
    } catch (e) {
      toast.error(e.message);
    }
  };
  const viewReports = async (reportTasks) => {
    setShow(true);
    try {
      reportTasks.map(async (report) => {
        const param = { id: report.reportId };
        const response = await reportApi.find(param);
        console.log(response);
        setReports([...reports, response]);
      });
      //   loadReports();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleClose = () => {
    setShow(false);
    setReports([]);
  };
  const handleCloseImg = () => {
    setShowImg(false);
  };
  const handleClosePost = () => {
    setPostShow(false);
  };
  const viewImg = (image) => {
    setSelectedImg(image);
    setShowImg(true);
  };
  const handleClick = (postId, taskId) => {
    if (postId !== undefined) {
      handleTaskDone(postId, taskId);
    } else {
      setPostShow(true);
      setSelectedTaskId(taskId);
    }
  };
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadAllTasks();
  }, [temp]);

  const handleTaskDone = async (postId, taskId) => {
    console.log("task");
    try {
      const params = {
        taskId: postId,
        status: 3,
        postId: taskId,
      };
      const response = await taskApi.updateStatus(params);
      if (!JSON.stringify(response).includes("error")) {
        toast.success(response.message);
        setShowInPost(false);
        setPreviewInPost(false);
        setShowTasksInPost(false);
        loadAllTasks();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <>
      <Modal
        scrollable={true}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mm-example-row">
            <Container fluid>
              {reports &&
                reports.map((report) => (
                  <>
                    <h5 className="mb-2">
                      <strong>Báo cáo: </strong>
                      <span className="text-primary">{report.reportId}</span>
                    </h5>
                    <Row className="mb-3">
                      <Col md="3">
                        <b>Địa điểm:</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        {report.location}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="3">
                        <b>Thời điểm xảy ra:</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        {moment(report.timeFraud).format("DD-MM-YYYY HH:mm:ss")}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="3">
                        <b>Thời điểm gửi:</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        {moment(report.createTime).format(
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
                          content={report.description}
                          allowAttributes
                          allowElements
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="3">
                        <b>Ảnh đính kèm:</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        {console.log(report)}
                        {report.reportDetails.length > 0 &&
                        report.reportDetails.filter(
                          (img) => img.type === "Image"
                        ).length > 0
                          ? report.reportDetails
                              .filter((img) => img.type === "Image")
                              .map((img) => (
                                <>
                                  <Col md="2">
                                    {img.media.includes("http") ? (
                                      <img
                                        src={img.media}
                                        width="200"
                                        length="200"
                                        alt="img"
                                        onClick={() => viewImg(img.media)}
                                      />
                                    ) : (
                                      <>
                                        <img
                                          width="100"
                                          length="100"
                                          alt="no-img"
                                          scr="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe5v0Vl8y0zHRIAEimsrKMLEL6WSBG0pdE-XWDG3Wen9_dfhULrAiI7PjKKHETlq88lLc&usqp=CAU"
                                        />
                                      </>
                                    )}
                                  </Col>
                                </>
                              ))
                          : "Không có"}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="3">
                        <b>Video đính kèm:</b>
                      </Col>
                      <Col md="9" className="ml-auto">
                        {report.reportDetails.length > 0 &&
                        report.reportDetails.filter(
                          (video) => video.type === "Video"
                        ).length > 0
                          ? report.reportDetails
                              .filter((video) => video.type === "Video")
                              .map((video) =>
                                video.media.includes("http") ? (
                                  <label for="videos">
                                    <video
                                      width="400"
                                      height="150"
                                      controls
                                      style={{
                                        height: "200px",
                                        objectFit: "contain",
                                      }}
                                      autoPlay
                                      loop
                                    >
                                      <source src={video.media} />
                                    </video>
                                  </label>
                                ) : (
                                  <span className="text-muted">
                                    Không có video
                                  </span>
                                )
                              )
                          : "Không có"}
                      </Col>
                    </Row>
                  </>
                ))}
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        scrollable={true}
        show={showImg}
        onHide={handleCloseImg}
        centered
        size="xl"
      >
        <Modal.Body>
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
        show={postShow}
        onHide={handleClosePost}
        centered
        fullscreen={true}
      >
        <Modal.Header>Chọn bài viết</Modal.Header>
        <Modal.Body>
          <MyPostTable
            taskId={selectedTaskId}
            setPostShowInTask={setPostShow}
            setShowInTask={setShow}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePost}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Table className="">
        <thead>
          <tr>
            <th scope="col">Miêu tả công việc</th>
            <th className="text-center" scope="col">
              Hạn chót
            </th>
            <th className="text-center" scope="col">
              Trạng thái
            </th>
            <th className="text-center" scope="col">
              Công cụ
            </th>
          </tr>
        </thead>
        {tasks.length > 0 &&
          tasks.map((task) => (
            <tbody>
              <tr>
                <td>
                  <h6 className="mb-0">{task.description}</h6>
                  <p className="mb-0">
                    Công việc tạo trên{" "}
                    <a href="#" onClick={() => viewReports(task.reportTasks)}>
                      báo cáo.
                    </a>
                  </p>
                </td>
                <td className="text-center" style={{ color: "red" }}>
                  {moment(task.deadLineTime).format("DD/MM/YYYY HH:mm:ss")}
                </td>
                <td className="text-center">
                  {task.status === "New" && (
                    <span className="text-info float-right mr-5 font-weight-bold">
                      Mới
                    </span>
                  )}
                  {task.status === "Review" && (
                    <span className="text-warning">Đang xem xét</span>
                  )}
                  {task.status === "Finish" && (
                    <span className="text-success">Đã hoàn thành</span>
                  )}
                  {task.status === "UnFinished" && (
                    <span className="text-danger">Không hoàn thành</span>
                  )}
                  {task.status === "Pending" && (
                    <span className="text-primary">Chưa hoàn thành</span>
                  )}
                </td>
                <td className="text-center">
                  {task.status === "New" || task.status === "Pending" ? (
                    <div
                      onClick={() => handleClick(selectedPostId, task.taskId)}
                    >
                      <i
                        className="done-task fa fa-solid fa-check"
                        style={{ color: "green" }}
                      />{" "}
                      <span className="hover" style={{ color: "green" }}>
                        Hoàn thành ngay
                      </span>
                    </div>
                  ) : (
                    <div>
                      <i
                        className="done-task fa fa-solid fa-check"
                        style={{ color: "blue" }}
                      />{" "}
                      <span style={{ color: "blue" }}>Đã hoàn thành</span>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
      </Table>
    </>
  );
};

export default MyTasksTable;
