/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BoardTitle } from "./components/BoardTitle";
import { BoardModal } from "./components/BoardModal";
import { toast } from "react-toastify";
import boardApi from "../../api/boardApi";
import { Card, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [bgColors, setBgColors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState("None");
  const randomColor = (id) => {
    if (!bgColors.find((item) => item.name === id)) {
      bgColors.push({
        name: id,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        color2: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
  };
  useEffect(() => {
    // setLoading(true);
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const params = {};
      const response = await boardApi.getAll(params);
      response.map((board) => randomColor(board.boardId));
      setBoards(response);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const addBoard = async (board) => {
    try {
      const response = await boardApi.addBoard(board);
      if (!JSON.stringify(response).includes("error")) {
        toast.error("Tạo thành công");
      }
    } catch (e) {
      toast.error(e.message);
    }
    setModalVisible(false);
  };

  // const starredBoards = boards.filter((board) => board.starred);
  return (
    <Row className="">
      <Col lg="12" className="">
        <Card className="rounded" style={{ height: "70vh" }}>
          <Card.Body className="">
            <div>
              <div className="mb-3 font-weight-bold h4">
                <i className="fa fa-light fa-star mr-2" /> Tất cả bảng công việc
                {"  "}
                <OverlayTrigger
                  trigger={["click"]}
                  placement="right"
                  rootClose
                  data-trigger="focus"
                  onExit={() => setSettings("None")}
                  on
                  overlay={
                    <Popover id="popover-contained">
                      <Popover.Header className="font-weight-bold border-bottom h4">
                        Tùy chỉnh
                      </Popover.Header>
                      <Popover.Body>
                        <div
                          className="setting-option h5"
                          onClick={() => setSettings("Renamed")}
                        >
                          Sửa tên
                        </div>
                        <div
                          className="setting-option h5 text-danger"
                          onClick={() => setSettings("Delete")}
                        >
                          Xóa
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <i className="fa fa-solid fa-wrench"></i>
                </OverlayTrigger>
              </div>
              {settings === "Renamed" ? (
                <div className="row px-1">
                  {boards.length !== 0 &&
                    boards
                      .filter((board) => board.isDelete === false)
                      .map((board) => (
                        <div className="col-3 mb-2 board">
                          <BoardTitle
                            key={board.boardId}
                            title={board.boardName}
                            date={board.createTime}
                            managerId={board.managerId}
                            addition={false}
                            settingType={"Renamed"}
                            handleBoardClick={() => {}}
                          />
                        </div>
                      ))}
                </div>
              ) : settings === "Delete" ? (
                <div className="row px-1">
                  {boards.length !== 0 &&
                    boards
                      .filter((board) => board.isDelete === false)
                      .map((board) => (
                        <div className="col-3 mb-2 board">
                          <BoardTitle
                            key={board.boardId}
                            title={board.boardName}
                            date={board.createTime}
                            managerId={board.managerId}
                            addition={false}
                            settingType={"Delete"}
                            handleBoardClick={() => {}}
                          />
                        </div>
                      ))}
                </div>
              ) : (
                <div className="row px-1">
                  {boards.length !== 0 &&
                    boards
                      .filter((board) => board.isDelete === false)
                      .map((board) => (
                        <div className="col-3 mb-2 board">
                          <BoardTitle
                            key={board.boardId}
                            title={board.boardName}
                            date={board.createTime}
                            managerId={board.managerId}
                            addition={false}
                            bgColors={bgColors.filter(
                              (color) => color.name === board.boardId
                            )}
                            handleBoardClick={() =>
                              (window.location.href = `tasks?id=${board.boardId}`)
                            }
                          />
                        </div>
                      ))}
                  <div className="col-3 mb-2">
                    <BoardTitle
                      title="Tạo thêm bảng"
                      addition={true}
                      handleBoardClick={() => setModalVisible(!modalVisible)}
                    />
                  </div>
                </div>
              )}

              <BoardModal
                action={addBoard}
                closeModal={() => setModalVisible(!modalVisible)}
                visible={modalVisible}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default Boards;
