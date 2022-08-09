import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableTask from "./components/EditorManagerTaskComponents/DragableTask";
import taskApi from "../../api/TaskApi";
import reportApi from "../../api/reportApi";
import moment from "moment";
import "moment/locale/vi";
import { toast } from "react-toastify";
import {
  Badge,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Button, Col, Row } from "react-bootstrap";
import { Markup } from "interweave";
import userApi from "../../api/UserApi";
import Select from "react-select";
import { DatetimePickerTrigger } from "rc-datetime-picker";
// const MIN_LENGTH_DESCRIPTION = 10;
// const MAX_LENGTH_DESCRIPTION = 300;
const DragDropContextContainer = styled.div`
  padding: 10px;
  border-radius: 6px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 2px;
`;
const shortcuts = {
  Today: moment(),
  Yesterday: moment().subtract(1, "days"),
  Clear: "",
};
const statusList = ["New", "Pending", "Review", "Finish", "UnFinished"];
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
function Tasks(props) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState();
  const search = props.location.search;
  const urlParams = new URLSearchParams(search);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModal2, setVisibleModal2] = useState(false);
  const [visibleModal3, setVisibleModal3] = useState(false);
  const [visibleModal4, setVisibleModal4] = useState(false);
  const [details, setDetails] = useState(null);
  const [editors, setEditors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("");
  const [time, setTime] = useState(moment());
  const [reports, setReports] = useState();
  const [editedDescription, setEditedDescription] = useState(null);
  const [reportIdList, setReportIdList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const id = urlParams.get("id");
  //
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
  // load tasks
  const loadTask = async () => {
    try {
      const params = { BoardId: id };
      const response = await taskApi.getAll(params);
      setTasks(
        response
          .sort((a, b) => new moment(a.createTime) - new moment(b.createTime))
          .reverse()
      );
    } catch (e) {
      toast.error(e.message);
    }
  };
  const abortTask = async () => {
    //bỏ task
    const params = {
      taskId: task.taskId,
      status: 5,
      postId: task.posts[0].postId,
    };
    task.reportTasks.map(async (task) => {
      const params2 = { reportID: task.reportId, editorID: "" };
      await reportApi.updateReportEditor(params2);
    });
    const response = await taskApi.updateStatus(params);
    if (!JSON.stringify(response).includes("error")) {
      toast.success("Không tạo tại task");
      loadTask();
    } else {
      loadTask();
    }
  };
  const resetTask = async () => {
    // Tạo mới task
    try {
      const params = {
        editorId: selected.value,
        deadLineTime: time.format("YYYY-MM-DD HH:mm:ss"),
        description: description,
        reportId: task.reportTasks.map((report) => report.reportId),
        boardId: task.boardId,
      };
      const response = await taskApi.create(params);
      if (JSON.stringify(response).includes("taskId")) {
        setVisibleModal(false);
        setIsLoading(false);
        // Bỏ task vào chưa xong
        const params = {
          taskId: task.taskId,
          status: 5,
          postId: task.posts[0].postId,
        };
        const response = await taskApi.updateStatus(params);
        if (!JSON.stringify(response).includes("error")) {
          toast.success("Tạo lại task thành công");
        }
        loadTask();
      } else {
        loadTask();
        toast.error("Tạo lại thất bại");
        setVisibleModal(false);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const toggleDetails = async (id) => {
    setVisibleModal4(!visibleModal4);
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
  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    try {
      const params = {
        taskId: result.draggableId,
        status:
          result.destination.droppableId === "New"
            ? 1
            : result.destination.droppableId === "Pending"
            ? 2
            : result.destination.droppableId === "Review"
            ? 3
            : result.destination.droppableId === "Finish"
            ? 4
            : result.destination.droppableId === "UnFinished"
            ? 5
            : null,
        postId:
          tasks
            .filter((task) => task.taskId === result.draggableId)
            .map((task) => task)[0].posts.length !== 0
            ? tasks
                .filter((task) => task.taskId === result.draggableId)
                .map((task) => task)[0].posts[0].postId
            : null,
      };
      if (result.destination.droppableId === "UnFinished") {
        const params = { id: result.draggableId };
        const response = await taskApi.getById(params);
        if (!JSON.stringify(response).includes("error")) {
          setVisibleModal(true);
          setTask(response);
        }
      } else {
        await taskApi.updateStatus(params);
      }
      loadTask();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleMoment = (moment) => {
    setTime(moment);
  };
  const openSelectReport = () => {
    setVisibleModal3(!visibleModal3);
    loadReports();
  };
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadTask();
  }, [temp]);
  return (
    <>
      <Modal
        isOpen={visibleModal4}
        toggle={() => (setVisibleModal4(false), setDetails(null))}
        className=""
        size="lg"
        style={{ maxWidth: "1400px", width: "80%" }}
      >
        <ModalHeader
          className="bg-primary"
          toggle={() => (setVisibleModal4(false), setDetails(null))}
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
                </div>
              </Col>
            )}
          </ModalBody>
        </>
      </Modal>
      <Modal
        isOpen={visibleModal3}
        toggle={() => setVisibleModal3(false)}
        className=""
        size="lg"
        style={{ maxWidth: "1600px", width: "80%" }}
      >
        <ModalHeader
          className="bg-primary"
          toggle={() => (setVisibleModal3(false), setDetails(null))}
        >
          Chọn báo cáo đính kèm
        </ModalHeader>
        <>
          <ModalBody>Table</ModalBody>
        </>
      </Modal>
      <Modal
        isOpen={visibleModal2}
        toggle={() => (
          setVisibleModal2(false),
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
            setVisibleModal2(false),
            setDetails(null),
            setEditors([]),
            setIsLoading(false)
          )}
        >
          Tạo lại công việc
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
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {!isLoading ? (
              <Button
                onClick={() => resetTask()}
                color="primary"
                class="font-weight-bold btn btn-primary"
              >
                Tạo lại công việc
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
      <Modal
        isOpen={visibleModal}
        toggle={() => (setVisibleModal(false), setIsLoading(false), setTask())}
        className=""
        size="lg"
        style={{ maxWidth: "400px", width: "40%", paddingTop: "15rem" }}
      >
        <ModalHeader
          className="bg-primary"
          toggle={() => (
            setVisibleModal(false), setIsLoading(false), setTask()
          )}
        >
          Tạo công việc
        </ModalHeader>
        <>
          <ModalBody>
            <span className="font-weight-bold h5">
              Bạn có muốn tạo lại task này?
            </span>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => (
                setVisibleModal(false), setIsLoading(false), abortTask()
              )}
              class="font-weight-bold "
            >
              Không cần
            </Button>
            {!isLoading ? (
              <Button
                color="info"
                onClick={() => (loadEditors(), setVisibleModal2(true))}
                class="font-weight-bold"
              >
                Tạo lại công việc
              </Button>
            ) : (
              <Button class="font-weight-bold">
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Đang tạo lại công việc
              </Button>
            )}
          </ModalFooter>
        </>
      </Modal>
      <DragDropContextContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <ListGrid>
            {statusList.map((listKey) => (
              <DraggableTask
                loadTask={loadTask}
                id={id}
                tasks={tasks}
                key={listKey}
                prefix={listKey}
              />
            ))}
          </ListGrid>
        </DragDropContext>
      </DragDropContextContainer>
    </>
  );
}

export default Tasks;
