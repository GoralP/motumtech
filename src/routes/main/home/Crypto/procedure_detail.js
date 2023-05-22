import React, { Component } from "react";
import {
  Divider,
  Table,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  message,
  Form,
  Modal,
  Select,
} from "antd";
import { connect } from "react-redux";
import IntlMessages from "util/IntlMessages";
import axios from "axios";
import {
  getDetailProcedure,
  setStatusToStarting,
  submitGiaLink,
  relaunchData,
  getExportData,
} from "../../../../appRedux/actions/BusinessProceduresActions.js";
import CircularProgress from "./../../../../components/CircularProgress/index";
import { FormattedMessage } from "react-intl";
import CKEditor from "react-ckeditor-component";
import moment from "moment";
import { webURL, branchName, baseURL } from "./../../../../util/config";
import { isArray } from "util";

let userId = "";
let permitAdd = "";
let permitEdit = "";
let permitDelete = "";
let licenseId = "";
let procedureId = "";

// let countData = "";

const FormItem = Form.Item;
const { Search } = Input;
const Option = Select.Option;
var searchDetailProcedure = "";
var filterTag = "ALL";

class ProcedureDetail extends Component {
  constructor() {
    filterTag = "ALL";
    super();
    this.state = {
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
      },
      openDetailViewModel: false,
      detailViewData: [],
      passInstructionData: [],
      backProcedureData: [],
      columnTitle: "",
      signerViewData: [],
      openSignerDetailModel: false,
      procedure_type: "",
      processType: "",
      process_name: "",
      sendMail: "",
      filterTag: "ALL",
    };
  }

  getDetailProcedureById(
    pageNumber = "",
    perPage = "10",
    searchDetailProcedure = "",
    filterTag = "ALL"
  ) {
    if (this.props.location.state) {
      procedureId = this.props.location.state.passProcedureDetailData.Id;
      if (this.props.status === "Initial") {
        this.props.getDetailProcedure({
          ProcedureId: procedureId,
          pageNumber: 1,
          perPage: perPage,
          searchDetailProcedure: searchDetailProcedure,
          filterTag: filterTag,
        });
      } else {
        if (pageNumber === "") {
          pageNumber = 1;
        }
        if (perPage === "") {
          perPage = "10";
        }
        this.props.getDetailProcedure({
          ProcedureId: procedureId,
          pageNumber: pageNumber,
          perPage: perPage,
          searchDetailProcedure: searchDetailProcedure,
          filterTag: filterTag,
        });
      }
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      const procedureDataArray =
        this.props.location.state.passProcedureDetailData;
      // countData = this.props.location.state.passCountData;

      // console.log("counter data test---->", countData);
      // console.log("procedure---->", procedureDataArray);
      if (procedureDataArray.length !== 0) {
        this.setState({ procedureName: procedureDataArray.Name });
        this.setState({ procedure_type: procedureDataArray.Type });
        this.setState({ sendMail: procedureDataArray.SentMailBy });

        this.setState({
          process_name: procedureDataArray.ProcessConfig.ProcessType,
        });
      }

      // console.log("procedureDataArray----->", procedureDataArray);

      let userdata = localStorage.getItem(branchName + "_data");
      if (userdata !== "" && userdata !== null) {
        let userData = JSON.parse(userdata);
        let permit_add =
          userData.Permission.BusinessProcedure.BusinessProcedure_Add;
        let permit_edit =
          userData.Permission.BusinessProcedure.BusinessProcedure_Edit;
        let permit_delete =
          userData.Permission.BusinessProcedure.BusinessProcedure_Delete;
        if (
          userData !== "" &&
          userData !== null &&
          userData["id"] !== undefined &&
          permit_add !== undefined &&
          permit_edit !== undefined &&
          permit_delete !== undefined
        ) {
          licenseId = userData["id"];
          permitAdd = permit_add;
          permitEdit = permit_edit;
          permitDelete = permit_delete;
        }
      }
      this.props.setStatusToStarting();
      this.getDetailProcedureById();
    } else {
      this.props.history.push({
        pathname: "/" + webURL + "main/home/procedure",
      });
    }
    // this.props.relaunchData();
    // this.props.submitGiaLink({
    //   LicenseId: 4,
    //   WorkInstructionId: 1273,
    //   DocPath:
    //     "https://www.motumlabs.com/Motum/Common/4/SignedDoc/c57a41a3-6662-424f-9242-88124aedc1e0_TEST-Verificacio Activitat_signed.pdf",
    // });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });

    this.getDetailProcedureById(
      pagination.current,
      pagination.pageSize,
      searchDetailProcedure
    );
  };

  handleCountSearch = (e) => {
    var status_value = e.target.value;
    console.log("value---->", e.target.value);

    filterTag = status_value;

    var pagesize = this.state.pagination.pageSize;

    this.getDetailProcedureById("", pagesize, searchDetailProcedure, filterTag);
  };

  handleExport = () => {
    console.log("procedure id--->", filterTag);
    // this.props.getExportData({
    //   ProcedureId: procedureId,
    //   FilterTag: filterTag,
    //   SearchTerm: searchDetailProcedure,
    // });
    let authBasic = "";
    let langName = "";
    authBasic = localStorage.getItem("setAuthToken");
    langName = localStorage.getItem(branchName + "_language");
    axios
      .get(
        baseURL +
          "ExportWorkInstrucionData?BusinessProcedureId=" +
          procedureId +
          "&FilterTag=" +
          filterTag +
          "&SearchTerm=" +
          searchDetailProcedure +
          "&lang=" +
          langName,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + authBasic,
          },
        }
      )
      .then((response) => {
        let fileName = response.data.data;
        const w = window.open(fileName, "_blank");
        // let url = window.URL.createObjectURL(w);
        let a = document.createElement("a");
        a.href = a;

        // a.click();

        // if (this.props.getDetailProcedureData.TotalCount === 0) {
        //   message.error(this.props.intl.formatMessage({ id: "global.NoData" }));
        // } else {
        //   fetch(fileName)
        //     .then((response) => response.blob())
        //     .then((myBlob) => {
        //       console.log("my blob--->", myBlob);
        //       let url = window.URL.createObjectURL(myBlob);
        //       let a = document.createElement("a");
        //       a.href = url;
        //       a.download = "test" + ".csv";

        //       a.click();
        //     });

        //   // response.blob().then((blob) => {
        //   //   console.log("api response--->", blob);
        //   //   let url = window.URL.createObjectURL(blob);

        //   //   let a = document.createElement("a");
        //   //   a.href = url;
        //   //   a.download = "test" + ".csv";
        //   //   a.click();
        //   // });
        // }
      });
  };

  handleChangeDetailSearch = (e) => {
    var tempSearchedDetail = e.target.value;
    this.setState({ searchedDetail: tempSearchedDetail });
  };

  handleDetailSearch = (value) => {
    searchDetailProcedure = value;
    var pagesize = this.state.pagination.pageSize;
    this.getDetailProcedureById("", pagesize, searchDetailProcedure);
  };

  handleViewDetailInfo = (record, columnName) => {
    var recordArr = [];
    if (record.length === undefined) {
      recordArr = this.state.detailViewData;
      recordArr.push(record);
    } else {
      recordArr = record;
    }
    this.setState({ columnTitle: columnName });
    this.setState({ detailViewData: recordArr });
    this.setState({ openDetailViewModel: true });
  };

  closeViewDetailInfo = () => {
    this.setState({ detailViewData: [] });
    this.setState({ openDetailViewModel: false });
  };
  handleViewSignerDetail = (id) => {
    var workInstructionData =
      this.props.getDetailProcedureData.WorkInstructionList.find(
        (singleDataCapture) => {
          return singleDataCapture.Id === id;
        }
      );
    this.setState({
      signerViewData: workInstructionData.InspectionDocument.Signers,
    });
    this.setState({ openSignerDetailModel: true });
  };

  closeViewSignerDetail = () => {
    this.setState({ signerViewData: [] });
    this.setState({ openSignerDetailModel: false });
  };

  viewWorkInstructionDetail = (p_id) => {
    console.log("hello id--->", p_id);
    var workInstructionData =
      this.props.getDetailProcedureData.WorkInstructionList.find(
        (singleDataCapture) => {
          return singleDataCapture.Id === p_id;
        }
      );

    // console.log("prrrr id--->", p_id);

    console.log("work instruction---->", workInstructionData);

    this.props.history.push({
      pathname: "/" + webURL + "main/home/inspection-detail",
      state: {
        passInstructionData: workInstructionData,
        processType: this.state.procedure_type,
        backProcedureData: this.props.location.state.passProcedureDetailData,
      },
    });
  };

  relaunchworkInstruction = (id) => {
    this.props.relaunchData({ WorkInstrucionId: id });
  };

  handleSubmittoGia = (pr_id) => {
    var workInstructionData =
      this.props.getDetailProcedureData.WorkInstructionList.find(
        (singleDataCapture) => {
          return singleDataCapture.Id === pr_id;
        }
      );

    console.log(
      "workins--->",
      workInstructionData.InspectionDocument.DocumentSavePath
    );

    this.props.submitGiaLink({
      LicenseId: licenseId,
      WorkInstructionId: pr_id,
      DocPath: workInstructionData.InspectionDocument.DocumentSavePath,
      // SentMailBy: this.state.sendMail,
    });

    // this.props.history.push({
    //   pathname: "/" + webURL + "main/home/procedure-detail",
    //   state: { passProcedureDetailData: procedureDetailData },
    // });
  };

  handleViewPDFDocument = (DocPath) => {
    window.open(DocPath);
  };

  handleGoBack = () => {
    this.props.history.push({
      pathname: "/" + webURL + "main/home/business-procedure",
    });
  };

  render() {
    var proceduresData = this.props.getDetailProcedureData;
    var detailData = "";
    var test = [];
    var procedureDetailData = [];
    var countData = [];
    countData = this.props.getcounterData;

    console.log("render send mail by--->", this.state.sendMail);

    if (!proceduresData) {
      // Object is empty (Would return true in this example)
    } else {
      detailData = proceduresData.WorkInstructionList;

      if (detailData) {
        detailData.map((item, index) => {
          var dataCaptureJSON = item.DataCaptureJson;
          dataCaptureJSON["Id"] = item.Id;
          dataCaptureJSON["documentPath"] =
            item.InspectionDocument.DocumentSavePath;

          var InspectionJson = item.InspectionJson;
          // InspectionJson["Id"] = item.Id;

          InspectionJson["documentPath"] =
            item.InspectionDocument.DocumentSavePath;

          if (this.state.procedure_type === "oneFormWorkInstruction") {
            console.log("inspection");
            procedureDetailData.push(InspectionJson);
          } else {
            procedureDetailData.push(dataCaptureJSON);
          }

          // console.log("testing---->", procedureDetailData);

          // procedureDetailData.push(item.DataCaptureJson);
        });
      }

      // console.log("procedure--->", procedureDetailData);
      // procedureDetailData = proceduresData;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = proceduresData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;

      // var start_record = '';
      var end_record = "";
      if (pagination.current === 1) {
        // start_record = 1;
        end_record = pagination.pageSize;
      } else {
        // start_record = ((pagination.current -1) * pagination.pageSize) + 1;
        end_record = pagination.current * pagination.pageSize;
        if (end_record > pagination.total) {
          end_record = pagination.total;
        }
      }

      if (
        pagination.current !== "" &&
        this.state.pagination.current === undefined
      ) {
        this.setState({
          pagination,
        });
      } else if (
        pagination.total !== "" &&
        pagination.total !== old_pagination_total
      ) {
        pagination.current = 1;
        this.setState({
          pagination,
        });
      } else if (
        (pagination.total === "" || pagination.total === 0) &&
        pagination.total !== old_pagination_total
      ) {
        this.setState({
          pagination,
        });
      }
    }

    var columns = [];
    let pageURL = window.location.href;
    let lastURLSegment = pageURL.substr(pageURL.lastIndexOf("/") + 1);
    if (detailData) {
      detailData.map((item, index) => {
        if (index === 0) {
          {
            if (this.state.procedure_type === "oneFormWorkInstruction") {
              if (this.state.process_name === "GIA") {
                Object.keys(item.InspectionJson).map((key) => {
                  if (key !== "documentPath") {
                    columns.push({
                      title: key,
                      dataIndex: key,
                      key: key,

                      render(text, record) {
                        if (
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            "Favorable." &&
                          (record.SincronitzacióGIA ===
                            "Error en el gestor documental" ||
                            record.GIAResponse ===
                              "Error en el gestor documental" ||
                            record.SincronitzacióGIA ===
                              "Error d'autenticació" ||
                            record.GIAResponse === "Error d'autenticació" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.SincronitzacióGIA ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.GIAResponse ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.SincronitzacióGIA ===
                              "The operation has timed out" ||
                            record.GIAResponse ===
                              "The operation has timed out")
                        ) {
                          return {
                            props: {
                              style: {
                                color: "green",
                                backgroundColor: "#FFC000",
                              },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            "Desfavorable atès que es detecten  No conformitats." &&
                          (record.SincronitzacióGIA ===
                            "Error en el gestor documental" ||
                            record.GIAResponse ===
                              "Error en el gestor documental" ||
                            record.SincronitzacióGIA ===
                              "Error d'autenticació" ||
                            record.GIAResponse === "Error d'autenticació" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.SincronitzacióGIA ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.GIAResponse ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.SincronitzacióGIA ===
                              "The operation has timed out" ||
                            record.GIAResponse ===
                              "The operation has timed out")
                        ) {
                          return {
                            props: {
                              style: {
                                color: "red",
                                backgroundColor: "#FFC000",
                              },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            null &&
                          (record.SincronitzacióGIA ===
                            "Error en el gestor documental" ||
                            record.GIAResponse ===
                              "Error en el gestor documental" ||
                            record.SincronitzacióGIA ===
                              "Error d'autenticació" ||
                            record.GIAResponse === "Error d'autenticació" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: SENTIT" ||
                            record.SincronitzacióGIA ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.GIAResponse ===
                              "Valor incorrecte o inexistent al GIA: ID_AC" ||
                            record.SincronitzacióGIA ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.GIAResponse ===
                              "Manca dada obligatòria: NUM_EXP" ||
                            record.SincronitzacióGIA ===
                              "The operation has timed out" ||
                            record.GIAResponse ===
                              "The operation has timed out")
                        ) {
                          return {
                            props: {
                              style: {
                                color: "orange",
                              },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          record.SincronitzacióGIA === null ||
                          record.GIAResponse === null ||
                          record.SincronitzacióGIA === "Firma pendiente" ||
                          record.GIAResponse === "Pending signature" ||
                          record.SincronitzacióGIA === "Sincronitzant" ||
                          record.GIAResponse === "Synchronizing" ||
                          record.SincronitzacióGIA === "Sincronizando"
                        ) {
                          return {
                            props: {
                              style: { color: "black" },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          (record.SincronitzacióGIA === "OK" ||
                            record.GIAResponse === "OK") &&
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            "Favorable."
                        ) {
                          return {
                            props: {
                              style: { color: "green" },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          (record.SincronitzacióGIA === "OK" ||
                            record.GIAResponse === "OK") &&
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            "Desfavorable atès que es detecten  No conformitats."
                        ) {
                          return {
                            props: {
                              style: { color: "red" },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        } else if (
                          (record.SincronitzacióGIA === "OK" ||
                            record.GIAResponse === "OK") &&
                          record.DacordAmbElsFetsConstatatsElResultatDeLaVerificaciS ===
                            null
                        ) {
                          return {
                            props: {
                              style: { color: "red" },
                            },
                            children: (
                              <div>
                                <span className="">
                                  {text === "" || text === null ? (
                                    ""
                                  ) : typeof text === "object" &&
                                    text.length == 0 ? (
                                    <span>
                                      <center>-</center>
                                    </span>
                                  ) : typeof text === "object" ? (
                                    <span className="gx-link">
                                      <a
                                        href
                                        onClick={() =>
                                          this.handleViewDetailInfo(
                                            record[key],
                                            key
                                          )
                                        }
                                        className="arrow-btn gx-link"
                                        value={record.Id}
                                      >
                                        <IntlMessages id="procedureAction.viewDetail" />
                                      </a>
                                    </span>
                                  ) : typeof text === "boolean" ? (
                                    text === true ? (
                                      "True"
                                    ) : (
                                      "False"
                                    )
                                  ) : key === "signaturaInspector" ? (
                                    <a
                                      href={
                                        "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                        record[key].substr(
                                          record[key].lastIndexOf("/") + 1
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                    >
                                      <IntlMessages id="column.signature" />
                                    </a>
                                  ) : (
                                    text
                                  )}
                                </span>
                              </div>
                            ),
                          };
                        }
                      },
                    });
                  }
                });
              } else {
                Object.keys(item.InspectionJson).map((key) => {
                  if (key !== "documentPath") {
                    columns.push({
                      title: key,
                      dataIndex: key,
                      key: key,

                      render(text, record) {
                        return {
                          props: {
                            style: { color: "black" },
                          },
                          children: (
                            <div>
                              <span className="">
                                {text === "" || text === null ? (
                                  ""
                                ) : typeof text === "object" &&
                                  text.length == 0 ? (
                                  <span>
                                    <center>-</center>
                                  </span>
                                ) : typeof text === "object" ? (
                                  <span className="gx-link">
                                    <a
                                      href
                                      onClick={() =>
                                        this.handleViewDetailInfo(
                                          record[key],
                                          key
                                        )
                                      }
                                      className="arrow-btn gx-link"
                                      value={record.Id}
                                    >
                                      <IntlMessages id="procedureAction.viewDetail" />
                                    </a>
                                  </span>
                                ) : typeof text === "boolean" ? (
                                  text === true ? (
                                    "True"
                                  ) : (
                                    "False"
                                  )
                                ) : key === "signaturaInspector" ? (
                                  <a
                                    href={
                                      "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                      record[key].substr(
                                        record[key].lastIndexOf("/") + 1
                                      )
                                    }
                                    className="arrow-btn gx-link"
                                  >
                                    <IntlMessages id="column.signature" />
                                  </a>
                                ) : (
                                  text
                                )}
                              </span>
                            </div>
                          ),
                        };
                      },
                    });
                  }
                });
              }
            } else {
              Object.keys(item.DataCaptureJson).map((key) => {
                if (key !== "Id" && key !== "documentPath") {
                  columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                    render: (text, record) => (
                      <div>
                        <span className="">
                          {text === "" || text === null ? (
                            ""
                          ) : typeof text === "object" && text.length == 0 ? (
                            <span>
                              <center>-</center>
                            </span>
                          ) : typeof text === "object" ? (
                            <span className="gx-link">
                              <a
                                href
                                onClick={() =>
                                  this.handleViewDetailInfo(record[key], key)
                                }
                                className="arrow-btn gx-link"
                                value={record.Id}
                              >
                                <IntlMessages id="procedureAction.viewDetail" />
                              </a>
                            </span>
                          ) : typeof text === "boolean" ? (
                            text === true ? (
                              "True"
                            ) : (
                              "False"
                            )
                          ) : key === "signaturaInspector" ? (
                            <a
                              href={
                                "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                                record[key].substr(
                                  record[key].lastIndexOf("/") + 1
                                )
                              }
                              className="arrow-btn gx-link"
                            >
                              <IntlMessages id="column.signature" />
                            </a>
                          ) : (
                            text
                          )}
                        </span>
                      </div>
                    ),

                    // render(text, record) {
                    //   if (record.expedient === "TGM Demo") {
                    //     return {
                    //       props: {
                    //         style: { color: "red" },
                    //       },
                    //       children: (
                    //         <div>
                    //           <span className="">
                    //             {text === "" || text === null ? (
                    //               ""
                    //             ) : typeof text === "object" &&
                    //               text.length == 0 ? (
                    //               <span>
                    //                 <center>-</center>
                    //               </span>
                    //             ) : typeof text === "object" ? (
                    //               <span className="gx-link">
                    //                 <a
                    //                   href
                    //                   onClick={() =>
                    //                     this.handleViewDetailInfo(
                    //                       record[key],
                    //                       key
                    //                     )
                    //                   }
                    //                   className="arrow-btn gx-link"
                    //                   value={record.Id}
                    //                 >
                    //                   <IntlMessages id="procedureAction.viewDetail" />
                    //                 </a>
                    //               </span>
                    //             ) : typeof text === "boolean" ? (
                    //               text === true ? (
                    //                 "True"
                    //               ) : (
                    //                 "False"
                    //               )
                    //             ) : key === "signaturaInspector" ? (
                    //               <a
                    //                 href={
                    //                   "https://api.moreapp.com/api/v1.0/client/registrations/files/" +
                    //                   record[key].substr(
                    //                     record[key].lastIndexOf("/") + 1
                    //                   )
                    //                 }
                    //                 className="arrow-btn gx-link"
                    //               >
                    //                 <IntlMessages id="column.signature" />
                    //               </a>
                    //             ) : (
                    //               text
                    //             )}
                    //           </span>
                    //         </div>
                    //       ),
                    //     };
                    //   }
                    // },
                  });
                }
              });
            }
          }
        }
      });
      columns.push({
        title: <IntlMessages id="column.Action" />,
        key: "printReport",
        fixed: "right",
        align: "center",
        render: (text, record) => (
          <div>
            <FormattedMessage id="columnlabel.see">
              {(title) => (
                <span className="gx-link">
                  {this.state.procedure_type === "twoFormProcess" ||
                  this.state.procedure_type === "oneFormWorkInstruction" ? (
                    <Button
                      onClick={() => this.viewWorkInstructionDetail(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/visibility.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                    </Button>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </FormattedMessage>
            {this.state.procedure_type === "twoFormProcess" ? (
              <Divider type="vertical" />
            ) : (
              ""
            )}
            <FormattedMessage id="actiondocument.Download">
              {(title) => (
                <span className="gx-link">
                  <Button
                    onClick={() =>
                      this.handleViewPDFDocument(record.documentPath)
                    }
                    value={record.Id}
                    className="arrow-btn gx-link"
                  >
                    <img
                      src={require("assets/images/download.png")}
                      className="document-icons"
                      alt={title}
                      title={title}
                    />
                  </Button>
                </span>
              )}
            </FormattedMessage>
            <Divider type="vertical" />
            {this.state.sendMail === "Molins" ? (
              <FormattedMessage id="actiondocument.signerDetail">
                {(title) => (
                  <span className="gx-link">
                    <Button
                      disabled
                      onClick={() => this.handleViewSignerDetail(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/signature.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                    </Button>
                  </span>
                )}
              </FormattedMessage>
            ) : (
              <FormattedMessage id="actiondocument.signerDetail">
                {(title) => (
                  <span className="gx-link">
                    <Button
                      onClick={() => this.handleViewSignerDetail(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/signature.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                    </Button>
                  </span>
                )}
              </FormattedMessage>
            )}

            <Divider type="vertical" />
            {record.SincronitzacióGIA === "Error en el gestor documental" ||
            record.GIAResponse === "Error en el gestor documental" ||
            record.SincronitzacióGIA === "Error d'autenticació" ||
            record.GIAResponse === "Error d'autenticació" ||
            record.SincronitzacióGIA === "Manca dada obligatòria: SENTIT" ||
            record.GIAResponse === "Manca dada obligatòria: SENTIT" ||
            record.SincronitzacióGIA === "Manca dada obligatòria: NUM_EXP" ||
            record.GIAResponse === "Manca dada obligatòria: NUM_EXP" ||
            record.SincronitzacióGIA === "The operation has timed out" ||
            record.GIAResponse === "The operation has timed out" ||
            record.SincronitzacióGIA ===
              "Valor incorrecte o inexistent al GIA: ID_AC" ||
            record.GIAResponse ===
              "Valor incorrecte o inexistent al GIA: ID_AC" ||
            record.SincronitzacióGIA ===
              "The underlying connection was closed: An unexpected error occurred on a receive." ||
            record.GIAResponse ===
              "The underlying connection was closed: An unexpected error occurred on a receive." ? (
              <FormattedMessage id="column.resendtogia">
                {(title) => (
                  <span className="gx-link">
                    <Button
                      onClick={() => this.handleSubmittoGia(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/resend_icon.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                      {/* <IntlMessages id="column.resendtogia" /> */}
                    </Button>
                  </span>
                )}
              </FormattedMessage>
            ) : (
              <FormattedMessage id="column.resendtogia">
                {(title) => (
                  <span className="gx-link">
                    <Button
                      disabled
                      onClick={() => this.handleSubmittoGia(record.Id)}
                      value={record.Id}
                      className="arrow-btn gx-link"
                    >
                      <img
                        src={require("assets/images/resend_icon.png")}
                        className="document-icons"
                        alt={title}
                        title={title}
                      />
                      {/* <IntlMessages id="column.resendtogia" /> */}
                    </Button>
                  </span>
                )}
              </FormattedMessage>
            )}
            <Divider type="vertical" />
            <FormattedMessage id="columnlabel.relaunch">
              {(title) => (
                <span className="gx-link">
                  <Button
                    onClick={() => this.relaunchworkInstruction(record.Id)}
                    value={record.Id}
                    className="arrow-btn gx-link"
                  >
                    <img
                      src={require("assets/images/rocket-launch.png")}
                      className="document-icons"
                      title={title}
                    />
                  </Button>
                </span>
              )}
            </FormattedMessage>
          </div>
        ),
      });
    }

    return (
      <div className="ant-card gx-card ant-card-bordered custo_head_wrap">
        <div className="ant-card-head">
          <div className="ant-card-head-wrapper">
            <span
              className="gx-text-primary gx-fs-md gx-pointer gx-d-block"
              onClick={() => this.handleGoBack()}
            >
              <i
                className={`icon icon-long-arrow-left cust-gx-fs-xxl gx-d-inline-flex gx-vertical-align-middle`}
              />
            </span>
            <div className="ant-card-head-title cust-card-head-title">
              {this.state.procedureName}
            </div>
            <div className="ant-card-extra">
              <div className="card-extra-form">
                <FormattedMessage id="placeholder.Search">
                  {(placeholder) => (
                    <Search
                      placeholder={placeholder}
                      value={this.state.searchedDetail}
                      onChange={this.handleChangeDetailSearch}
                      onSearch={this.handleDetailSearch}
                      style={{ marginBottom: "0px" }}
                    />
                  )}
                </FormattedMessage>
                {/* {permitAdd ? <Button className="gx-mb-0" type="primary" style={{float:"right"}} onClick={() => this.onAddSession()}><IntlMessages id="sessionAdd.addSession"/></Button> : <Button disabled className="gx-mb-0" type="primary" style={{float:"right"}} onClick={() => this.onAddSession()}><IntlMessages id="sessionAdd.addSession"/></Button>} */}
              </div>
            </div>
          </div>

          <div className="ant-card-head-wrapper">
            <div>
              <Button
                className="gia-ok-btn"
                value="giaok"
                onClick={this.handleCountSearch}
              >
                GIA Ok : {countData != null ? countData.GiaOkResponse : ""}
              </Button>
              <Button
                className="error-gia-btn"
                value="giaerror"
                onClick={this.handleCountSearch}
              >
                Error GIA :{" "}
                {countData != null ? countData.GiaErrorResponse : ""}
              </Button>
              <Button
                className="favorable-btn"
                value="fevorable"
                onClick={this.handleCountSearch}
              >
                Favorables : {countData != null ? countData.Favorables : ""}
              </Button>
              <Button
                className="desfavorable-btn"
                value="desfevorable"
                onClick={this.handleCountSearch}
              >
                Desfavorables :{" "}
                {countData != null ? countData.DesFavorables : ""}
              </Button>
              <Button
                className="all-btn"
                value="ALL"
                onClick={this.handleCountSearch}
              >
                All
              </Button>
              <Button
                className="all-btn"
                // value="ALL"
                onClick={this.handleExport}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="ant-card-body">
          <Table
            className="gx-table-responsive"
            columns={columns}
            dataSource={procedureDetailData}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            // style={{ whiteSpace: "normal" }}
            // width={{ x: 1000 }}
            // scroll={{ x: 10000, y: 400 }}
            scroll={{ x: true }}
            footer={() => (
              <Button className="total-count-btn">
                TotalCount :{" "}
                {proceduresData != null ? proceduresData.TotalCount : ""}
              </Button>
            )}
          />
          <Modal
            title={this.state.columnTitle}
            visible={this.state.openDetailViewModel}
            destroyOnClose={true}
            onCancel={this.closeViewDetailInfo}
            footer={null}
            width={700}
            className="cust-modal-width cust-session-modal detail-modal"
          >
            {this.state.detailViewData.map((item) => {
              if (typeof item === "object") {
                return (
                  <>
                    <Row className="detail-row">
                      {Object.keys(item).map((key, index) => {
                        if (index % 2 === 0) {
                          return (
                            <Col lg={12}>
                              <div className="det-row">
                                <span>
                                  <b>{key}</b> :{" "}
                                  <span style={{ color: "#afafaf" }}>
                                    {item[key]}
                                  </span>
                                </span>
                              </div>
                            </Col>
                          );
                        } else {
                          return (
                            <Col lg={12}>
                              <div className="det-row">
                                <span>
                                  <b>{key}</b> :{" "}
                                  <span style={{ color: "#afafaf" }}>
                                    {item[key]}
                                  </span>
                                </span>
                              </div>
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  </>
                );
              } else {
                return (
                  <Row className="detail-row">
                    <Col lg={24}>
                      <div className="det-row">
                        <span>{item}</span>
                      </div>
                    </Col>
                  </Row>
                );
              }
            })}
          </Modal>
          <Modal
            title={<IntlMessages id="actiondocument.signerDetail" />}
            visible={this.state.openSignerDetailModel}
            destroyOnClose={true}
            onCancel={this.closeViewSignerDetail}
            footer={null}
            width={700}
          >
            {this.state.signerViewData !== "" &&
            this.state.signerViewData !== null ? (
              this.state.signerViewData.map((item) => {
                return (
                  <>
                    <Row className="detail-row">
                      <Col lg={12}>
                        <div className="det-row">
                          <i className="icon icon-circle cust-icon-style" />
                          <span>
                            <b>
                              <IntlMessages id="column.DNI" />
                            </b>{" "}
                            :{" "}
                            <span style={{ color: "#afafaf" }}>{item.DNI}</span>
                          </span>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="det-row">
                          <span>
                            <b>
                              <IntlMessages id="column.name" />
                            </b>{" "}
                            :{" "}
                            <span style={{ color: "#afafaf" }}>
                              {item.FullName}
                            </span>
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="detail-row">
                      <Col lg={12} style={{ padding: "0 0 0 34px" }}>
                        <div className="det-row">
                          <span>
                            <b>
                              <IntlMessages id="procedures.signType" />
                            </b>{" "}
                            :{" "}
                            <span style={{ color: "#afafaf" }}>
                              {item.SignType === "bio" ? (
                                <IntlMessages id="signatureType.bio" />
                              ) : item.SignType === "emailandsms" ? (
                                <IntlMessages id="signatureType.remote" />
                              ) : (
                                <IntlMessages id="signatureType.digital" />
                              )}
                            </span>
                          </span>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="det-row">
                          <span>
                            <b>
                              <IntlMessages id="procedures.signStatus" />
                            </b>{" "}
                            :{" "}
                            <span style={{ color: "#afafaf" }}>
                              {item.SignStatus}
                            </span>
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </>
                );
              })
            ) : (
              <div>
                <div className="ant-empty ant-empty-normal">
                  <div className="ant-empty-image">
                    <svg
                      width="64"
                      height="41"
                      viewBox="0 0 64 41"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        transform="translate(0 1)"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <ellipse
                          fill="#F5F5F5"
                          cx="32"
                          cy="33"
                          rx="32"
                          ry="7"
                        ></ellipse>
                        <g fill-rule="nonzero" stroke="#D9D9D9">
                          <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                          <path
                            d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                            fill="#FAFAFA"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <p className="ant-empty-description">
                    <IntlMessages id="global.NoData" />
                  </p>
                </div>
              </div>
            )}
          </Modal>
          {this.props.loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  getDetailProcedure,
  setStatusToStarting,
  submitGiaLink,
  relaunchData,
  getExportData,
};

const viewDetailedProcedureForm = Form.create()(ProcedureDetail);

const mapStateToProps = (state) => {
  return {
    getDetailProcedureData:
      state.businessProceduresReducers.get_detail_procedure,
    getcounterData: state.businessProceduresReducers.getCounter.data,
    loader: state.businessProceduresReducers.loader,
    status: state.businessProceduresReducers.status,
  };
};

// export default Inspection;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(viewDetailedProcedureForm);
