//router
import IndexRouters from "./router/index";

//scss
import "./assets/scss/hope-ui.scss";
import "./assets/scss/dark.scss";
import "./assets/scss/rtl.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/customizer.scss";
// import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={10000} />
      <IndexRouters />
    </div>
  );
}

export default App;
