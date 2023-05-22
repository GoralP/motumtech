import React, { useState } from "react";
import {
  Row,
  DatePicker,
  TimePicker,
  Col,
  Input,
  Modal,
  Radio,
  Button,
  Upload,
  message,
  Icon,
  Form,
  Card,
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { baseURL, branchName } from "./../../../../util/config";
import { PDFtoIMG } from "react-pdf-to-image";
import { Document, Page, pdfjs } from "react-pdf";

import {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
} from "./../../../../appRedux/actions/AlldocumentsActions";
import { close_bulksignature_modal } from "./../../../../appRedux/actions/IdentitiesActions";
import IntlMessages from "util/IntlMessages";
import { FormattedMessage, injectIntl } from "react-intl";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";

let userId = "";
let langName = "";
var SelectedList_content = "";
let newSignPos = [];
let signPageNumber;
var newinitialRectangles = [];

const url =
  "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseDownEvent,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onMouseDown={onMouseDownEvent}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end

          const node = shapeRef.current;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            // console.log(oldBox);
            // console.log(newBox);
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

class URLImage extends React.Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);

    // console.log("image src----->", this.image.src);
    // console.log("image props----->", this.props.src);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image,
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {
    return (
      <Image
        x={0}
        y={0}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
      />
    );
  }
}
const CompleteRectandle = ({
  src,
  selectedDNI,
  onMouseDownMain,
  currentpage,
}) => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);

  const [selectedId, selectShape] = React.useState(null);

  newSignPos = rectangles;

  console.log("current page---->", currentpage);
  console.log("rectangle---->", rectangles);

  const checkDeselect = (e) => {
    console.log("e target--->", e.target);

    console.log("target stage----->", e.target.getStage());
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
    console.log("clickedonEmpty---->", clickedOnEmpty);
  };
  // const setRectangles_new = (rectangle_new, i) => {
  //   initialRectangles[i] = rectangle_new;

  //   // console.log("initialRectangles---->", initialRectangles[i]);
  // };

  // console.log("rect---->", selectedId);
  // console.log("rectangles---->", rectangles);
  return (
    <Stage
      x={0}
      y={0}
      width={850}
      height={1200}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      selectedDNI={selectedDNI}
    >
      <Layer>
        <URLImage src={src} style={{ padding: "0px" }} />
        {rectangles.map((rect, i) =>
          currentpage != undefined && currentpage === rect.page ? (
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onMouseDownEvent={() => {
                onMouseDownMain(i);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
                // newSignPos.push(rects[i]);
                console.log("rrect--->", newSignPos);
              }}
            />
          ) : null
        )}
      </Layer>
    </Stage>
  );
};

var initialRectangles = [];

