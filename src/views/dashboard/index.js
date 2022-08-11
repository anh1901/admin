/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Button } from "react-bootstrap";
import { bindActionCreators } from "redux";
//circular
import Circularprogressbar from "../../components/circularprogressbar.js";
// AOS
import AOS from "aos";
import "../../../node_modules/aos/dist/aos";
import "../../../node_modules/aos/dist/aos.css";
//apexcharts
import Chart from "react-apexcharts";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.scss";

//Count-up
import CountUp from "react-countup";
// store
import {
  NavbarstyleAction,
  getDirMode,
  getcustomizerMode,
  getcustomizerprimaryMode,
  getcustomizerinfoMode,
  SchemeDirAction,
  ColorCustomizerAction,
  getNavbarStyleMode,
  getSidebarActiveMode,
  SidebarActiveStyleAction,
  getDarkMode,
  ModeAction,
  SidebarColorAction,
  getSidebarColorMode,
  getSidebarTypeMode,
} from "../../store/setting/setting";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import reportApi from "../../api/reportApi.js";
import taskApi from "../../api/TaskApi.js";
import postApi from "../../api/postApi.js";
import userApi from "../../api/UserApi.js";

// install Swiper modules
SwiperCore.use([Navigation]);

const mapStateToProps = (state) => {
  return {
    darkMode: getDarkMode(state),
    customizerMode: getcustomizerMode(state),
    cololrinfomode: getcustomizerinfoMode(state),
    colorprimarymode: getcustomizerprimaryMode(state),
    schemeDirMode: getDirMode(state),
    sidebarcolorMode: getSidebarColorMode(state),
    sidebarTypeMode: getSidebarTypeMode(state),
    sidebaractivestyleMode: getSidebarActiveMode(state),
    navbarstylemode: getNavbarStyleMode(state),
  };
};
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      ModeAction,
      SchemeDirAction,
      SidebarColorAction,
      SidebarActiveStyleAction,
      NavbarstyleAction,
      ColorCustomizerAction,
    },
    dispatch
  ),
});

