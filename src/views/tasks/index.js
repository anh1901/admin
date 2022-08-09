/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "moment/locale/vi";
import { toast } from "react-toastify";
import { Card, Col, Row } from "react-bootstrap";
import MyPostTable from "../tables/Posts/MyPostTable";
import MyTasksTable from "./MyTasksTable";
const Tasks = () => {
  // const user_info = JSON.parse(localStorage.getItem("user_info"));

  const loadAllTasks = async () => {
    try {
      //
    } catch (e) {
      toast.error(e.message);
    }
  };
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1);
    }, 5000);
  }, []);
  useEffect(() => {
    loadAllTasks();
  }, [temp]);
  useEffect(() => {
    loadAllTasks();
  }, []);
  return (
    <Row className="">
      <Col lg="12" className="">
        <Card className="rounded">
          <Card.Body className="">
            <Row className="">
              <Col sm="12" className="">
                <h4 className="mb-2">Công việc của tôi</h4>
              </Col>
            </Row>
            <Row className="">
              <Col sm="12" className=" mt-4">
                <div className="table-responsive-lg">
                  <MyTasksTable />
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <MyPostTable />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default Tasks;