const PdfToImage = ({
  file,
  src,
  currentpage,
  selectedDIN,
  onMouseDownMain,
  valueSignature,
}) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  signPageNumber = pageNumber;
  console.log("page number--->", pageNumber);

  /*To Prevent right click on screen*/
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  const previousPage = () => {
    var currentpage = pageNumber;
    currentpage = currentpage - 1;
    setPageNumber(currentpage);
    // setPageNumber({ currentpage, selectedDIN: "" });
    // changePage(-1);
  };

  const nextPage = () => {
    var currentpage = pageNumber;
    currentpage = currentpage + 1;
    setPageNumber(currentpage);
    // setPageNumber({ currentpage, selectedDIN: "" });

    // changePage(1);
  };

  const handleClick = (index) => {
    console.log("index---->", index);
  };

  return (
    <>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber}></Page>
      </Document>
      <div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block" }}>
            <Button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="Pre"
            >
              {" "}
              {"<"}{" "}
            </Button>

            <div style={{ display: "inline-block" }}>
              <div>
                &nbsp;
                <b>
                  {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </b>
                &nbsp; &nbsp;
              </div>
            </div>
            <div style={{ display: "inline-block" }}>
              <Button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                {" "}
                {">"}{" "}
              </Button>
            </div>
          </div>
        </div>
        {numPages != 0 ? (
          <CompleteRectandle
            src={src}
            currentpage={currentpage}
            selectedDNI={selectedDIN}
            onMouseDownMain={onMouseDownMain}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

class BulkSignature extends React.Component {
  get_alldocumentsById(pageNumber = "", visit_id = "") {
    if (
      this.props.status === "Initial" ||
      (pageNumber === "" && visit_id !== "")
    ) {
      this.props.get_alldocuments({ pageNumber: 1, visit_id: visit_id });
    } else {
      this.props.get_alldocuments({
        pageNumber: pageNumber,
        visit_id: visit_id,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
  }
  getRandomColor = () => {
    // var letters = '0123456789ABCDEF';
    var color = "(0,0,0,.2)";
    // for (var i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    return color;
  };
  componentDidUpdate(prevProps) {
    if (this.props.bulksignaturemodalclosecall === 3) {
      this.props.close_bulksignature_modal(1);
      initialRectangles = [];
      this.setState({
        filename: "",
        filuploaded: {},
        uploadfile: "",
        signMode: "",
        sendCopyToParticipant: "",
        emails: "",
        expiryDate: "",
        time: "",
        Odate: "",
        valueSignature: "",
        signType: [],
        originaldate: "",
        originaltime: "",
      });
    }
    if (
      initialRectangles.length === 0 ||
      initialRectangles.length !== this.props.SelectedList.length
    ) {
      if (this.state.signType.length !== 0) {
        this.setState({ valueSignature: "", signType: [] });
      }
      initialRectangles = [];
      this.props.SelectedList.forEach((val, key) => {
        var getnewcolor = this.getRandomColor();
        var new_signature = {
          x: 100,
          y: 100,
          width: 100,
          height: 50,
          strokeWidth: 1,
          stroke: "black",
          // fill: getnewcolor ,
          id: val.id,
        };
        initialRectangles.push(new_signature);
        console.log("new signature--->", new_signature);
      });
    }

    if (initialRectangles.length === this.props.SelectedList.length) {
      var flag = false;
      var init_ids = [];
      initialRectangles.forEach((val_init, key_init) => {
        init_ids.push(val_init.id);
      });
      this.props.SelectedList.forEach((val_select, key_select) => {
        if (!init_ids.includes(val_select.id)) {
          flag = true;
          return false;
        }
      });
      if (flag) {
        if (this.state.signType.length !== 0) {
          this.setState({ valueSignature: "", signType: [] });
        }
        initialRectangles = [];
        this.props.SelectedList.forEach((val, key) => {
          var getnewcolor = this.getRandomColor();
          console.log("test");
          var new_signature = {
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            strokeWidth: 1,
            stroke: "black",
            // fill: getnewcolor ,
            id: val.id,
          };
          initialRectangles.push(new_signature);
        });
      }
    }
    if (!prevProps.open) {
      if (
        prevProps.visit_id !== undefined ||
        prevProps.visit_id !== this.props.visit_id
      ) {
        this.get_alldocumentsById(1, this.props.visit_id);
      }
    }
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.get_alldocumentsById(pagination.current, this.props.visit_id);
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      loading: false,
      uploadfile: "",
      uploadingcomplete: true,
      currentpage: 1,
      filuploaded: {},
      filename: "",
      sendCopyToParticipant: "",
      signMode: false,
      emails: "",
      signType: [],
      Odate: "",
      time: "",
      calldone: "",
      originaltime: "",
      originaldate: "",
    };
  }
  //Handle page change
  handleClick = (index) => {
    console.log(index);
  };
  onChangeSignature = (e) => {
    this.setState({ valueSignature: e.target.value });
    console.log("e.target.value--->", e.target.value);
    initialRectangles.forEach((val, key) => {
      if (val.id === e.target.value) {
        val.page = signPageNumber;
        val.signatureadd = true;
        initialRectangles[key] = val;
      }
    });
    console.log("signature change--->", initialRectangles);
    console.log("sign page number--->", signPageNumber);
  };
  //Downloading Document in pdf file format
  downloadDocumentData = (e) => {
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        userId = userData["id"];
      }
    }

    langName = localStorage.getItem(branchName + "_language");

    var documentData = this.props.getAlldocumentsData.DocumentList.find(
      (singleDocument) => {
        return singleDocument.DocumentID === e.target.value;
      }
    );

    var filename = documentData.DocumentName;
    let authBasic = "";

    authBasic = localStorage.getItem("setAuthToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
      body: JSON.stringify(documentData),
    };
    /*const response = await fetch('https://jsonplaceholder.typicode.com/posts', requestOptions);
      const data = await response.json();*/
    fetch(
      baseURL + "DownloadDocument?licenceId=" + userId + "&lang=" + langName,
      requestOptions
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
      // window.location.href = response.url;
    });
  };
  mousedowneve = (i) => {
    // console.log("intial---->", initialRectangles[i]);
    this.setState((state) => ({
      valueSignature: initialRectangles[i].id,
    }));
  };
  handlePrevious = (e) => {
    var currentpage = this.state.currentpage;
    currentpage = parseInt(currentpage) - 1;
    this.setState({ currentpage, valueSignature: "" });
  };
  handleNext = (e) => {
    var currentpage = this.state.currentpage;
    currentpage = parseInt(currentpage) + 1;
    this.setState({ currentpage, valueSignature: "" });
  };
  handleautoselect = (e, itemid) => {
    var newsignType = this.state.signType;
    newsignType[itemid] = e.target.value;
    this.setState({ signType: newsignType });
  };
  handleBulksignature = () => {
    this.setState({ calldone: true });
    var docParticipants = [];

    // var lastEle = [];
    // addSignPosition.push(newSignPos);
    // const lastEle = newSignPos.slice(-1, newSignPos.length);
    // const lastEle.push(citrus);
    // console.log("last element--->", lastEle);
    // var newinitialRectangles = [];
    console.log("last element --->", newSignPos);
    this.props.SelectedList.forEach((val, key) => {
      docParticipants.push({
        participantId: val.id,
        signType: this.state.signType[val.id],
      });
    });
    newSignPos.forEach((val, key) => {
      if (typeof val["signatureadd"] !== "undefined") {
        newinitialRectangles.push({
          Height: val.height,
          Width: val.width,
          PosX: val.x,
          PosY: val.y,
          PageNo: val.page,
        });
      }
    });
    let userdata = localStorage.getItem(branchName + "_data");
    if (userdata !== "" && userdata !== null) {
      let userData = JSON.parse(userdata);
      if (
        userData !== "" &&
        userData !== null &&
        userData["id"] !== undefined
      ) {
        userId = userData["id"];
      }
    }
    var submitBulkFormData = {
      docTemplate: this.state.filename,
      signPosition: newinitialRectangles,
      sendCopyToParticipant: this.state.signMode,
      signMode: this.state.sendCopyToParticipant,
      emails: this.state.emails,
      expiryDate: this.state.Odate + " " + this.state.time,
      docParticipants: docParticipants,
      canvasHeight: 800,
      canvasWidth: 650,
      licenseId: userId,
    };

    console.log("new sign position--->", newinitialRectangles);
    // this.state.filename
    const bulkSignatureDataForm = new FormData();
    bulkSignatureDataForm.append(
      "SignatureDetail",
      JSON.stringify(submitBulkFormData)
    );
    if (Object.entries(this.state.filuploaded).length !== 0) {
      bulkSignatureDataForm.append("docTemplate", this.state.filuploaded);
    } else {
      message.destroy();
      message.config({
        maxCount: 1,
      });
      message.error(
        this.props.intl.formatMessage({ id: "global.UploadRequired" })
      );
      // calldone = false;
      this.setState({ calldone: false });
      return false;
    }

    if (this.state.Odate === "" || this.state.time === "") {
      message.destroy();
      message.config({
        maxCount: 1,
      });
      message.error(
        this.props.intl.formatMessage({ id: "bulkSignature.ExpiryDate" })
      );
      // calldone = false;
      this.setState({ calldone: false });
      return false;
    }
    // if (this.props.SelectedList.length !== newSignPos.length) {
    //   message.destroy();
    //   message.config({
    //     maxCount: 1,
    //   });
    //   message.error(
    //     this.props.intl.formatMessage({ id: "bulkSignature.AllSignature" })
    //   );
    //   // calldone = false;
    //   this.setState({ calldone: false });
    //   return false;
    // }
    if (
      this.props.SelectedList.length !== Object.keys(this.state.signType).length
    ) {
      message.destroy();
      message.config({
        maxCount: 1,
      });
      message.error(
        this.props.intl.formatMessage({ id: "bulkSignature.SignatureMode" })
      );
      // calldone = false;
      this.setState({ calldone: false });
      return false;
    }

    if (this.state.sendCopyToParticipant === "") {
      message.destroy();
      message.config({
        maxCount: 1,
      });
      message.error(
        this.props.intl.formatMessage({ id: "bulkSignature.ExecutionRequired" })
      );
      this.setState({ calldone: false });
      return false;
    }

    let authBasic = "";

    langName = localStorage.getItem(branchName + "_language");

    var submitUrl = baseURL + "IdentityBulkSignature?lang=" + langName;
    authBasic = localStorage.getItem("setAuthToken");

    const requestOptions = {
      method: "POST",
      headers: { Authorization: "Basic " + authBasic },
      mimeType: "multipart/form-data",
      body: bulkSignatureDataForm,
    };
    fetch(submitUrl, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data !== undefined) {
          var parsed_response = data;
          var response_status = parsed_response.status;
          var response_message = parsed_response.message;
          if (response_status) {
            message.destroy();
            message.config({
              maxCount: 1,
            });
            message.success(response_message);
            this.props.close_bulksignature_modal(1);
            // this.props.form.resetFields()
            // calldone = false;
            this.setState({ calldone: false });
            newinitialRectangles = [];
            initialRectangles = [];
            docParticipants = [];
            this.setState({
              filename: "",
              filuploaded: {},
              uploadfile: "",
              signMode: "",
              sendCopyToParticipant: "",
              emails: "",
              expiryDate: "",
              time: "",
              Odate: "",
              valueSignature: "",
              signType: [],
              originaldate: "",
              originaltime: "",
            });
          } else {
            message.destroy();
            message.config({
              maxCount: 1,
            });
            message.error(response_message);
            this.setState({ calldone: false });
          }
        } else {
          message.destroy();
          message.config({
            maxCount: 1,
          });
          message.error(
            this.props.intl.formatMessage({ id: "global.TryAgain" })
          );
          this.setState({ calldone: false });
        }
      })
      .catch((error) => {
        message.destroy();
        message.config({
          maxCount: 1,
        });
        message.error(this.props.intl.formatMessage({ id: "global.TryAgain" }));
        this.setState({ calldone: false });
      });
  };
  SendCopyToSigner = (e) => {
    this.setState({ signMode: e.target.value });
  };
  SignatureExecutionMode = (e) => {
    this.setState({ sendCopyToParticipant: e.target.value });
  };
  handleemails = (e) => {
    this.setState({ emails: e.target.value });
  };
  getDate = (date, dateString) => {
    this.setState({ originaldate: dateString });
    // var starting_date = dateString;
    var date_start = new Date(date);
    var s_date =
      date_start.getDate() > 9
        ? date_start.getDate()
        : "0" + date_start.getDate();
    var s_month =
      date_start.getMonth() + 1 > 9
        ? date_start.getMonth() + 1
        : "0" + (parseInt(date_start.getMonth()) + 1);
    var s_year = date_start.getFullYear();
    var Sdate = s_date + "/" + s_month + "/" + s_year;
    this.setState({ Odate: Sdate });
  };
  disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  timechangehandle = (e, timeString) => {
    this.setState({ originaltime: timeString });
    this.setState({ time: timeString });
  };

  render() {
    if (!this.state.uploadingcomplete) {
      setTimeout(
        function () {
          this.setState({ uploadingcomplete: true });
        }.bind(this),
        500
      );
    }

    const RadioGroup = Radio.Group;
    const dateFormat = "DD/MM/YYYY";
    const plainOptions = [
      {
        label: <IntlMessages id="bulksignature.optionparallel" />,
        value: "Parallel",
      },
      {
        label: <IntlMessages id="bulksignature.optionsequential" />,
        value: "Sequential",
      },
    ];
    const plainOptions1 = [
      {
        label: <IntlMessages id="bulksignature.optionremote" />,
        value: "Remote",
      },
      { label: <IntlMessages id="bulksignature.optionbio" />, value: "Bio" },
    ];
    const plainOptions2 = [
      { label: <IntlMessages id="bulksignature.optionyes" />, value: true },
      { label: <IntlMessages id="bulksignature.optionno" />, value: false },
    ];

    const { onSignatureClose, open, SelectedList } = this.props;

    const props = {
      beforeUpload: (file) => {
        const isPdf = file.type === "application/pdf";
        if (!isPdf) {
          message.error(
            this.props.intl.formatMessage({ id: "global.UploadPDF" })
          );
        } else {
          var data_url = new Blob([file], { type: "application/pdf" });
          var pdfURL = window.URL.createObjectURL(data_url);

          this.setState((state) => ({
            uploadfile: pdfURL,
            uploadingcomplete: false,
            filuploaded: file,
            filename: file.name,
            status_owner: false,
          }));
        }
        return false;
      },
    };

    var AlldocumentsData = this.props.getAlldocumentsData;
    // var AlldocumentData = '';

    if (!AlldocumentsData) {
      // Object is empty (Would return true in this example)
    } else {
      // Object is NOT empty
      // AlldocumentData = AlldocumentsData.DocumentList;

      const pagination = { ...this.state.pagination };

      pagination.total = AlldocumentsData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;
      if (
        pagination.current !== "" &&
        this.state.pagination.current === undefined
      ) {
        this.setState({
          pagination,
        });
      }
    }
    if (SelectedList.length > 0) {
      SelectedList_content = (
        <Card
          style={{
            width: "100%",
            height: "auto",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "300px",
          }}
        >
          <Radio.Group
            onChange={this.onChangeSignature}
            value={this.state.valueSignature}
          >
            {SelectedList.map((item, i) => {
              var newdiv =
                initialRectangles.length > 0 ? (
                  typeof initialRectangles[i] != "undefined" ? (
                    <div
                      style={{
                        backgroundColor: initialRectangles[i].fill,
                        height: "10px",
                        width: "10px",
                        display: "inline-block",
                      }}
                    ></div>
                  ) : null
                ) : null;
              return (
                <Row style={{ marginBottom: "15px" }}>
                  <Col lg={24}>
                    <Radio value={item.id}>
                      {item.Name} ({item.DNI}) &nbsp;&nbsp; {newdiv}
                    </Radio>
                  </Col>
                  <Col
                    lg={24}
                    style={{ marginLeft: "25px", marginTop: "10px" }}
                  >
                    <Row>
                      <Col lg={9}>
                        <label>
                          {" "}
                          <b>
                            {" "}
                            <IntlMessages id="bulksignature.signatureMode" /> :{" "}
                          </b>{" "}
                        </label>
                      </Col>
                      <Col lg={15}>
                        <RadioGroup
                          options={plainOptions1}
                          onChange={(val) =>
                            this.handleautoselect(val, item.id)
                          }
                          value={this.state.signType[item.id]}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Radio.Group>
        </Card>
      );
    }

    return (
      <Modal
        title={<IntlMessages id="identity.sendbulkSignature" />}
        className="identity_select_modal"
        toggle={onSignatureClose}
        visible={open}
        closable={true}
        width={"1550px"}
        height={"1490.6px"}
        onOk={this.handleBulksignature}
        onCancel={onSignatureClose}
        footer={[
          <Button key="back" type="primary" onClick={this.props.onAddDocuments}>
            <IntlMessages id="button.Previous" />
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleBulksignature}
            loading={this.state.calldone}
          >
            <IntlMessages id="button.Submit" />
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 10 }}>
          <Row>
            <Col lg={10}>
              {SelectedList_content}
              {/* <Form.Item label="Signature Execution Mode" name="SignatureExecutionMode">
                <RadioGroup options={plainOptions}/>  
              </Form.Item> */}
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <Row>
                  <Col lg={11} style={{ paddingRight: "0px" }}>
                    <label>
                      <b>
                        <IntlMessages id="bulksignature.SignatureExecutionMode" />{" "}
                        :{" "}
                      </b>
                    </label>
                  </Col>
                  <Col lg={13}>
                    <RadioGroup
                      options={plainOptions}
                      onChange={this.SignatureExecutionMode}
                      value={this.state.sendCopyToParticipant}
                    />
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <Row>
                  <Col lg={9} style={{ width: "188px" }}>
                    <label>
                      {" "}
                      <b>
                        <IntlMessages id="bulksignature.DocumentExpiry" /> :{" "}
                      </b>
                    </label>
                  </Col>
                  <Col lg={15} style={{ paddingLeft: "0px" }}>
                    <Row>
                      <Col lg={12}>
                        <DatePicker
                          format={dateFormat}
                          style={{ width: "158px" }}
                          disabledDate={this.disabledDate}
                          onChange={this.getDate}
                          value={
                            this.state.originaldate !== ""
                              ? moment(this.state.originaldate, dateFormat)
                              : null
                          }
                        />
                      </Col>
                      <Col lg={8}>
                        <TimePicker
                          format={"hh:00:00 A"}
                          style={{ width: "158px" }}
                          onChange={this.timechangehandle}
                          use12Hours
                          value={
                            this.state.originaltime !== ""
                              ? moment(this.state.originaltime, "hh:00:00 A")
                              : null
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <label>
                  {" "}
                  <b>
                    <IntlMessages id="bulksignature.SendNotification" /> :{" "}
                  </b>
                </label>
                <div>
                  <FormattedMessage id="bulksignature.SendNotification">
                    {(placeholder) => (
                      <Input
                        className="ant-input"
                        onChange={this.handleemails}
                        value={this.state.emails}
                        placeholder={placeholder}
                        margin="none"
                      />
                    )}
                  </FormattedMessage>
                </div>
              </div>
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <Row>
                  <Col lg={11}>
                    <label>
                      <b>
                        <IntlMessages id="bulksignature.SendCopyToSigner" /> :
                      </b>{" "}
                    </label>
                  </Col>
                  <Col lg={13}>
                    <RadioGroup
                      options={plainOptions2}
                      onChange={this.SendCopyToSigner}
                      value={this.state.signMode}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={14}>
              <Form.Item
                label={<IntlMessages id="bulksignature.UploadSignature" />}
                name="upload"
              >
                <Upload {...props} showUploadList={false} multiple={false}>
                  <Button>
                    <Icon type="upload" />{" "}
                    <IntlMessages id="bulksignature.ClicktoUpload" />
                  </Button>
                </Upload>
              </Form.Item>

              {this.state.uploadfile !== "" && this.state.uploadingcomplete ? (
                // <PDFtoIMG file={this.state.uploadfile}>
                //   {({ pages }) => {
                //     if (!pages.length) return "Loading...";
                //     return (
                //       <div>
                //         <div style={{ textAlign: "center" }}>
                //           <div style={{ display: "inline-block" }}>
                //             {this.state.currentpage === 1 ? null : (
                //               <Button
                //                 style={{ marginBottom: "0px" }}
                //                 onClick={this.handlePrevious}
                //               >
                //                 {" "}
                //                 {"<"}{" "}
                //               </Button>
                //             )}
                //           </div>
                //           <div style={{ display: "inline-block" }}>
                //             <div>
                //               &nbsp; &nbsp;
                //               <b>
                //                 {this.state.currentpage} / {pages.length}
                //               </b>
                //               &nbsp; &nbsp;
                //             </div>
                //           </div>
                //           <div style={{ display: "inline-block" }}>
                //             {this.state.currentpage === pages.length ? null : (
                //               <Button
                //                 style={{ marginBottom: "0px" }}
                //                 onClick={this.handleNext}
                //               >
                //                 {" "}
                //                 {">"}{" "}
                //               </Button>
                //             )}
                //           </div>
                //         </div>
                //         {pages.map((page, index) => (
                //           <div onClick={this.handleClick(index)}>
                //             {index === parseInt(this.state.currentpage) - 1 ? (
                //               <CompleteRectandle
                //                 src={page}
                //                 currentpage={this.state.currentpage}
                //                 selectedDIN={this.state.valueSignature}
                //                 onMouseDownMain={this.mousedowneve}
                //               />
                //             ) : null}
                //           </div>
                //         ))}
                //       </div>
                //     );
                //   }}
                // </PDFtoIMG>

                <PdfToImage
                  // src={this.state.uploadfile}
                  file={this.state.uploadfile}
                  currentpage={signPageNumber}
                  selectedDIN={this.state.valueSignature}
                  onMouseDownMain={this.mousedowneve}
                />
              ) : null}
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
  close_bulksignature_modal,
};

const mapStateToProps = (state) => {
  return {
    getAlldocumentsData: state.alldocumentsReducers.get_alldocuments_res,
    loader: state.alldocumentsReducers.loader,
    showSuccessMessage: state.alldocumentsReducers.showSuccessMessage,
    successMessage: state.alldocumentsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.alldocumentsReducers.showMessage,
    alertMessage: state.alldocumentsReducers.alertMessage,
    status: state.alldocumentsReducers.status,
    bulksignaturemodalclosecall:
      state.identitiesReducers.bulksignaturemodalclosecall,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BulkSignature));