const Index = (props) => {
  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      disable: function () {
        var maxWidth = 996;
        return window.innerWidth < maxWidth;
      },
      throttleDelay: 10,
      once: true,
      duration: 700,
      offset: 10,
    });
    //   customizer
    const colorcustomizerMode = sessionStorage.getItem("color-customizer-mode");
    const colorcustomizerinfoMode = sessionStorage.getItem(
      "colorcustominfo-mode"
    );
    const colorcustomizerprimaryMode = sessionStorage.getItem(
      "colorcustomprimary-mode"
    );
    if (colorcustomizerMode === null) {
      props.ColorCustomizerAction(
        props.customizerMode,
        props.cololrinfomode,
        props.colorprimarymode
      );
      document.documentElement.style.setProperty(
        "--bs-info",
        props.cololrinfomode
      );
    } else {
      props.ColorCustomizerAction(
        colorcustomizerMode,
        colorcustomizerinfoMode,
        colorcustomizerprimaryMode
      );
      document.documentElement.style.setProperty(
        "--bs-info",
        colorcustomizerinfoMode
      );
    }
  });

  const chart1 = {
    options: {
      chart: {
        fontFamily:
          '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
      },
      colors: ["blue", "red"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          minWidth: 19,
          maxWidth: 19,
          style: {
            colors: "#8A92A6",
          },
          offsetX: -5,
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        labels: {
          minHeight: 22,
          maxHeight: 22,
          show: true,
          style: {
            colors: "#8A92A6",
          },
        },
        lines: {
          show: false, //or just here to disable only x axis grids
        },
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      grid: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 50, 80],
          colors: [props.colorprimarymode, props.cololrinfomode],
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    series: [
      {
        name: "Đã xem xét",
        data: [94, 80, 94, 80, 94, 80, 94, 65, 65, 87, 32, 13],
      },
      {
        name: "Bị từ chối",
        data: [72, 60, 84, 60, 74, 60, 78, 87, 54, 65, 87, 32],
      },
    ],
  };
  const chart2 = {
    options: {
      colors: [props.colorprimarymode, "#fc1303"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 10,
            size: "50%",
          },
          track: {
            margin: 10,
            strokeWidth: "50%",
          },
          dataLabels: {
            show: true,
          },
        },
      },
      labels: ["Đã hoàn thành", "Chưa hoàn thành"],
    },
    series: [55, 75],
  };
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editors, setEditors] = useState([]);
  const [temp, setTemp] = useState(0);
  const loadReports = async () => {
    try {
      const params = {};
      const response = await reportApi.getAll(params);
      setReports(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const loadPost = async () => {
    try {
      const params = {
        EditorID: user_info !== null && user_info.accountId,
        Status: "",
      };
      const response = await postApi.getByIdAndStatus(params);
      setPosts(response);
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
    loadAllTasks();
    loadPost();
    loadManagerTasks();
    loadUsers();
  }, [temp]);
  const loadUsers = async () => {
    try {
      const params = {};
      const response = await userApi.getAll(params);
      setEditors(response.filter((user) => user.role.roleId === 3));
    } catch (err) {
      alert(err.message);
    }
  };
  const loadManagerTasks = async () => {
    try {
      const param = {};
      const response = await taskApi.getAllManager(param);
      setAllTasks(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const loadAllTasks = async () => {
    try {
      const params = {
        EditorID: user_info.accountId,
        status: "",
      };
      const response = await taskApi.getAllByIdAndStatus(params);
      setTasks(response);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  return (
    <>
      {user_info.role.roleId === 2 && (
        <Row>
          <Col md="12" lg="12">
            <Row className="row-cols-1">
              <div className="overflow-hidden d-slider1 ">
                <Swiper
                  className="p-0 m-0 mb-2 list-inline "
                  slidesPerView={5}
                  spaceBetween={32}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    550: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                    1920: { slidesPerView: 6 },
                    2040: { slidesPerView: 7 },
                    2440: { slidesPerView: 8 },
                  }}
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <SwiperSlide className="card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          Linecap="rounded"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          style={{ width: 60, height: 60 }}
                          value={100}
                          id="circle-progress-01"
                        >
                          100%
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Tất cả báo cáo</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={reports.length}
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (reports.filter((e) => e.status === "New").length /
                              reports.length) *
                            100
                          }
                          id="circle-progress-02"
                        >
                          {Math.round(
                            (reports.filter((e) => e.status === "New").length /
                              reports.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Báo cáo mới</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                reports.filter((e) => e.status === "New").length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (reports.filter((e) => e.status === "Pending")
                              .length /
                              reports.length) *
                            100
                          }
                          id="circle-progress-03"
                        >
                          {Math.round(
                            (reports.filter((e) => e.status === "Pending")
                              .length /
                              reports.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Báo cáo đang xử lý</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                reports.filter((e) => e.status === "Pending")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (reports.filter((e) => e.status === "Approved")
                              .length /
                              reports.length) *
                            100
                          }
                          id="circle-progress-04"
                        >
                          {Math.round(
                            (reports.filter((e) => e.status === "Approved")
                              .length /
                              reports.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Báo cáo đã xem xét</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                reports.filter((e) => e.status === "Approved")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke="red"
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (reports.filter((e) => e.status === "Denied")
                              .length /
                              reports.length) *
                            100
                          }
                          id="circle-progress-05"
                        >
                          {Math.round(
                            (reports.filter((e) => e.status === "Denied")
                              .length /
                              reports.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Báo cáo bị từ chối</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                reports.filter((e) => e.status === "Denied")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <div className="swiper-button swiper-button-next"></div>
                  <div className="swiper-button swiper-button-prev"></div>
                </Swiper>
              </div>
            </Row>
          </Col>
          <Col md="12" lg="12">
            <Row>
              <Col md="12">
                <div className="card" data-aos="fade-up" data-aos-delay="800">
                  <div className="flex-wrap card-header d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Thống kê</h4>
                      <p className="mb-0">báo cáo</p>
                    </div>
                    <div className="d-flex align-items-center align-self-center">
                      <div className="d-flex align-items-center text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <g>
                            <circle
                              cx="12"
                              cy="12"
                              r="8"
                              fill="currentColor"
                            ></circle>
                          </g>
                        </svg>
                        <div className="ms-2">
                          <span className="text-secondary">
                            Báo cáo đã xem xét
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center ms-3 text-info">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          viewBox="0 0 24 24"
                          fill="red"
                        >
                          <g>
                            <circle cx="12" cy="12" r="8" fill="red"></circle>
                          </g>
                        </svg>
                        <div className="ms-2">
                          <span className="text-secondary">
                            Báo cáo bị từ chối
                          </span>
                        </div>
                      </div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        as={Button}
                        href="#"
                        variant=" text-secondary dropdown-toggle"
                        id="dropdownMenuButton2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Năm nay
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-end"
                        aria-labelledby="dropdownMenuButton2"
                      >
                        <li>
                          <Dropdown.Item href="#">Tuần này</Dropdown.Item>
                        </li>
                        <li>
                          <Dropdown.Item href="#">Tháng này</Dropdown.Item>
                        </li>
                        <li>
                          <Dropdown.Item href="#">Năm nay</Dropdown.Item>
                        </li>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="card-body">
                    <Chart
                      options={chart1.options}
                      series={chart1.series}
                      type="area"
                      height="245"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {user_info.role.roleId === 3 && (
        <Row>
          <Col md="12" lg="12">
            <Row className="row-cols-1">
              <div className="overflow-hidden d-slider1 ">
                <Swiper
                  className="p-0 m-0 mb-2 list-inline "
                  slidesPerView={6}
                  spaceBetween={32}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    550: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                    1920: { slidesPerView: 6 },
                    2040: { slidesPerView: 7 },
                    2440: { slidesPerView: 8 },
                  }}
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <SwiperSlide className="card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          Linecap="rounded"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          style={{ width: 60, height: 60 }}
                          value={100}
                          id="circle-progress-01"
                        >
                          100%
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Tất cả công việc</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={tasks.length}
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (tasks.filter((e) => e.status === "New").length /
                              tasks.length) *
                            100
                          }
                          id="circle-progress-02"
                        >
                          {Math.round(
                            (tasks.filter((e) => e.status === "New").length /
                              tasks.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Công việc mới</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                tasks.filter((e) => e.status === "New").length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (tasks.filter((e) => e.status === "Pending")
                              .length /
                              tasks.length) *
                            100
                          }
                          id="circle-progress-03"
                        >
                          {Math.round(
                            (tasks.filter((e) => e.status === "Pending")
                              .length /
                              tasks.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Đang làm</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                tasks.filter((e) => e.status === "Pending")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (tasks.filter((e) => e.status === "Review").length /
                              tasks.length) *
                            100
                          }
                          id="circle-progress-04"
                        >
                          {Math.round(
                            (tasks.filter((e) => e.status === "Review").length /
                              tasks.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Đang xem xét</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                tasks.filter((e) => e.status === "Review")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke="red"
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (tasks.filter((e) => e.status === "Finish").length /
                              tasks.length) *
                            100
                          }
                          id="circle-progress-05"
                        >
                          {Math.round(
                            (tasks.filter((e) => e.status === "Finish").length /
                              tasks.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Đã hoàn thành</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                tasks.filter((e) => e.status === "Finish")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke="red"
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (tasks.filter((e) => e.status === "UnFinished")
                              .length /
                              tasks.length) *
                            100
                          }
                          id="circle-progress-05"
                        >
                          {Math.round(
                            (tasks.filter((e) => e.status === "UnFinished")
                              .length /
                              tasks.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Công việc không hoàn thành</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                tasks.filter((e) => e.status === "UnFinished")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <div className="swiper-button swiper-button-next"></div>
                  <div className="swiper-button swiper-button-prev"></div>
                </Swiper>
              </div>
            </Row>
          </Col>
          <Col md="12" lg="12">
            <Row className="mb-4">
              <h3>Thống kê bài viết</h3>
            </Row>
            <Row className="row-cols-1">
              <div className="overflow-hidden d-slider1 ">
                <Swiper
                  className="p-0 m-0 mb-2 list-inline "
                  slidesPerView={3}
                  spaceBetween={40}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    550: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                    1500: { slidesPerView: 5 },
                    1920: { slidesPerView: 6 },
                    2040: { slidesPerView: 7 },
                    2440: { slidesPerView: 8 },
                  }}
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <SwiperSlide className="card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          Linecap="rounded"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          style={{ width: 60, height: 60 }}
                          value={100}
                          id="circle-progress-01"
                        >
                          100%
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Tổng bài viết</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={posts.length}
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (posts.filter((e) => e.status === "Draft").length /
                              posts.length) *
                            100
                          }
                          id="circle-progress-02"
                        >
                          {Math.round(
                            (posts.filter((e) => e.status === "Draft").length /
                              posts.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Bài viết nháp</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                posts.filter((e) => e.status === "Draft").length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.colorprimarymode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (posts.filter((e) => e.status === "Hidden").length /
                              posts.length) *
                            100
                          }
                          id="circle-progress-03"
                        >
                          {Math.round(
                            (posts.filter((e) => e.status === "Hidden").length /
                              posts.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Đã nộp</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                posts.filter((e) => e.status === "Hidden")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className=" card card-slide">
                    <div className="card-body">
                      <div className="progress-widget">
                        <Circularprogressbar
                          stroke={props.cololrinfomode}
                          width="60px"
                          height="60px"
                          trailstroke="#ddd"
                          strokewidth="4px"
                          Linecap="rounded"
                          style={{ width: 60, height: 60 }}
                          value={
                            (posts.filter((e) => e.status === "Public").length /
                              posts.length) *
                            100
                          }
                          id="circle-progress-04"
                        >
                          {Math.round(
                            (posts.filter((e) => e.status === "Public").length /
                              posts.length) *
                              100
                          )}
                          %
                        </Circularprogressbar>
                        <div className="progress-detail">
                          <p className="mb-2">Đã được đăng</p>
                          <h4 className="counter">
                            <CountUp
                              start={0}
                              end={
                                posts.filter((e) => e.status === "Public")
                                  .length
                              }
                              duration={3}
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <div className="swiper-button swiper-button-next"></div>
                  <div className="swiper-button swiper-button-prev"></div>
                </Swiper>
              </div>
            </Row>
          </Col>
        </Row>
      )}
      {(user_info.role.roleId === 4 || user_info.role.roleId === 5) && (
        <Row>
          <Row>
            <Col md="12" lg="12">
              <Row className="row-cols-1">
                <div className="overflow-hidden d-slider1 ">
                  <Swiper
                    className="p-0 m-0 mb-2 list-inline "
                    slidesPerView={6}
                    spaceBetween={32}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      550: { slidesPerView: 2 },
                      991: { slidesPerView: 3 },
                      1400: { slidesPerView: 4 },
                      1500: { slidesPerView: 5 },
                      1920: { slidesPerView: 6 },
                      2040: { slidesPerView: 7 },
                      2440: { slidesPerView: 8 },
                    }}
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    <SwiperSlide className="card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke={props.colorprimarymode}
                            width="60px"
                            height="60px"
                            Linecap="rounded"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            style={{ width: 60, height: 60 }}
                            value={100}
                            id="circle-progress-01"
                          >
                            100%
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Tất cả công việc</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={allTasks.length}
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className=" card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke={props.cololrinfomode}
                            width="60px"
                            height="60px"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            Linecap="rounded"
                            style={{ width: 60, height: 60 }}
                            value={
                              (allTasks.filter((e) => e.status === "New")
                                .length /
                                allTasks.length) *
                              100
                            }
                            id="circle-progress-02"
                          >
                            {Math.round(
                              (allTasks.filter((e) => e.status === "New")
                                .length /
                                allTasks.length) *
                                100
                            )}
                            %
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Công việc mới</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={
                                  allTasks.filter((e) => e.status === "New")
                                    .length
                                }
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className=" card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke={props.colorprimarymode}
                            width="60px"
                            height="60px"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            Linecap="rounded"
                            style={{ width: 60, height: 60 }}
                            value={
                              (allTasks.filter((e) => e.status === "Pending")
                                .length /
                                allTasks.length) *
                              100
                            }
                            id="circle-progress-03"
                          >
                            {Math.round(
                              (allTasks.filter((e) => e.status === "Pending")
                                .length /
                                allTasks.length) *
                                100
                            )}
                            %
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Đang làm</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={
                                  allTasks.filter((e) => e.status === "Pending")
                                    .length
                                }
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className=" card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke={props.cololrinfomode}
                            width="60px"
                            height="60px"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            Linecap="rounded"
                            style={{ width: 60, height: 60 }}
                            value={
                              (allTasks.filter((e) => e.status === "Review")
                                .length /
                                allTasks.length) *
                              100
                            }
                            id="circle-progress-04"
                          >
                            {Math.round(
                              (allTasks.filter((e) => e.status === "Review")
                                .length /
                                allTasks.length) *
                                100
                            )}
                            %
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Đang xem xét</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={
                                  allTasks.filter((e) => e.status === "Review")
                                    .length
                                }
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className=" card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke="green"
                            width="60px"
                            height="60px"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            Linecap="rounded"
                            style={{ width: 60, height: 60 }}
                            value={
                              (allTasks.filter((e) => e.status === "Finish")
                                .length /
                                allTasks.length) *
                              100
                            }
                            id="circle-progress-05"
                          >
                            {Math.round(
                              (allTasks.filter((e) => e.status === "Finish")
                                .length /
                                allTasks.length) *
                                100
                            )}
                            %
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Đã hoàn thành</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={
                                  allTasks.filter((e) => e.status === "Finish")
                                    .length
                                }
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className=" card card-slide">
                      <div className="card-body">
                        <div className="progress-widget">
                          <Circularprogressbar
                            stroke="red"
                            width="60px"
                            height="60px"
                            trailstroke="#ddd"
                            strokewidth="4px"
                            Linecap="rounded"
                            style={{ width: 60, height: 60 }}
                            value={
                              (allTasks.filter((e) => e.status === "UnFinished")
                                .length /
                                allTasks.length) *
                              100
                            }
                            id="circle-progress-05"
                          >
                            {Math.round(
                              (allTasks.filter((e) => e.status === "UnFinished")
                                .length /
                                allTasks.length) *
                                100
                            )}
                            %
                          </Circularprogressbar>
                          <div className="progress-detail">
                            <p className="mb-2">Không hoàn thành</p>
                            <h4 className="counter">
                              <CountUp
                                start={0}
                                end={
                                  allTasks.filter(
                                    (e) => e.status === "UnFinished"
                                  ).length
                                }
                                duration={3}
                              />
                            </h4>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <div className="swiper-button swiper-button-next"></div>
                    <div className="swiper-button swiper-button-prev"></div>
                  </Swiper>
                </div>
              </Row>
            </Col>
            {editors.map((editor) => (
              <Col md="12" xl="6">
                <div className="card" data-aos="fade-up" data-aos-delay="900">
                  <div className="flex-wrap card-header d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">
                        {editor.accountInfo.username}
                      </h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="flex-wrap d-flex align-items-center justify-content-between">
                      <Chart
                        className="col-md-8 col-lg-8"
                        options={chart2.options}
                        series={[
                          Math.round(
                            (allTasks.filter(
                              (task) =>
                                task.editorId === editor.accountId &&
                                task.status === "Finish"
                            ).length /
                              allTasks.filter(
                                (task) => task.editorId === editor.accountId
                              ).length) *
                              100
                          ),
                          Math.round(
                            (allTasks.filter(
                              (task) =>
                                task.editorId === editor.accountId &&
                                task.status === "UnFinished"
                            ).length /
                              allTasks.filter(
                                (task) => task.editorId === editor.accountId
                              ).length) *
                              100
                          ),
                        ]}
                        type="radialBar"
                        height="250"
                      />
                      <div className="d-grid gap col-md-4 col-lg-4">
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="#3a57e8"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="#3a57e8"
                              ></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-secondary">
                              Công việc đã hoàn thành
                            </span>
                            <h6>
                              {
                                allTasks.filter(
                                  (task) =>
                                    task.editorId === editor.accountId &&
                                    task.status === "Finish"
                                ).length
                              }
                            </h6>
                          </div>
                        </div>
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="red"
                          >
                            <g>
                              <circle cx="12" cy="12" r="8" fill="red"></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-secondary">
                              Công việc chưa hoàn thành
                            </span>
                            <h6>
                              {
                                allTasks.filter(
                                  (task) =>
                                    task.editorId === editor.accountId &&
                                    task.status === "UnFinished"
                                ).length
                              }
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Row>
      )}
      {/* {user_info.role.roleId === 5 && <Row>Thống kê</Row>} */}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
