import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Badge,
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
import { toast } from "react-toastify";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import * as moment from "moment";
import { Markup } from "interweave";
import Select from "react-select";
import { useRanger } from "react-ranger";
import categoryApi from "../../../../api/categoryApi";
import taskApi from "../../../../api/TaskApi";
import userApi from "../../../../api/UserApi";
import reportApi from "../../../../api/reportApi";
const MIN_LENGTH_DESCRIPTION = 10;
const MAX_LENGTH_DESCRIPTION = 300;
export const Track = styled("div")`
  display: inline-block;
  height: 8px;
  width: 100%;
  margin: 5% 1% 10% 1%;
  padding-top: 0.25rem;
`;

export const Tick = styled.div`
  :before {
    content: "";
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 5px;
    width: 2px;
    transform: translate(-50%, 0.7rem);
  }
`;
export const Checkbutton = styled.button`
  float: right;
  z-index: 9999;
  display: inline;
  margin-top: 0.5rem;
  padding: auto;
  hover: {
    cursor: pointer;
  }
  color: white;
  background-color: #4caf50 !important;
  border-radius: 5px;
  padding: 2px;
  icon {
    color: white;
    background-color: #4caf50;
    border-radius: 5px;
    padding: 2px;
  }
  :hover icon {
    cursor: pointer;
    transition: 0.9s;
    transform: rotateZ(360deg);
  }
  :hover span {
    display: none;
  }
  :hover {
    border-radius: 5px;
  }
  :hover:before {
    font-weight: bold;
  }
  font-size: 10px;
  border: none;
  background-color: transparent;
`;

export const TickLabel = styled.div`
  position: absolute;
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.5);
  top: 100%;
  transform: translate(-50%, 1.2rem);
  white-space: nowrap;
`;

export const Segment = styled.div`
  background: ${(props) =>
    props.index === 0
      ? "#3e8aff"
      : props.index === 1
      ? "#00d5c0"
      : props.index === 2
      ? "#f5c200"
      : "#ff6050"};
  height: 100%;
`;

export const Handle = styled.div`
  background: #ff1a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  font-size: 0.7rem;
  white-space: nowrap;
  color: white;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transform: ${(props) =>
    props.active ? "translateY(-10%) scale(1.1)" : "translateY(0) scale(0.9)"};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;
const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-top: 10px;
  margin-bottom: 0.5rem;
  font-size: 18px;
  font-weight: bold;
`;
const StatusColumn = styled.div`
  max-height: 80vh;
  height: 80vh;
  padding: 5px;
  border-radius: 5px;
  background: #ebe8e8;
  box-shadow: 0px 0px 3px #ebe8e8;
`;
const DroppableStyles = styled.div`
  max-height: 75vh;
  overflow: auto;
  border-radius: 5px;
  background: #ebe8e8;
  box-shadow: 0px 0px 3px #ebe8e8;
`;
const CreateTaskButton = styled.div`
  width: 100%;
  background-color: #ffffff;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-weight: 800;
  box-shadow: 0px 0px 8px #ffffff;
  :hover {
    cursor: pointer;
  }
`;
const EmptyList = styled.div`
  width: 100%;
  background-color: transparent;
  min-height: 10rem;
`;
export const statusName = (status) => {
  switch (status) {
    case "New":
      return "Mới";
    case "Pending":
      return "Đang làm";
    case "Review":
      return "Đang xem xét";
    case "Finish":
      return "Đã hoàn thành";
    case "UnFinished":
      return "Chưa xong";
  }
};
export const columns = [
  {
    key: "index",
    label: "STT",
    filter: false,
    sorter: false,
    _style: { width: "2%" },
    _props: { className: "fw-semibold" },
  },
  {
    key: "location",
    label: "Vị trí",
    _style: { width: "20%" },
    _props: { className: "fw-semibold" },
  },
  {
    key: "description",
    label: "Nội dung",
    _style: { width: "20%" },
    _props: { className: "fw-semibold" },
  },
  {
    key: "show_details",
    label: "Chi tiết",
    _style: { width: "10%" },
    filter: false,
    sorter: false,
    _props: { className: "fw-semibold" },
  },
];

