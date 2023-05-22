import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName, webURL } from "./../../util/config";
import {
  SELECT_PROCEDURE_PENDING,
  GET_PROCEDURE_CONFIG_PENDING,
  GET_PROCEDURE_BY_ID_PENDING,
  ADD_PROCEDURE_CONFIG_PENDING,
  UPDATE_PROCEDURE_PENDING,
  DELETE_PROCEDURE_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  getProcedureSuccess,
  getProcedureFail,
  getProcedureConfigSuccess,
  getProcedureConfigFail,
  getProcedureConfigByIdSuccess,
  getProcedureConfigByIdFail,
  addProcessDataSuccess,
  addProcessDataFail,
  updateProcessDataSuccess,
  updateProcessDataFail,
  deleteProcedureSuccess,
} from "./../actions/VisitProcedureAction";
import { message } from "antd";
import { push } from "react-router-redux";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";
let identityId = "";
let generalSettingsList = "";
let userName = "";
let password = "";
let urlType = "";
let deviceId = "";

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

const headersWithFormData = {
  "Content-Type": "multipart/form-data",
  Authorization: "Basic " + authBasic,
};

//get procedure name start------------------------------------------->

const getProcedureRequest = async () =>
  await axios
    .get(baseURL + "ProcedureListWithFileds?LicenseId=" + licenseId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* getProcedureName() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");

  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const response = yield call(getProcedureRequest);
    if (response.status == true) {
      yield put(getProcedureSuccess(response.data));
    }
  } catch (error) {
    yield put(getProcedureFail(error.response));
    message.error(error);
  }
}

export function* getProcedureAccount() {
  yield takeEvery(SELECT_PROCEDURE_PENDING, getProcedureName);
}

//get procedure name end------------------------------------------->

//get all procedure list start------------------------------------------->

const getProcedureListRequest = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "MotumProcedureconfigList?LicenseId=" +
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
    .then((res) => res.data)
    .catch((error) => error);

function* getProcedureList({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");

  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const response = yield call(getProcedureListRequest, payload);
    if (response.status == true) {
      yield put(getProcedureConfigSuccess(response.data));
    }
  } catch (error) {
    yield put(getProcedureConfigFail(error.response));
    message.error(error);
  }
}

export function* getProcedureListAccount() {
  yield takeEvery(GET_PROCEDURE_CONFIG_PENDING, getProcedureList);
}

//get all procedure list end------------------------------------------->

//get procedure list By Id start------------------------------------------->

const getProcedureByIdRequest = async (procedureId) =>
  await axios
    .get(baseURL + "MotumProcedureconfigById?procedureID=" + procedureId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* getProcedureById(procedure) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const response = yield call(getProcedureByIdRequest, procedure.payload);
    if (response.status == true) {
      yield put(getProcedureConfigByIdSuccess(response.data));
      console.log("response data---->", response.data);
    }
  } catch (error) {
    yield put(getProcedureConfigByIdFail(error.response));
    message.error(error);
  }
}

export function* getProcedureByIdAccount() {
  yield takeEvery(GET_PROCEDURE_BY_ID_PENDING, getProcedureById);
}

//get procedure list By Id end------------------------------------------->

//Add procedure config data-------------------------------------->start

const addProcessDataRequest = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertMotumProcedureconfig", payloadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* addProcessData({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const response = yield call(addProcessDataRequest, payload);
    if (response.status == true) {
      yield put(addProcessDataSuccess(response.data));
      message.success(response.message);
      yield put(push("/" + webURL + "main/home/visit-procedure-management"));
    }
  } catch (error) {
    yield put(addProcessDataFail(error.response));
    message.error(error);
  }
}

export function* addProcessDataAccount() {
  yield takeEvery(ADD_PROCEDURE_CONFIG_PENDING, addProcessData);
}

//Add process data config data -------------------------------------------->end

//Update procedure config data api call-------------------------------------->start

const updateProcessDataRequest = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertMotumProcedureconfig", payloadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* updateProcessData({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const response = yield call(updateProcessDataRequest, payload);
    if (response.status == true) {
      yield put(updateProcessDataSuccess(response.data));
      message.success(response.message);
      yield put(push("/" + webURL + "main/home/visit-procedure-management"));
    }
  } catch (error) {
    yield put(updateProcessDataFail(error.response));
    message.error(error);
  }
}

export function* updateProcessDataAccount() {
  yield takeEvery(UPDATE_PROCEDURE_PENDING, updateProcessData);
}

//Update process data config data api call -------------------------------------------->end

// DELETE PROCEDURE API CALL---->START

const deleteProcedureRequest = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteMotumProcessConfig?LicenseId=" +
        licenseId +
        "&procedureID=" +
        payloadData.deleteId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* deleteProcedureById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }
  try {
    const procedureDataDelete = yield call(deleteProcedureRequest, payload);

    if (procedureDataDelete.status == true) {
      yield put(deleteProcedureSuccess(procedureDataDelete.data));
      message.success(procedureDataDelete.message);

      var payloadData = {
        pageNumber: 1,
        sortBy: "-ProcedureId",
        perPage: 10,
        searchProcedureTerm: "",
      };
      const getprocedureList = yield call(getProcedureListRequest, payloadData);
      if (getprocedureList.status == true) {
        yield put(getProcedureConfigSuccess(getprocedureList.data));
      } else {
        message.success(getprocedureList.message);
      }
    }
  } catch (error) {
    message.error(error);
  }
}

export function* deleteProcedureAccount() {
  yield takeEvery(DELETE_PROCEDURE_PENDING, deleteProcedureById);
}
//DELETE PROCEDURE API CALL---------------------------------------------------->END

export default function* rootSaga() {
  yield all([fork(getProcedureAccount)]);
  yield all([fork(getProcedureListAccount)]);
  yield all([fork(getProcedureByIdAccount)]);
  yield all([fork(addProcessDataAccount)]);
  yield all([fork(updateProcessDataAccount)]);
  yield all([fork(deleteProcedureAccount)]);
}
