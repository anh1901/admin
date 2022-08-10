/* eslint-disable no-sequences */
import { Draggable } from "react-beautiful-dnd";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/vi";
import { Markup } from "interweave";
import {
  Badge,
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import postApi from "../../../../api/postApi";
import taskApi from "../../../../api/TaskApi";
import { Label } from "reactstrap";
import userApi from "../../../../api/UserApi";
import reportApi from "../../../../api/reportApi";
const CardHeader = styled.div`
  font-weight: 1000;
  font-size: 14px;
  font-family: "Times New Roman", Times, serif;
`;
const CardBody = styled.div`
  align-items: left;
  font-size: 12px;
  font-family: "Times New Roman", Times, serif;
`;
const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DragItem = styled.div`
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: white;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 5px;
  flex-direction: column;
  margin-top: 10px;
`;
const ListItem = ({ item, index, loadTask }) => {
  //
  const [show, setShow] = useState(false);
  const [editor, setEditor] = useState();
  const [reports, setReports] = useState([]);
  const [taskDetail, setTaskDetail] = useState();
  const getEditor = async (editorId) => {
    try {
      const param = { id: editorId };
      const response = await userApi.getById(param);
      setEditor(response);
    } catch (e) {
      toast.error(e);
    }
  };
  const finishTask = async (id, taskId) => {
    try {
      const params = {
        taskId: taskId,
        status: 4,
        postId: id,
      };
      const response = await taskApi.updateStatus(params);
      if (!JSON.stringify(response).includes("error")) {
        toast.success("Hoàn thành công việc");
        setShow(false);
        setTaskDetail();
        setReports([]);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const publicPost = async (id, taskId) => {
    try {
      const params = {
        postId: id,
        status: 3,
      };
      const params2 = {
        taskId: taskId,
        status: 4,
        postId: id,
      };
      await taskApi.updateStatus(params2);
      await postApi.editStatus(params);
      loadTask();
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
        setReports([...reports, response]);
        console.log(response);
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleOpenTask = async (taskId) => {
    setShow(true);
    try {
      const params = { id: taskId };
      const response = await taskApi.getById(params);
      getEditor(response.editorId);
      viewReports(response.reportTasks);
      setTaskDetail(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleCloseTask = () => {
    //
    setShow(false);
    setTaskDetail();
    setReports([]);
  };
  return (
    <>
      {taskDetail && editor && reports && (
        <Modal
          scrollable={true}
          show={show}
          onHide={handleCloseTask}
          centered
          size="xl"
          fullscreen={
            (taskDetail.status === "Review" ||
              taskDetail.status === "Finish" ||
              taskDetail.status === "UnFinished") &&
            true
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết công việc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col
                md={
                  taskDetail.status === "Review" ||
                  taskDetail.status === "Finish" ||
                  taskDetail.status === "UnFinished"
                    ? 6
                    : 12
                }
              >
                <Row>
                  <Col md="3">
                    <Label for="file">
                      <b>Miêu tả công việc:</b>
                    </Label>
                  </Col>
                  <Col md="9">{taskDetail.description}</Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label for="file">
                      <b>Người đảm nhận:</b>{" "}
                    </Label>
                  </Col>
                  <Col md="9">{editor.accountInfo.username}</Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label for="file">
                      <b>Deadline:</b>{" "}
                    </Label>
                  </Col>
                  <Col md="9">
                    {moment(taskDetail.deadLineTime).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Label for="file">
                      <b>Công việc cũ:</b>{" "}
                    </Label>
                  </Col>
                  <Col md="9">
                    {taskDetail.subTaskId === null
                      ? "Không có"
                      : taskDetail.subTaskId}
                  </Col>
                </Row>
                <Row
                  style={{
                    backgroundColor: "lightgray",
                    marginLeft: 5,
                    marginRight: 5,
                    borderRadius: 10,
                    paddingTop: "1rem",
                  }}
                >
                  <Col md="3">
                    <Label for="file">
                      <b style={{ color: "black" }}>Báo cáo đính kèm:</b>
                    </Label>
                  </Col>
                  <Col md="12">
                    {reports &&
                      reports.map((report) => (
                        <>
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
                              {moment(report.timeFraud).format(
                                "DD-MM-YYYY HH:mm:ss"
                              )}
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
                  </Col>
                </Row>
              </Col>
              {(taskDetail.status === "Review" ||
                taskDetail.status === "Finish" ||
                taskDetail.status === "UnFinished") && (
                <Col md={6}>
                  <Container
                    fluid
                    style={{
                      border: "1px solid lightgray",
                      borderRadius: "5px",
                    }}
                  >
                    {taskDetail && (
                      <div className="form-card">
                        <p
                          className="mb-1"
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "30px",
                            marginLeft: "5rem",
                            marginRight: "5rem",
                          }}
                        >
                          {taskDetail.posts[0].title}
                        </p>
                        <p
                          className="mb-4"
                          style={{
                            color: "black",
                            fontSize: "16px",
                            marginLeft: "5rem",
                            marginRight: "5rem",
                          }}
                        >
                          <strong>{taskDetail.posts[0].subTitle}</strong>
                        </p>
                        <div className="row justify-content-center">
                          <div className="col-7">
                            <Image
                              src={taskDetail.posts[0].image}
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
                            marginLeft: "5rem",
                            marginRight: "5rem",
                          }}
                        >
                          <Markup
                            content={taskDetail.posts[0].description}
                            allowAttributes
                            allowElements
                          />
                        </p>
                      </div>
                    )}
                  </Container>
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTask}>
              Đóng
            </Button>
            {(taskDetail.status === "Review" ||
              taskDetail.status === "Finish") && (
              <>
                {taskDetail.posts[0].status !== "Public" && (
                  <Button
                    variant="warning"
                    onClick={() =>
                      publicPost(item.posts[0].postId, item.taskId)
                    }
                  >
                    Đăng ngay
                  </Button>
                )}
                {!taskDetail.status === "Finish" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      finishTask(item.posts[0].postId, item.taskId)
                    }
                  >
                    Hoàn thành công việc
                  </Button>
                )}
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}
      <Draggable draggableId={item.taskId} index={index}>
        {(provided, snapshot) => {
          return (
            <DragItem
              ref={provided.innerRef}
              snapshot={snapshot}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() => handleOpenTask(item.taskId)}
            >
              <CardHeader
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "20rem",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </CardHeader>
              <CardBody style={{ padding: "0.5rem" }}>
                <div className="mb-2">
                  <b>Hạn chót: </b>{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {moment(item.deadLineTime).format(
                      "dddd, Do MMMM YYYY, h:mm:ss"
                    )}
                  </span>
                </div>
                <div>
                  {moment
                    .duration(moment(item.deadLineTime).diff(moment()))
                    .asDays() > 1 ? (
                    <Badge bg="success ">
                      Còn:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asDays()
                        )
                      )}{" "}
                      ngày
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asHours() > 1 ? (
                    <Badge bg="success">
                      Còn:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asHours()
                        )
                      )}{" "}
                      giờ
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asMinutes() > 1 ? (
                    <Badge bg="success">
                      Còn:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asMinutes()
                        )
                      )}{" "}
                      phút
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asSeconds() > 1 ? (
                    <Badge bg="success">
                      Còn:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asSeconds()
                        )
                      )}{" "}
                      giây
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asDays() < -1 ? (
                    <Badge bg="danger">
                      Trễ:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asDays()
                        )
                      )}{" "}
                      ngày
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asHours() < -1 ? (
                    <Badge bg="danger">
                      Trễ:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asHours()
                        )
                      )}{" "}
                      giờ
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asMinutes() < -1 ? (
                    <Badge bg="danger">
                      Trễ:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asMinutes()
                        )
                      )}{" "}
                      phút
                    </Badge>
                  ) : moment
                      .duration(moment(item.deadLineTime).diff(moment()))
                      .asSeconds() < -1 ? (
                    <Badge bg="danger">
                      Trễ:{" "}
                      {Math.abs(
                        Math.floor(
                          moment
                            .duration(moment(item.deadLineTime).diff(moment()))
                            .asSeconds()
                        )
                      )}{" "}
                      giây
                    </Badge>
                  ) : null}
                </div>
              </CardBody>
              <CardFooter>
                {item.posts.length !== 0 &&
                  (item.posts[0].status === "Public" ? (
                    <span>
                      <Badge bg="success">
                        Bài viết đã đăng <i className="fa fa-check" />
                      </Badge>
                    </span>
                  ) : item.posts[0].status === "Hidden" ? (
                    <>
                      <span>
                        <Badge bg="info">
                          Bài viết đã duyệt <i className="fa fa-exclamation" />
                        </Badge>
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        className="float-end"
                        onClick={() =>
                          publicPost(item.posts[0].postId, item.taskId)
                        }
                      >
                        Đăng ngay
                      </Button>
                    </>
                  ) : (
                    <span>
                      <Badge bg="warning">
                        Bài viết chưa duyệt <i className="fa fa-exclamation" />
                      </Badge>
                    </span>
                  ))}
              </CardFooter>
            </DragItem>
          );
        }}
      </Draggable>
    </>
  );
};

export default ListItem;