const shortcuts = {
  Today: moment(),
  Yesterday: moment().subtract(1, "days"),
  Clear: "",
};
const DraggableTask = ({ prefix, tasks, id, loadTask }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModal2, setVisibleModal2] = useState(false);
  const [visibleModal3, setVisibleModal3] = useState(false);
  //data
  const [selected, setSelected] = useState("");
  const [time, setTime] = useState(moment());
  const [reportIdList, setReportIdList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  //
  const [reports, setReports] = useState();
  const [details, setDetails] = useState(null);
  const [editors, setEditors] = useState([]);
  const [editedDescription, setEditedDescription] = useState(null);
  //
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //
  const [values, setValues] = useState([50]);
  const { getTrackProps, ticks, segments, handles } = useRanger({
    min: 0,
    max: 100,
    stepSize: 1,
    values,
    onChange: setValues,
  });
  async function loadCategory() {
    try {
      const params = {};
      const response = await categoryApi.getAllSub(params);
      setCategoryList(response);
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function autoReviewTask() {
    try {
      const params = { percent: values[0] / 100 };
      console.log(params);
      const response = await taskApi.taskReviewFilter(params);
      if (!JSON.stringify(response).includes("error")) {
        //do something
        toast.success(response.message);
      } else {
        toast.error(response.error.message);
      }
    } catch (e) {
      toast.error("Error: " + e.message);
    }
  }
  async function loadEditors() {
    try {
      const params = {};
      const response = await userApi.getAll(params);
      response
        .filter((user) => user.role.roleId === 3)
        .map((editor) => {
          editors.push({
            specializeNavigation:
              editor.accountInfo.specializeNavigation === undefined
                ? "Không có"
                : editor.accountInfo.specializeNavigation,
            workLoad: editor.accountInfo.workLoad,
            value: editor.accountId,
            label: (
              <div className="d-flex justify-content-between text-center">
                <span>{editor.accountInfo.username}</span>
                <Badge pill color="danger" style={{ paddingTop: "4px" }}>
                  Task đang làm: {editor.accountInfo.workLoad}
                </Badge>
                <Badge pill color="success" style={{ paddingTop: "4px" }}>
                  Chuyên môn:{" "}
                  {editor.accountInfo.specializeNavigation === null
                    ? "Không có"
                    : editor.accountInfo.specializeNavigation.type === null
                    ? "Không có"
                    : editor.accountInfo.specializeNavigation.type}
                </Badge>
              </div>
            ),
          });
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function loadReports() {
    try {
      const params = { status: 3 };
      const response = await reportApi.getByStatus(params);
      //Lọc báo cáo đã được viết thành bài
      setReports(response.filter((report) => report.editorId === null));
    } catch (e) {
      toast.error(e.message);
    }
  }
  const toggleDetails = async (id) => {
    setVisibleModal3(!visibleModal3);
    try {
      const params = { id: id };
      const response = await reportApi.find(params);
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
      setDetails(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  //Tao task
  const createTask = async () => {
    setIsLoading(true);
    try {
      const params = {
        editorId: selected.value,
        deadLineTime: time.format("YYYY-MM-DD HH:mm:ss"),
        description: description,
        reportId: reportIdList,
        boardId: id,
      };
      reportIdList.map(async (reportId) => {
        const params = { reportID: reportId, editorID: selected.value };
        console.log(params);
        const response = await reportApi.updateReportEditor(params);
      });
      const response = await taskApi.create(params);
      if (JSON.stringify(response).includes("taskId")) {
        setVisibleModal(false);
        setEditors([]);
        setIsLoading(false);
        setDescription("");
        setReportIdList([]);
        loadTask();
        // window.location.reload();
      } else {
        setVisibleModal(false);
        setEditors([]);
        setIsLoading(false);
        setDescription("");
        setReportIdList([]);
        toast.error("Tạo thất bại");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const openCreateModalOpen = () => {
    setVisibleModal(!visibleModal);
    loadEditors();
  };
  const openSelectReport = () => {
    setVisibleModal2(!visibleModal2);
    loadReports();
  };
  const handleMoment = (moment) => {
    setTime(moment);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const selectReport = (id) => {
    reportIdList.push(id);
    toggleDetails(id);
  };
  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <StatusColumn>
      <ColumnHeader>
        {statusName(prefix)}{" "}
        {prefix === "Review" && (
          <Checkbutton onClick={() => autoReviewTask()}>Lọc nhanh</Checkbutton>
        )}
      </ColumnHeader>
      <DroppableStyles>
        <Modal
          isOpen={visibleModal3}
          toggle={() => (setVisibleModal3(false), setDetails(null))}
          className=""
          size="lg"
          style={{ maxWidth: "1400px", width: "80%" }}
        >
          <ModalHeader
            className="bg-primary"
            toggle={() => (setVisibleModal3(false), setDetails(null))}
          >
            Chi tiết báo cáo
          </ModalHeader>
          <>
            <ModalBody>
              {details !== null && (
                <Col md={details === null ? 0 : 12}>
                  <div className="bg-light text-dark pt-2 pl-2 pr-2 pb-5 border rounded">
                    <FormGroup row>
                      <Col md="12">
                        <Label for="label">
                          <h4>Chi tiết báo cáo</h4>
                        </Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="location">Địa điểm: </Label>
                      </Col>
                      <Col md="9">{details.location}</Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="timeFraud">Thời gian vụ việc: </Label>
                      </Col>
                      <Col md="9">{details.timeFraud}</Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="createTime">Thời gian viết: </Label>
                      </Col>
                      <Col md="9">{details.createTime}</Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="userId">Người gửi: </Label>
                      </Col>
                      <Col md="9">
                        {details.userId === null ? "Không có" : details.userId}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="category">Phân loại: </Label>
                      </Col>
                      <Col md="9">
                        {details.categoryId === 1
                          ? "Khác"
                          : categoryList.find(
                              (c) => c.categoryId === details.categoryId
                            ).subCategory}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="staffId">Người xác nhận: </Label>
                      </Col>
                      <Col md="9">{details.staffId}</Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label for="description">Chi tiết:</Label>
                      </Col>
                      <Col md="9">
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
                      {details.reportDetails.length > 0 &&
                        (details.reportDetails.filter(
                          (video) => video.type === "Video"
                        ).length > 0
                          ? details.reportDetails
                              .filter((video) => video.type === "Video")
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
                    <Button
                      className="float-right"
                      color="primary"
                      onClick={() => selectReport(details.reportId)}
                    >
                      Chọn báo cáo
                    </Button>
                  </div>
                </Col>
              )}
            </ModalBody>
          </>
        </Modal>
        <Modal
          isOpen={visibleModal2}
          toggle={() => setVisibleModal2(false)}
          className=""
          size="lg"
          style={{ maxWidth: "1600px", width: "80%" }}
        >
          <ModalHeader
            className="bg-primary"
            toggle={() => (setVisibleModal2(false), setDetails(null))}
          >
            Chọn báo cáo đính kèm
          </ModalHeader>
          <>
            <ModalBody></ModalBody>
          </>
        </Modal>
        <Modal
          isOpen={visibleModal}
          toggle={() => (
            setVisibleModal(false),
            setDetails(null),
            setEditors([]),
            setIsLoading(false)
          )}
          className=""
          size="lg"
          style={{ maxWidth: "900px", width: "80%" }}
        >
          <ModalHeader
            className="bg-primary"
            toggle={() => (
              setVisibleModal(false),
              setDetails(null),
              setEditors([]),
              setIsLoading(false)
            )}
          >
            Tạo công việc
          </ModalHeader>
          <>
            <ModalBody>
              <Row>
                <Col md={details === null ? 12 : 0}>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>
                          Miêu tả công việc:
                          <span style={{ color: "red" }}>*</span>
                        </b>{" "}
                      </Label>
                    </Col>
                    <Col md="9">
                      <div className="row pl-3">Text</div>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>
                          Người đảm nhận:<span style={{ color: "red" }}>*</span>
                        </b>{" "}
                      </Label>
                    </Col>
                    <Col md="9">
                      <Select
                        name="editorId"
                        // isDisabled={editors.length !== 0}
                        options={editors}
                        onChange={(option) => setSelected(option)}
                        placeholder="Chọn người đảm nhận công việc"
                        defaultValue={selected}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>
                          Chọn deadline:<span style={{ color: "red" }}>*</span>
                        </b>{" "}
                      </Label>
                    </Col>
                    <Col md="10">
                      <DatetimePickerTrigger
                        shortcuts={shortcuts}
                        moment={time}
                        onChange={handleMoment}
                        minDate={moment()}
                      >
                        <Row>
                          <Col md="6">
                            <input
                              className="pt-1 pb-1"
                              type="text"
                              value={time.format("YYYY-MM-DD HH:mm")}
                              readOnly
                            />
                          </Col>
                          <Col md="6">
                            <i className="icon-calendar p-2 ml-2 border" />
                          </Col>
                        </Row>
                      </DatetimePickerTrigger>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Label for="file">
                        <b>Báo cáo đính kèm:</b>
                      </Label>
                    </Col>
                    <Col md="10">
                      <Button
                        class="btn btn-primary"
                        color="primary"
                        onClick={() => openSelectReport()}
                      >
                        Chọn báo cáo
                      </Button>
                    </Col>
                    <Col md="12">
                      <Label for="file">
                        Đã chọn: {reportIdList.length} báo cáo
                      </Label>
                    </Col>
                    <Col md="12">
                      <Label for="file">
                        {reportIdList !== null &&
                          reportIdList.map((reportId) => (
                            <div>
                              <div className="badge badge-success">
                                {reportId}
                              </div>
                            </div>
                          ))}
                      </Label>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              {!isLoading ? (
                <Button
                  onClick={() => createTask()}
                  color="primary"
                  class="font-weight-bold btn btn-primary"
                >
                  Tạo công việc
                </Button>
              ) : (
                <Button class="font-weight-bold btn btn-primary">
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Đang tạo công việc
                </Button>
              )}
            </ModalFooter>
          </>
        </Modal>

        {prefix === "New" && (
          <CreateTaskButton onClick={() => openCreateModalOpen()}>
            <icon className="fa fa-plus"></icon> Tạo công việc mới
          </CreateTaskButton>
        )}
        {prefix === "Review" && (
          <Row style={{ maxWidth: "16vw", marginLeft: "0.25rem" }}>
            <Col md={12}>
              <Track {...getTrackProps()}>
                {ticks.map(({ value, getTickProps }) => (
                  <Tick {...getTickProps()}>
                    <TickLabel>{value}</TickLabel>
                  </Tick>
                ))}
                {segments.map(({ getSegmentProps }, i) => (
                  <Segment {...getSegmentProps()} index={i} />
                ))}
                {handles.map(({ value, active, getHandleProps }) => (
                  <button
                    {...getHandleProps({
                      style: {
                        appearance: "none",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      },
                    })}
                  >
                    <Handle active={active}>{value}</Handle>
                  </button>
                ))}
              </Track>
            </Col>
          </Row>
        )}
        <Droppable droppableId={`${prefix}`}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.filter((task) => task.status === prefix).length === 0 ? (
                <EmptyList />
              ) : (
                tasks.map(
                  (item, index) =>
                    item.status === prefix && (
                      <ListItem
                        loadTask={loadTask}
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    )
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DroppableStyles>
    </StatusColumn>
  );
};

export default DraggableTask;
