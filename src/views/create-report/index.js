/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import categoryApi from "../../api/categoryApi";
import useLocationForm from "./useLocationForm";
import { toast } from "react-toastify";
import Select from "react-select";
import { Input } from "@material-ui/core";
import moment from "moment";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../firebase/firebaseConfig";
import "quill/dist/quill.snow.css";
import reportApi from "../../api/reportApi";
import { DatetimePickerTrigger } from "rc-datetime-picker";

const CreateReport = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const [address, setAddress] = useState("");
  const [text, setText] = useState("");
  const [categories, setCategories] = useState([]);
  const [_categories, _setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [img, setImg] = useState([]);
  const [video, setVideo] = useState([]);
  const [imgNumber, setImgNumber] = useState(0);
  const [videoNumber, setVideonumber] = useState(0);
  const [imgUrl, setImgUrl] = useState([]);
  const [videoUrl, setVideoUrl] = useState([]);
  const [preview, setPreview] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [time, setTime] = useState(moment());
  const { state, onCitySelect, onDistrictSelect, onWardSelect } =
    useLocationForm(false);
  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;
  const shortcuts = {
    Today: moment(),
    Yesterday: moment().subtract(1, "days"),
    Clear: "",
  };
  // Text box
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link"],
      ["image"],
      ["video"], // remove formatting button
    ],
  };
  const loadCategory = async () => {
    try {
      const params = {};
      const response = await categoryApi.getAllSub(params);
      categories.push({ value: 1, label: "Khác" });
      response.map((item) =>
        categories.push({ value: item.categoryId, label: item.subCategory })
      );
      _setCategories(categories);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handle_submit = async () => {
    try {
      const params = {
        userID: user_info.accountId,
        staffID: user_info.accountId,
        categoryId: selectedCategory.value,
        location:
          address +
          (state.selectedCity !== null
            ? ", " +
              state.selectedCity.label +
              ", " +
              state.selectedDistrict.label +
              ", " +
              state.selectedWard.label
            : ""),
        timeFraud: moment(time).format("YYYY-MM-DD HH:mm:ss"),
        description: text,
        video:
          videoUrl.length !== 0 ? videoUrl.map((url) => url.url) : ["null"],
        image: imgUrl.length !== 0 ? imgUrl.map((url) => url.url) : ["null"],
        isAnonymous: false,
      };
      const response = await reportApi.send(params);
      if (response.statusCode === 200) {
        if (user_info !== null) {
          toast.success("Tạo báo cáo thành công");
        }
        setCategories([]);
        setVideo([]);
        setImg([]);
        setAddress("");
        setTime(moment());
        setImgUrl([]);
        setVideoUrl([]);
        setCategories([]);
        setSelectedCategory();
        _setCategories([]);
        setImgNumber(0);
        setVideonumber(0);
        setSelectedFile([]);
        setText("");
        window.location.reload();
      } else {
        toast.error("Gửi thất bại");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handle_address = (event) => {
    setAddress(event.target.value);
  };
  const handleEditor = (editor) => {
    setText(editor);
  };
  const handleMoment = (moment) => {
    setTime(moment);
  };
  const onSelectFile = async (e) => {
    console.log("second");
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile([]);
      return;
    }
    setSelectedFile(e.target.files);
    const file = e.target.files;
    if (
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "avif" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "jpg" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "jpeg" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "jfif" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "pjpeg" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "pjp" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "png" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "raw" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "tiff" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "psd" ||
      file[file.length - 1].name.substring(
        file[file.length - 1].name.lastIndexOf(".") + 1
      ) === "webp"
    ) {
      setImg([...img, file[file.length - 1]]);
    } else {
      setVideo([...video, file[file.length - 1]]);
    }
  };
  useEffect(() => {
    if (img.length > imgNumber) {
      Array.from(img).map((img) => {
        const storageRef = ref(storage, `/img/${img.name}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            //
          },
          (err) => console.log(err),
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              const filtered = imgUrl.filter((url) => img.name !== url.name);
              setImgUrl([...filtered, { name: img.name, url: url }]);
              setImgNumber(imgNumber + 1);
            });
          }
        );
      });
    }
    if (video.length > videoNumber) {
      Array.from(video).map((video) => {
        const storageRef = ref(storage, `/video/${video.name}`);
        const uploadTask = uploadBytesResumable(storageRef, video);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            //
          },
          (err) => console.log(err),
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              const filtered = videoUrl.filter(
                (url) => video.name !== url.name
              );
              setVideoUrl([...filtered, { name: video.name, url: url }]);
              setVideonumber(videoNumber + 1);
            });
          }
        );
      });
    }
  }, [videoUrl, imgUrl, video, img]);
  useEffect(() => {
    if (selectedFile.length === 0) {
      setPreview([]);
      return;
    }
    Array.from(selectedFile).map((file) => {
      const objectUrl = URL.createObjectURL(file);
      console.log(preview);
      if (!JSON.stringify(preview).includes(file.name)) {
        preview.push({
          type: file.type.includes("image") ? "image" : "video",
          location: objectUrl,
          name: file.name,
        });
      }
    });
  }, [selectedFile]);
  useEffect(() => {
    if (!(_categories.length > 0)) {
      setCategories([]);
      loadCategory();
    }
  });
  return (
    <div>
      <Row>
        <Col sm="12" lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between bg-primary ml-5 mr-5 mb-4 pb-2">
              <h4 className="card-title" style={{ color: "#fff" }}>
                Tạo báo cáo
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md="2">
                  Vị trí:<span className="text-danger">*</span>
                </Col>
                <Col md="10">
                  <Row>
                    <Col md="3">
                      <Input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => handle_address(e)}
                        placeholder="Vị trí vụ việc..."
                      />
                    </Col>
                    <Col md="3">
                      <Select
                        name="cityId"
                        isDisabled={cityOptions.length === 0}
                        options={cityOptions}
                        onChange={(option) => onCitySelect(option)}
                        placeholder="Tỉnh/Thành"
                        defaultValue={selectedCity}
                      />
                    </Col>
                    <Col md="3">
                      <Select
                        name="districtId"
                        isDisabled={districtOptions.length === 0}
                        options={districtOptions}
                        onChange={(option) => onDistrictSelect(option)}
                        placeholder="Quận/Huyện"
                        defaultValue={selectedDistrict}
                      />
                    </Col>
                    <Col md="3">
                      <Select
                        name="wardId"
                        isDisabled={wardOptions.length === 0}
                        options={wardOptions}
                        placeholder="Phường/Xã"
                        onChange={(option) => onWardSelect(option)}
                        defaultValue={selectedWard}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md="2">
                  Thời điểm: <span className="text-danger">*</span>
                </Col>
                <Col md="10">
                  <DatetimePickerTrigger
                    shortcuts={shortcuts}
                    moment={time}
                    onChange={handleMoment}
                    maxDate={moment()}
                  >
                    <Row>
                      <Col md="3">
                        <input
                          className="pt-1 pb-1"
                          type="text"
                          value={time.format("YYYY-MM-DD HH:mm")}
                          readOnly
                        />
                      </Col>
                      <Col md="1">
                        <i className="fa fa-calendar p-2 ml-2 border" />
                      </Col>
                    </Row>
                  </DatetimePickerTrigger>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md="2">
                  Chọn phân loại:<span className="text-danger">*</span>
                </Col>
                <Col md="10">
                  <div className="row pl-3">
                    <Select
                      name="category"
                      isDisabled={_categories.length === null}
                      options={_categories}
                      onChange={(option) => setSelectedCategory(option)}
                      placeholder="Chọn phân loại"
                      defaultValue={selectedCategory}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-3 form-group">
                <Col md="2">
                  <Form.Label className="custom-file-input">
                    Chọn file:
                  </Form.Label>
                </Col>
                <Col md="10">
                  <Form.Control
                    type="file"
                    id="file"
                    multiple
                    accept="image/*, video/*"
                    onChange={(e) => onSelectFile(e)}
                  />
                </Col>
              </Row>
              <Row>
                {preview.length !== 0 &&
                  img.length !== 0 &&
                  preview

                    .slice(0, 5)
                    .filter((img) => img.type === "image")
                    .map((img) => (
                      <Col md="3">
                        <img
                          width="100%"
                          length="100%"
                          src={img.location}
                          alt="img"
                        />
                      </Col>
                    ))}
                {img.length > 5 && (
                  <FormGroup row>
                    <img
                      width="100"
                      length="100"
                      alt="3dot"
                      src="https://media.istockphoto.com/vectors/typing-text-chat-isolated-vector-icon-modern-geometric-illustration-vector-id1186972006?k=20&m=1186972006&s=612x612&w=0&h=vFGrVHgdRGWyUlDcW5KPfAXy5sfcjLg5Cl231ZF78hM="
                    />
                  </FormGroup>
                )}
              </Row>
              <Row>
                {preview.length !== 0 &&
                  video.length !== 0 &&
                  preview
                    .slice(0, 5)
                    .filter((video) => video.type === "video")
                    .map((video) => (
                      <label for="videos">
                        <video
                          width="350"
                          height="150"
                          style={{
                            height: "200px",
                            objectFit: "contain",
                            paddingLeft: "1.5rem",
                          }}
                          autoPlay
                          controls
                          loop
                        >
                          <source src={video.location} />
                        </video>
                      </label>
                    ))}
                {video.length > 5 && (
                  <Row>
                    <img
                      alt="3dot"
                      src="https://media.istockphoto.com/vectors/typing-text-chat-isolated-vector-icon-modern-geometric-illustration-vector-id1186972006?k=20&m=1186972006&s=612x612&w=0&h=vFGrVHgdRGWyUlDcW5KPfAXy5sfcjLg5Cl231ZF78hM="
                    />
                  </Row>
                )}
              </Row>
              <Row className="pt-4 mb-4">
                <ReactQuill
                  value={text}
                  placeholder="Chi tiết báo cáo"
                  onChange={handleEditor}
                  modules={modules}
                  style={{
                    height: "25rem",
                    marginBottom:
                      window.innerWidth < 505
                        ? "7rem"
                        : 505 < window.innerWidth && window.innerWidth < 650
                        ? "6rem"
                        : 650 < window.innerWidth && window.innerWidth < 1250
                        ? "4rem"
                        : "2rem",
                  }}
                />
              </Row>
              <FormGroup inline>
                <Button
                  style={{
                    background: "linear-gradient(to right,#56CCF2,#2F80ED)",
                    color: "white",
                    marginTop: "2rem",
                  }}
                  onClick={() => handle_submit()}
                >
                  <b>Tạo báo cáo</b>
                </Button>
              </FormGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateReport;
