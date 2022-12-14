import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
//img
import topHeader from "../../../../assets/images/dashboard/top-header.png";
import topHeader1 from "../../../../assets/images/dashboard/top-header1.png";
import topHeader2 from "../../../../assets/images/dashboard/top-header2.png";
import topHeader3 from "../../../../assets/images/dashboard/top-header3.png";
import topHeader4 from "../../../../assets/images/dashboard/top-header4.png";
import topHeader5 from "../../../../assets/images/dashboard/top-header5.png";

// store
import {
  NavbarstyleAction,
  getDirMode,
  SchemeDirAction,
  getNavbarStyleMode,
  getSidebarActiveMode,
  SidebarActiveStyleAction,
  getDarkMode,
  ModeAction,
  SidebarColorAction,
  getSidebarColorMode,
  getSidebarTypeMode,
} from "../../../../store/setting/setting";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    darkMode: getDarkMode(state),
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
    },
    dispatch
  ),
});

const SubHeader = (props) => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  useEffect(() => {
    // navbarstylemode
    const navbarstyleMode = sessionStorage.getItem("Navbarstyle-mode");
    props.NavbarstyleAction(navbarstyleMode);
  });
  return (
    <>
      <div className="iq-navbar-header" style={{ height: "185px" }}>
        <Container fluid className="iq-container">
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between flex-wrap">
                <div style={{ padding: "2rem" }}>
                  <h2>
                    Ch??o,{" "}
                    {user_info && user_info.role.roleId === 2 && "nh??n vi??n"}
                    {user_info &&
                      user_info.role.roleId === 3 &&
                      "bi??n t???p vi??n"}
                    {user_info &&
                      user_info.role.roleId === 4 &&
                      "qu???n l?? bi??n t???p vi??n"}
                    {user_info &&
                      user_info.role.roleId === 5 &&
                      "qu???n tr??? vi??n"}
                    .
                  </h2>
                  {user_info && user_info.role.roleId === 2 && (
                    <p>
                      Nh??n vi??n c?? th??? t???o b??o c??o v?? x??? l?? c??c b??o c??o ???????c g???i
                      t???i t??? ng?????i d??n.
                    </p>
                  )}
                  {user_info && user_info.role.roleId === 3 && (
                    <p>
                      Bi??n t???p vi??n c?? th??? xem c??ng vi???c ???????c ph??n c??ng, vi???t
                      b??i v?? xem c??c b??i vi???t c???a b???n th??n.
                    </p>
                  )}
                  {user_info && user_info.role.roleId === 4 && (
                    <p>
                      Qu???n l?? bi??n t???p vi??n c?? th??? qu???n l?? c??c bi??n t???p vi??n,
                      danh m???c, ph??n c??ng vi???c, quan s??t ti???n ????? l??m vi???c v??
                      ????ng / g??? b??i vi???t.
                    </p>
                  )}
                  {user_info && user_info.role.roleId === 5 && (
                    <p>Qu???n tr??? vi??n c?? th??? qu???n l?? ng?????i d??ng.</p>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-link btn-soft-light"
                  >
                    <i class="fa fa-solid fa-chart-line"></i> Xem th???ng k??
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        {/* {{!-- rounded-bottom if not using animation --}} */}
        <div className="iq-header-img">
          <img
            src={topHeader}
            alt="header"
            className="theme-color-default-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader1}
            alt="header"
            className=" theme-color-purple-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader2}
            alt="header"
            className="theme-color-blue-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader3}
            alt="header"
            className="theme-color-green-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader4}
            alt="header"
            className="theme-color-yellow-img img-fluid w-100 h-100 animated-scaleX"
          />
          <img
            src={topHeader5}
            alt="header"
            className="theme-color-pink-img img-fluid w-100 h-100 animated-scaleX"
          />
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SubHeader);
