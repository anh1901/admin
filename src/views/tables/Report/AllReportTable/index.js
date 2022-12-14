import { Chip } from "@mui/material";
import { Markup } from "interweave";
import MaterialTable from "material-table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import reportApi from "../../../../api/reportApi";
import { Button } from "react-bootstrap";
import "../../style.css";
import { toast } from "react-toastify";
import updateReportApi from "../../../../api/updateReportApi";
const AllReportTable = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [reports, setReports] = useState([]);
  const [show, setShow] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState();
  const [selectedReport, setSelectedReport] = useState();
  const [temp, setTemp] = useState(0);
  const loadReports = async () => {
    try {
      const params = { status: 1 };
      const response = await reportApi.getByStatus(params);
      setReports(
        response
          .sort((a, b) => new moment(a.createTime) - new moment(b.createTime))
          .reverse()
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
    loadReports();
  }, [temp]);
  const columns = [
    {
      title: "Thứ tự",
      field: "reportId",
      width: "1%",
      render: (rowData) => {
        return <div>{rowData.tableData.id + 1}</div>;
      },
    },
    { title: "Địa diểm", field: "location", width: "10%" },
    {
      title: "Thời gian gửi",
      field: "createTime",
      width: "10%",
      render: (rowData) => {
        return (
          <div>{moment(rowData.createTime).format("DD.MM.YYYY HH:mm:ss")}</div>
        );
      },
    },
    {
      title: "Nội dung",
      field: "description",
      width: "10%",
      render: (rowData) => {
        return (
          <div
            className="py font-weight-bold"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "20rem",
            }}
          >
            <Markup
              content={rowData.description}
              allowAttributes
              allowElements
              blockList={["img", "iframe"]}
              noHtml={true}
            />
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      field: "reportViews",
      width: "10%",
      render: (rowData) => {
        return (
          <div className="bluebag">
            {!(
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
            ) && (
              <Chip
                key={rowData.tableData.id}
                label={"Chưa đọc"}
                color="error"
              />
            )}
          </div>
        );
      },
    },
  ];
  const handleShowModel = async (report_data) => {
    setSelectedReport(report_data);
    setShow(true);
    try {
      const param = {
        reportId: report_data.reportId,
        userId: user_info.accountId,
      };
      await reportApi.reportViewUpdate(param);
      loadReports();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleCloseImg = () => {
    setShowImg(false);
  };
  const viewImg = (image) => {
    setSelectedImg(image);
    setShowImg(true);
  };
  const handlePending = async (reportId, status) => {
    try {
      const param = {
        reportId: reportId,
        status: status,
        staffId: user_info.accountId,
      };
      const response = await updateReportApi.update(param);
      toast.success(response.message);
      loadReports();
      setShow(false);
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
          <Modal.Title>Chi tiết báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <div className="mm-example-row">
            <Container fluid>
              {selectedReport && (
                <>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Địa điểm:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {selectedReport.location}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Thời điểm xảy ra:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {moment(selectedReport.timeFraud).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Thời điểm gửi:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {moment(selectedReport.createTime).format(
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
                        content={selectedReport.description}
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
                      {selectedReport.reportDetails.length > 0 &&
                      selectedReport.reportDetails.filter(
                        (img) => img.type === "Image"
                      ).length > 0
                        ? selectedReport.reportDetails
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
                        : null}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <b>Video đính kèm:</b>
                    </Col>
                    <Col md="9" className="ml-auto">
                      {selectedReport.reportDetails.length > 0 &&
                      selectedReport.reportDetails.filter(
                        (video) => video.type === "Video"
                      ).length > 0
                        ? selectedReport.reportDetails
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
                        : null}
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
          <Button
            variant="danger"
            onClick={() => handlePending(selectedReport.reportId, 4)}
          >
            Từ chối
          </Button>
          <Button
            variant="warning"
            onClick={() => handlePending(selectedReport.reportId, 2)}
          >
            Chờ xử lý
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
        <Modal.Body style={{ color: "black" }}>
          <img
            src={selectedImg}
            alt="large-img"
            width="1100px"
            height="870px"
          />
        </Modal.Body>
      </Modal>
      <MaterialTable
        columns={columns}
        data={reports}
        title="Tất cả báo cáo mới"
        actions={[
          {
            icon: "add",
            tooltip: "Tạo báo cáo",
            isFreeAction: true,
            onClick: (event) => (window.location.href = "/admin/create-report"),
          },
          {
            icon: "visibility",
            tooltip: "Xem chi tiết báo cáo",
            onClick: (event, rowData) => handleShowModel(rowData),
          },
        ]}
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
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
                ? "white"
                : "lightgray",
            fontWeight:
              rowData.reportViews.length > 0 &&
              rowData.reportViews.filter(
                (e) => e.userId === user_info.accountId
              ).length > 0
                ? ""
                : "bold",
          }),
        }}
      />
    </div>
  );
};

export default AllReportTable;
