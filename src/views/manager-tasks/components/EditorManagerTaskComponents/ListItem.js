import { Draggable } from "react-beautiful-dnd";
import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/vi";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Markup } from "interweave";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import categoryApi from "../../../../api/categoryApi";
import postApi from "../../../../api/postApi";
import reportApi from "../../../../api/reportApi";
import taskApi from "../../../../api/TaskApi";
const CardHeader = styled.div`
  font-weight: 1000;
  font-size: 16px;
  font-family: "Times New Roman", Times, serif;
`;
const CardBody = styled.div`
  align-items: left;
`;

const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DragItem = styled.div`
  padding: 10px;
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
  const [details, setDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleReportModal, setVisibleReportModal] = useState(false);
  const [visiblePreviewModal, setVisiblePreviewModal] = useState(false);
  const [editedDescription, setEditedDescription] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  //
  const viewDetails = async (id) => {
    setVisibleModal(!visibleModal);
    try {
      const params = { id: id };
      const response = await taskApi.getById(params);
      setDetails(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  async function loadCategory() {
    try {
      const params = {};
      const response = await categoryApi.getAllSub(params);
      setCategoryList(response);
    } catch (e) {
      toast.error(e.message);
    }
  }
  const toggleReportDetails = async (id) => {
    setVisibleReportModal(!visibleReportModal);
    try {
      const param = { id: id };
      const response = await reportApi.find(param);
      const metaDescription = JSON.stringify(response.description)
        .replace(
          "<img",
          '<img style="width:55rem;height:30rem;padding-left:2rem;padding-right:2rem"'
        )
        .replace(
          "<iframe",
          '<iframe style="width:55rem;height:30rem;padding-left:2rem;padding-right:2rem"'
        )
        .replace(/\\/g, "");
      const description = metaDescription.substring(
        1,
        metaDescription.length - 1
      );
      setEditedDescription(description);
      setReportDetails(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const publicPost = async (id, taskId) => {
    setVisibleModal(!visibleModal);
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
  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <>
      <Modal
        isOpen={visibleModal}
        toggle={() => (setVisibleModal(false), setDetails(null))}
        className=""
        size="lg"
        style={{ maxWidth: "700px", width: "80%" }}
      >
        <ModalHeader
          className="bg-primary"
          toggle={() => (setVisibleModal(false), setDetails(null))}
        >
          Chi tiết công việc
        </ModalHeader>
        {details !== null ? (
          <>
            <ModalBody>
              <Row>
                <Col>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>Miêu tả: </b>
                      </Label>
                    </Col>
                    <Col md="10">
                      <div className="row pl-1">{details.description}</div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>Người được phân công: </b>
                      </Label>
                    </Col>
                    <Col md="10">
                      <div className="row pl-1">{details.editorId}</div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>Tạo lúc: </b>
                      </Label>
                    </Col>
                    <Col md="4">
                      <div className="row pl-1">
                        {moment(details.createTime).format(
                          "DD-MM-YYYY HH:mm:ss"
                        )}
                      </div>
                    </Col>
                    <Col md="2">
                      <Label for="file">
                        <b>Hạn chót: </b>
                      </Label>
                    </Col>
                    <Col md="4">
                      <div className="row pl-1">
                        {moment(details.deadLineTime).format(
                          "DD-MM-YYYY HH:mm:ss"
                        )}
                      </div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label for="file">
                        <b>Báo cáo đính kèm: </b>
                      </Label>
                    </Col>
                    <Col md="8">
                      <div className="row pl-1">
                        {details.reportTasks.length !== 0
                          ? details.reportTasks.map((report) => (
                              <div className="pb-2">
                                <Button
                                  color="link"
                                  onClick={() =>
                                    toggleReportDetails(report.reportId)
                                  }
                                >
                                  Xem chi tiết báo cáo ID:{" "}
                                  <b>{report.reportId}</b>
                                </Button>
                              </div>
                            ))
                          : "Không có báo cáo đính kèm"}
                        {reportDetails !== null && (
                          <Modal
                            size="lg"
                            style={{ maxWidth: "900px", width: "80%" }}
                            isOpen={visibleReportModal}
                            toggle={() => (
                              setVisibleReportModal(false),
                              setReportDetails(null)
                            )}
                            onClosed={() => (
                              setVisibleReportModal(false),
                              setReportDetails(null)
                            )}
                          >
                            <ModalHeader
                              className="bg-primary"
                              toggle={() => (
                                setVisibleReportModal(false),
                                setReportDetails(null)
                              )}
                            >
                              Chi tiết báo cáo
                            </ModalHeader>
                            <ModalBody>
                              <FormGroup row>
                                <Col md="2">
                                  <Label for="location">
                                    <b>Địa điểm:</b>{" "}
                                  </Label>
                                </Col>
                                <Col md="4">{reportDetails.location}</Col>
                                <Col md="2">
                                  <Label for="userId">
                                    <b>Người gửi: </b>{" "}
                                  </Label>
                                </Col>
                                <Col md="4">
                                  {reportDetails.userId === null
                                    ? "Không có"
                                    : reportDetails.userId}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="2">
                                  <Label for="timeFraud">
                                    <b> Thời gian vụ việc: </b>
                                  </Label>
                                </Col>
                                <Col md="4">{reportDetails.timeFraud}</Col>
                                <Col md="2">
                                  <Label for="createTime">
                                    <b>Thời gian viết: </b>
                                  </Label>
                                </Col>
                                <Col md="4">{reportDetails.createTime}</Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="2">
                                  <Label for="category">
                                    {" "}
                                    <b>Phân loại: </b>
                                  </Label>
                                </Col>
                                <Col md="4">
                                  {reportDetails.categoryId === 1
                                    ? "Khác"
                                    : categoryList.find(
                                        (c) =>
                                          c.categoryId ===
                                          reportDetails.categoryId
                                      ) &&
                                      categoryList.find(
                                        (c) =>
                                          c.categoryId ===
                                          reportDetails.categoryId
                                      ).subCategory}
                                </Col>
                                <Col md="2">
                                  <Label for="staffId">
                                    <b>Người xác nhận: </b>
                                  </Label>
                                </Col>
                                <Col md="4">
                                  {reportDetails.staffId === null
                                    ? "Không có"
                                    : reportDetails.staffId}
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="3">
                                  <Label for="description">
                                    <b>Chi tiết: </b>
                                  </Label>
                                </Col>
                                <Col md="12">
                                  <Markup
                                    content={editedDescription}
                                    allowAttributes
                                    allowElements
                                  />
                                </Col>
                              </FormGroup>
                              {/* File đính kèm */}
                              <FormGroup row>
                                <Col md="12">
                                  <Label for="description">
                                    <b>Ảnh đính kèm: </b>
                                  </Label>
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="12">
                                  <Label for="description">
                                    <b>Video đính kèm: </b>
                                  </Label>
                                </Col>
                                {reportDetails.reportDetails.length > 0 &&
                                  (reportDetails.reportDetails.filter(
                                    (video) => video.type === "Video"
                                  ).length > 0
                                    ? reportDetails.reportDetails
                                        .filter(
                                          (video) => video.type === "Video"
                                        )
                                        .map((video) => (
                                          <Col md="12">
                                            {video.media.includes("http") ? (
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
                                            )}
                                          </Col>
                                        ))
                                    : "Không có video đính kèm")}
                              </FormGroup>
                            </ModalBody>
                          </Modal>
                        )}
                      </div>
                    </Col>
                  </FormGroup>
                  {(details.status === "Review" ||
                    details.status === "Finish" ||
                    details.status === "UnFinished") && (
                    <FormGroup row>
                      <Col md="4">
                        <Label for="file">
                          <b>Bài viết đính kèm: </b>
                        </Label>
                      </Col>
                      <Col md="8">
                        <div className="row pl-1">
                          {details.posts.length !== 0
                            ? details.posts.map((post) => (
                                <div className="pb-2">
                                  <Button
                                    color="link"
                                    onClick={() => setVisiblePreviewModal(true)}
                                  >
                                    Xem bài viết{" "}
                                  </Button>
                                  {item.posts.length !== 0 &&
                                    (item.posts[0].status === "Public" ? (
                                      <span>
                                        <Badge bg="success">
                                          Bài viết đã đăng{" "}
                                          <i className="fa fa-check" />
                                        </Badge>
                                      </span>
                                    ) : item.posts[0].status === "Hidden" ? (
                                      <span>
                                        <Badge bg="info">
                                          Bài viết đã duyệt{" "}
                                          <i className="fa fa-exclamation" />
                                        </Badge>
                                      </span>
                                    ) : (
                                      <span>
                                        <Badge bg="warning">
                                          Bài viết chưa duyệt{" "}
                                          <i className="fa fa-exclamation" />
                                        </Badge>
                                      </span>
                                    ))}
                                </div>
                              ))
                            : "Không có bài viết đính kèm"}
                          {/* Load post preview */}
                          {details.posts.length !== 0 && (
                            <Modal
                              size="lg"
                              style={{
                                minWidth: "100vw",
                                width: "100%",
                                marginTop: 0,
                              }}
                              fullScreen
                              isOpen={visiblePreviewModal}
                              toggle={() => setVisiblePreviewModal(false)}
                              onClosed={() => setVisiblePreviewModal(false)}
                            >
                              <ModalHeader
                                className="bg-primary"
                                toggle={() => setVisiblePreviewModal(false)}
                              >
                                Bản xem thử
                              </ModalHeader>
                              <ModalBody style={{ backgroundColor: "#F7F7F7" }}>
                                {/* Nội dung xem trước */}
                                <Fragment>
                                  <span className="space-30" />
                                  <div className="container">
                                    <div className="row">
                                      <div className="col-12 col-md-10 col-lg-8 m-auto">
                                        <div className="row">
                                          <div className="col-6 align-self-center">
                                            <div className="page_category">
                                              <h4>
                                                {details.posts[0].category
                                                  ? details.posts[0].category
                                                  : "Khác"}
                                              </h4>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-30" />
                                        <div className="single_post_heading">
                                          <h1>{details.posts[0].title}</h1>
                                          <div className="space-10" />
                                          <p>{details.posts[0].subTitle}</p>
                                        </div>
                                        <div className="space-40" />
                                        {details.posts[0].image.includes(
                                          "http"
                                        ) && (
                                          <img
                                            src={details.posts[0].image}
                                            alt="thumb"
                                            style={{
                                              marginLeft: "auto",
                                              marginRight: "auto",
                                              width: "100%",
                                              display: "inline-block",
                                            }}
                                            class="img-responsive"
                                          />
                                        )}
                                        <div className="space-20" />
                                        <div className="row">
                                          <div className="col-lg-6 align-self-center">
                                            <div className="author">
                                              <div className="author_img">
                                                <div className="author_img_wrap">
                                                  <img
                                                    src="https://picsum.photos/50/50"
                                                    alt="author"
                                                  />
                                                </div>
                                              </div>
                                              <Link to="#">
                                                {
                                                  JSON.parse(
                                                    localStorage.getItem(
                                                      "user_info"
                                                    )
                                                  ).accountInfo.username
                                                }
                                              </Link>
                                              <ul>
                                                <li>
                                                  <Link to="#">
                                                    {moment(
                                                      details.posts[0]
                                                        .publicTime
                                                    ).format("DD ,D MM YYYY")}
                                                  </Link>
                                                </li>
                                                <li>
                                                  {details.posts[0]
                                                    .updateTime &&
                                                    "cập nhật lần cuối " +
                                                      moment(
                                                        details.posts[0]
                                                          .updateTime
                                                      )
                                                        .format(
                                                          "dddd, Do MM YYYY"
                                                        )
                                                        .toLocaleUpperCase()}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-20" />
                                        <div style={{ whiteSpace: "pre-wrap" }}>
                                          <Markup
                                            content={
                                              details.posts[0].description
                                            }
                                          />
                                        </div>
                                        <div className="space-40" />
                                        <div className="border_black" />

                                        <div className="space-60" />
                                      </div>
                                    </div>
                                  </div>
                                </Fragment>
                              </ModalBody>
                              {details.posts[0].status !== "Public" && (
                                <ModalFooter>
                                  <Button
                                    className="btn btn-info"
                                    onClick={() => (
                                      publicPost(
                                        details.posts[0].postId,
                                        item.taskId
                                      ),
                                      setDetails(null)
                                    )}
                                  >
                                    Đăng bài viết
                                  </Button>
                                </ModalFooter>
                              )}
                            </Modal>
                          )}
                        </div>
                      </Col>
                    </FormGroup>
                  )}
                </Col>
              </Row>
            </ModalBody>
          </>
        ) : (
          <Row className="d-flex justify-content-center">
            <div class="spinner-border text-primary mb-5 mt-5" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </Row>
        )}
      </Modal>
      <Draggable draggableId={item.taskId} index={index}>
        {(provided, snapshot) => {
          return (
            <DragItem
              ref={provided.innerRef}
              snapshot={snapshot}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() => viewDetails(item.taskId)}
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
                <div>
                  <i class="font-weight-bold">Hạn chót: </i>{" "}
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
                    <span>
                      <Badge bg="info">
                        Bài viết đã duyệt <i className="fa fa-exclamation" />
                      </Badge>
                    </span>
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
