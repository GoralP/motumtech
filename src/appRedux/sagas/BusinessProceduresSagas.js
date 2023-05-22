import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, webURL, branchName } from "./../../util/config";
import {
  GET_PROCEDURE,
  GET_DETAIL_PROCEDURE,
  GET_MOREAPPFORMDATA_DATA,
  GET_DEVICE_DATA,
  SAVE_PROCEDURE_DATA,
  UPDATE_PROCEDURE_DATA,
  DELETE_PROCEDURE_DATA,
  RESUBMIT_TO_GIA_PENDING,
  GET_COUNTER_PENDING,
  RELAUNCH_DATA_PENDING,
  GET_EXPORT_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  getProceduresDataSuccess,
  getMoreAppFormDataSuccess,
  getCountDataSuccess,
  getCountDataFail,
  getMoreAppFormDataFail,
  getDeviceDataSuccess,
  getDetailProcedureDataSuccess,
  showErrorMessage,
  submitGiaLinkSuccess,
  submitGiaLinkFail,
  relaunchDataSuccess,
  relaunchDataFail,
  getExportDataSuccess,
  getExportDataFail,
} from "./../actions/BusinessProceduresActions";
import { message } from "antd";
import { push } from "react-router-redux";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

// let userAuth = JSON.parse(localStorage.getItem("userAuth"));

// let authToken = window.btoa(
//   userAuth.Username + "-" + licenseId + ":" + userAuth.Password
// );

// let authToken = "";
// let userAuth = JSON.parse(localStorage.getItem("userAuth"));
// if (userAuth != "" && userAuth != null) {
//   authToken = window.btoa(
//     userAuth.Username + "-" + licenseId + ":" + userAuth.Password
//   );
// }

let authBasic = "";

console.log("business token --->", authBasic);

const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + authBasic,
};

const headersWithFormData = {
  "Content-Type": "multipart/form-data",
  Authorization: "Basic " + authBasic,
};

/*procedure api call section start*/
const getProcedureByLicenseId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "BusinessProcedureList?licenseId=" +
        licenseId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy +
        "&SearchTerm=" +
        payloadData.searchProcedureTerm,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProcedureRes) => getProcedureRes.data)
    .catch((error) => error);

const getDetailProcedureByProcedureId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetWorkInstrucionData?BusinessProcedureId=" +
        payloadData.ProcedureId +
        "&lang=" +
        langName +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&SearchTerm=" +
        payloadData.searchDetailProcedure +
        "&FilterTag=" +
        payloadData.filterTag,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProcedureRes) => getProcedureRes.data)
    .catch((error) => error);

const getMoreAppFormDataAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetMoreAppFormWithFileds?ApiKey=" +
        payloadData.ApiKey +
        "&ClientId=" +
        payloadData.ClientId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getFormDataResult) => getFormDataResult.data)
    .catch((error) => error);

const getDeviceDataAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetDeviceInfoByVidsignerCredential?Username=" +
        payloadData.Username +
        "&Password=" +
        payloadData.Password +
        "&UrlType=" +
        payloadData.UrlType,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDeviceResult) => getDeviceResult.data)
    .catch((error) => error);

const saveProcedureAPI = async (payloadData) =>
  await axios
    .post(baseURL + "SaveBusinessProcedure?lang=" + langName, payloadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getSaveResult) => getSaveResult.data)
    .catch((error) => error);

const updateProcedureAPI = async (payloadData) =>
  await axios
    .post(baseURL + "UpdateBusinessProcedure?lang=" + langName, payloadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getUpdateResult) => getUpdateResult.data)
    .catch((error) => error);

const deleteProcedureAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteProcedure?lang=" +
        langName +
        "&licenseId=" +
        licenseId +
        "&Id=" +
        payloadData.deleteId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDeleteRes) => getDeleteRes.data)
    .catch((error) => error);

/*procedure api call section end*/

