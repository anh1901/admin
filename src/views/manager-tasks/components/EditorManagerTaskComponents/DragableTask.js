/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import * as moment from "moment";
import Select from "react-select";
import { useRanger } from "react-ranger";
import categoryApi from "../../../../api/categoryApi";
import taskApi from "../../../../api/TaskApi";
import userApi from "../../../../api/UserApi";
import reportApi from "../../../../api/reportApi";
import { Badge, Label } from "reactstrap";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import ApprovedReportTable from "../../../tables/Report/ApprovedReportTable";

export const Track = styled("div")`
  display: inline-block;
  height: 8px;
  width: 104%;
  margin: 5% 1% 1% 1%;
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
  font-size: 16px;
  font-weight: bold;
  color: black !important;
  font-family: "Times New Roman", Times, serif;
`;
const StatusColumn = styled.div`
  max-height: 80vh;
  height: 80vh;
  padding: 5px;
  border-radius: 5px;
  background: #ededed;
  box-shadow: 0px 0px 3px #ededed;
`;
const DroppableStyles = styled.div`
  max-height: 75vh;
  overflow: auto;
  border-radius: 5px;
  background: #ededed;
  box-shadow: 0px 0px 3px #ededed;
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
    default:
      return "";
  }
};
const shortcuts = {
  Today: moment(),
  Yesterday: moment().subtract(1, "days"),
  Clear: "",
};
const DraggableTask = ({ prefix, tasks, id, loadTask }) => {
  const [showCreate, setShowCreate] = useState(false);
  //data
  const [selected, setSelected] = useState("");
  const [time, setTime] = useState(moment());
  const [reportSelectedList, setReportSelectedList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [editors, setEditors] = useState([]);
  const [description, setDescription] = useState("");
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
  //Tao task
  const createTask = async () => {
    try {
      const params = {
        editorId: selected.value,
        deadLineTime: time.format("YYYY-MM-DD HH:mm:ss"),
        description: description,
        reportId: reportSelectedList,
        boardId: id,
      };
      reportSelectedList.map(async (reportId) => {
        const params = { reportID: reportId, editorID: selected.value };
        console.log(params);
        await reportApi.updateReportEditor(params);
      });
      console.log(params);
      const response = await taskApi.create(params);
      if (JSON.stringify(response).includes("taskId")) {
        setEditors([]);
        setDescription("");
        setReportSelectedList([]);
        loadTask();
        setTime(moment());
        setSelected("");
        setShowCreate(false);
        toast.success("Tạo công việc thành công");
      } else {
        setEditors([]);
        setDescription("");
        setReportSelectedList([]);
        setShowCreate(false);
        setTime(moment());
        setSelected("");
        toast.error("Tạo thất bại");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleNewTask = () => {
    setShowCreate(true);
    loadEditors();
  };
  const handleCloseCreate = () => {
    setShowCreate(false);
    setEditors([]);
    setReportSelectedList([]);
    setDescription("");
    setTime(moment());
  };
  const handleTextChange = (e) => {
    setDescription(e.target.value);
  };
  const handleMoment = (moment) => {
    setTime(moment);
  };
  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <StatusColumn>
      <Modal show={showCreate} onHide={handleCloseCreate} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Tạo công việc</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md="2">
                  <Label for="file">
                    <b>
                      Miêu tả công việc:
                      <span style={{ color: "red" }}>*</span>
                    </b>{" "}
                  </Label>
                </Col>
                <Col md="9">
                  <div className="row pl-3">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                      onChange={(e) => handleTextChange(e)}
                    >
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
              <Row>
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
                    className="mb-3"
                  />
                </Col>
              </Row>
              <Row>
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
                    className="mb-3"
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
                    </Row>
                  </DatetimePickerTrigger>
                </Col>
              </Row>
              <ApprovedReportTable
                setReportSelectedList={setReportSelectedList}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreate}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => createTask()}>
            Tạo công việc
          </Button>
        </Modal.Footer>
      </Modal>
      <ColumnHeader>
        {statusName(prefix)}{" "}
        {prefix === "Review" && (
          <Checkbutton onClick={() => autoReviewTask()}>
            Duyệt nhanh
          </Checkbutton>
        )}
      </ColumnHeader>
      <DroppableStyles>
        {prefix === "New" && (
          <CreateTaskButton onClick={() => handleNewTask()}>
            <icon className="fa fa-plus" style={{ color: "black" }}></icon>{" "}
            <span style={{ color: "black" }}>Tạo công việc mới</span>
          </CreateTaskButton>
        )}
        {/* Duyệt nhanh */}
        {prefix === "Review" && (
          <Row style={{ maxWidth: "19rem", paddingLeft: "1rem" }}>
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
              <EmptyList />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DroppableStyles>
    </StatusColumn>
  );
};

export default DraggableTask;