//procedure api call function start
function* getProcedureById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");

  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }
  try {
    const getProcedureResult = yield call(getProcedureByLicenseId, payload);
    if (getProcedureResult.status) {
      yield put(getProceduresDataSuccess(getProcedureResult.data));
    } else {
      // yield put(showErrorMessage(getProcedureResult.message));
      message.error(getProcedureResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* getDetailProcedureById({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  let userdata = localStorage.getItem(branchName + "_data");
  langName = localStorage.getItem(branchName + "_language");
  console.log("payload---->", payload);
  localStorage.setItem("ProcedureId", payload.ProcedureId);
  localStorage.setItem("pageNumber", payload.pageNumber);
  localStorage.setItem("perPage", payload.perPage);
  localStorage.setItem("searchDetailProcedure", payload.searchDetailProcedure);

  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }
  try {
    const getDetailProcedure = yield call(
      getDetailProcedureByProcedureId,
      payload
    );
    if (getDetailProcedure.status) {
      yield put(getDetailProcedureDataSuccess(getDetailProcedure.data));
    } else {
      // yield put(showErrorMessage(getDetailProcedure.message));
      yield put(getDetailProcedureDataSuccess(getDetailProcedure.data));
      console.log("response---->", getDetailProcedure.data);
      // message.error(getDetailProcedure.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* deleteProcedure({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  let userdata = localStorage.getItem(branchName + "_data");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }
  try {
    const getDeleteResult = yield call(deleteProcedureAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchProcedureTerm: "",
      };
      const getProcedureRes = yield call(getProcedureByLicenseId, payloadData);
      if (getProcedureRes.status) {
        yield put(getProceduresDataSuccess(getProcedureRes.data));
      } else {
        // yield put(showErrorMessage(getProcedureRes.message));
        message.error(getProcedureRes.message);
      }
    } else {
      // yield put(showErrorMessage(getDeleteResult.message));
      message.error(getDeleteResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* getMoreAppFormDataByClientId({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const getFormDataRes = yield call(getMoreAppFormDataAPI, payload);
    langName = localStorage.getItem(branchName + "_language");
    if (getFormDataRes.length > 0) {
      yield put(getMoreAppFormDataSuccess(getFormDataRes));
    } else {
      // yield put(showErrorMessage());
      yield put(getMoreAppFormDataFail(true));
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* getDeviceDataByLicenseId({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const getDeviceRes = yield call(getDeviceDataAPI, payload);
    langName = localStorage.getItem(branchName + "_language");
    if (getDeviceRes.status) {
      yield put(getDeviceDataSuccess(getDeviceRes.data));
    } else {
      // yield put(showErrorMessage(getDeviceRes.message));
      message.error(getDeviceRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* saveProcedure({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    langName = localStorage.getItem(branchName + "_language");
    var getSaveResult = yield call(saveProcedureAPI, payload);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      yield put(push("/" + webURL + "main/home/business-procedure"));
      // yield put(showSuccessMessage({status:true, message:getSaveResult.message}));
    } else {
      // yield put(showSuccessMessage({status:false, message:getSaveResult.message}));
      message.error(getSaveResult.message);
      // yield put(showErrorMessage(getSaveResult.message));
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
function* updateProcedure({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    langName = localStorage.getItem(branchName + "_language");
    var getUpdateResult = yield call(updateProcedureAPI, payload);
    if (getUpdateResult.status) {
      message.success(getUpdateResult.message);
      yield put(push("/" + webURL + "main/home/business-procedure"));
      // yield put(showSuccessMessage({status:true, message:getUpdateResult.message}));
    } else {
      // yield put(showSuccessMessage({status:false, message:getUpdateResult.message}));
      message.error(getUpdateResult.message);
      // yield put(showErrorMessage(getUpdateResult.message));
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
//procedure api call function end

//resubmit data to gia api call------------------------------>start

const submitDocumentGiaRequest = async (payloadData) =>
  await axios
    .post(baseURL + "ResubmitDocumentToGia", payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* submitDocumentGia({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  console.log("gia payload----", payload);

  try {
    const response = yield call(submitDocumentGiaRequest, payload);

    if (response.status) {
      console.log("status--->", response.status);
      yield put(submitGiaLinkSuccess(response.data));
      message.success(response.message);
      var bprocedureId = localStorage.getItem("ProcedureId");
      var bpageNumber = localStorage.getItem("pageNumber");
      var bperPage = localStorage.getItem("perPage");
      var bserchTerm = localStorage.getItem("searchDetailProcedure");

      var payloadData1 = {
        ProcedureId: bprocedureId,
        langName,
        pageNumber: bpageNumber,

        perPage: bperPage,
        searchDetailProcedure: bserchTerm,
      };

      const getProcessRes = yield call(
        getDetailProcedureByProcedureId,
        payloadData1
      );
      if (getProcessRes.status) {
        yield put(getDetailProcedureDataSuccess(getProcessRes.data));
      }
    } else {
      yield put(submitGiaLinkSuccess(response.data));

      message.error(response.message);

      var bprocedureId = localStorage.getItem("ProcedureId");
      var bpageNumber = localStorage.getItem("pageNumber");
      var bperPage = localStorage.getItem("perPage");
      var bserchTerm = localStorage.getItem("searchDetailProcedure");

      var payloadData1 = {
        ProcedureId: bprocedureId,
        langName,
        pageNumber: bpageNumber,

        perPage: bperPage,
        searchDetailProcedure: bserchTerm,
      };

      console.log("payloadData1---->", payloadData1);
      const getProcessRes = yield call(
        getDetailProcedureByProcedureId,
        payloadData1
      );
      if (getProcessRes.status) {
        yield put(getDetailProcedureDataSuccess(getProcessRes.data));
      }
    }
  } catch (error) {
    yield put(submitGiaLinkFail(error.response));
    message.error(error);
  }
}

export function* submitDocumentGiaAccount() {
  yield takeEvery(RESUBMIT_TO_GIA_PENDING, submitDocumentGia);
}

//resubmit data to gia api call--------------------------------->end

// get record count api call-------------------------->start

const getRecordCountRequest = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "BusinessProcedureStatistic?BusinessProcedureId=" +
        payloadData.ProcedureId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getRecordCount({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  console.log("payload----->", payload);
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const response = yield call(getRecordCountRequest, payload);
    if (response.status == true) {
      yield put(getCountDataSuccess(response.data));
    }
  } catch (error) {
    yield put(getCountDataFail(error.response));
    message.error(error);
  }
}

export function* getRecordCountAccount() {
  yield takeEvery(GET_COUNTER_PENDING, getRecordCount);
}

//get count api call--------------------------------------->end

//get export data api call------------------------------>start

const getRecordExportRequest = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ExportWorkInstrucionData?BusinessProcedureId=" +
        payloadData.ProcedureId +
        "&FilterTag=" +
        payloadData.FilterTag +
        "&SearchTerm=" +
        payloadData.SearchTerm +
        "&lang=" +
        langName,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getExportCount({ payload }) {
  // console.log("export payload---->", payload);
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  console.log("payload----->", payload);
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const response = yield call(getRecordExportRequest, payload);
    if (response.status == true) {
      yield put(getExportDataSuccess(response.data));
    }
  } catch (error) {
    yield put(getExportDataFail(error.response));
    message.error(error);
  }
}

export function* getExportCountAccount() {
  yield takeEvery(GET_EXPORT_PENDING, getExportCount);
}

//get export data api call---------------------------------->end

//relaunch data api call start

const relaunchDataRequest = async (payloadData) =>
  await axios
    .post(
      baseURL +
        "ReLanuchWorkInstruction?WorkInstrucionId=" +
        payloadData.WorkInstrucionId,
      payloadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* RelaunchDataProcess({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const response = yield call(relaunchDataRequest, payload);
    if (response.status == true) {
      yield put(relaunchDataSuccess(response.data));
      message.success(response.message);
      // yield put(push("/" + webURL + "main/home/visit-procedure-management"));
    }
  } catch (error) {
    yield put(relaunchDataFail(error.response));
    message.error(error);
  }
}

export function* relaunchDataAccount() {
  yield takeEvery(RELAUNCH_DATA_PENDING, RelaunchDataProcess);
}

//relaunch api call end

//take every function call
export function* getProcedureData() {
  yield takeEvery(GET_PROCEDURE, getProcedureById);
}
export function* getDetailProcedureData() {
  yield takeEvery(GET_DETAIL_PROCEDURE, getDetailProcedureById);
}
export function* getFormData() {
  yield takeEvery(GET_MOREAPPFORMDATA_DATA, getMoreAppFormDataByClientId);
}
export function* getDeviceData() {
  yield takeEvery(GET_DEVICE_DATA, getDeviceDataByLicenseId);
}
export function* addProcedure() {
  yield takeEvery(SAVE_PROCEDURE_DATA, saveProcedure);
}
export function* editProcedure() {
  yield takeEvery(UPDATE_PROCEDURE_DATA, updateProcedure);
}
export function* removeProcedure() {
  yield takeEvery(DELETE_PROCEDURE_DATA, deleteProcedure);
}
export default function* rootSaga() {
  yield all([
    fork(getProcedureData),
    fork(getDetailProcedureData),
    fork(getFormData),
    fork(getDeviceData),
    fork(addProcedure),
    fork(editProcedure),
    fork(removeProcedure),
    fork(submitDocumentGiaAccount),
    fork(getRecordCountAccount),
    fork(relaunchDataAccount),
    fork(getExportCountAccount),
  ]);
}
