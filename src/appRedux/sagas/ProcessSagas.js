import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_PROCESS_DATA,
  GET_PROCESS_WORK_INSTRUCTION_DATA,
  SAVE_PROCESS_DATA,
  SAVE_PROCEDURE_LAUNCH_DATA,
  DELETE_PROCESS_DATA,
  GET_PROCESS_DROPDOWN,
  GET_SYNCHRONIZE_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getProcessSuccess,
  getProcessWorkInstructionSuccess,
  getProcessDropDownSuccess,
  getSynchronizeSuccess,
  getSynchronizeFail,
} from "./../actions/ProcessActions";
import { message } from "antd";

export const token = (state) => state.token;
let licenseId = "";
let identityId = "";
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

/*process api call section start*/
const getProcessByProcessId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ProcessList?UserId=" +
        identityId +
        "&ProcessId=" +
        payloadData.ProcessId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy +
        "&SearchColName=" +
        payloadData.searchedColumn +
        "&SearchValue=" +
        payloadData.searchProcessTerm +
        "&filterBy=" +
        payloadData.filterByData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProcessResult) => getProcessResult.data)
    .catch((error) => error);

const getProcessWorkInstructionByProcessId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ProcessListForWorkInstruction?UserId=" +
        identityId +
        "&lang=" +
        langName +
        "&BusinessProcedureId=" +
        payloadData.ProcessId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy +
        "&SearchColName=" +
        payloadData.searchedColumn +
        "&SearchValue=" +
        payloadData.searchProcessTerm +
        "&filterBy=" +
        payloadData.filterByData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProcessWorkResult) => getProcessWorkResult.data)
    .catch((error) => error);

const getProcessNamesForDropDownList = async () =>
  await axios
    .get(baseURL + "ProcessNamesForDropDownList?UserId=" + identityId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getProcessListRes) => getProcessListRes.data)
    .catch((error) => error);

const saveProcessAPIcall = async (payloadData) =>
  await axios
    .post(
      baseURL +
        payloadData.APIName +
        "?lang=" +
        langName +
        "&UserId=" +
        identityId +
        "&ProcessId=" +
        payloadData.processId,
      payloadData.rowData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const saveProcedureLaunchAPIcall = async (payloadData) =>
  await axios
    .post(
      baseURL +
        "LanuchWorkInstruction?lang=" +
        langName +
        "&LicenseId=" +
        licenseId +
        "&BusinessProcedureId=" +
        payloadData.BusinessProcedureId +
        "&IdentityId=" +
        payloadData.IdentityId +
        "&filterType=" +
        payloadData.filterType,
      payloadData.data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const deleteProcessAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteProcessByRowId?lang=" +
        langName +
        "&UserId=" +
        identityId +
        "&ProcessId=" +
        payloadData.processId +
        "&RowId=" +
        payloadData.rowId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDeleteRes) => getDeleteRes.data)
    .catch((error) => error);

/*process api call section end*/

//process api call function start
function* getProcessById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (
      userData != "" &&
      userData != null &&
      userData["IdentityId"] != undefined
    ) {
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getProcessRes = yield call(getProcessByProcessId, payload);
    if (getProcessRes.status) {
      yield put(getProcessSuccess(getProcessRes.data));
    } else {
      // yield put(showErrorMessage(getProcessRes.message));
      message.error(getProcessRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* getProcessWorkInstructionById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (
      userData != "" &&
      userData != null &&
      userData["IdentityId"] != undefined
    ) {
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getProcessRes = yield call(
      getProcessWorkInstructionByProcessId,
      payload
    );
    if (getProcessRes.status) {
      yield put(getProcessWorkInstructionSuccess(getProcessRes.data));
    } else {
      // yield put(showErrorMessage(getProcessRes.message));
      message.error(getProcessRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

//process api call function start
function* getProcessDropDownList() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (
      userData != "" &&
      userData != null &&
      userData["IdentityId"] != undefined
    ) {
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getProcessDDRes = yield call(getProcessNamesForDropDownList);
    if (getProcessDDRes.status) {
      yield put(getProcessDropDownSuccess(getProcessDDRes.data));
    } else {
      // yield put(showErrorMessage(getProcessDDRes.message));
      message.error(getProcessDDRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* saveProcess({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (
      userData != "" &&
      userData != null &&
      userData["IdentityId"] != undefined
    ) {
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getSaveResult = yield call(saveProcessAPIcall, payload);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-RowId",
        perPage: 10,
        ProcessId: payload.processId,
      };
      const getProcessRes = yield call(getProcessByProcessId, payloadData);
      if (getProcessRes.status) {
        yield put(getProcessSuccess(getProcessRes.data));
      } else {
        // yield put(showErrorMessage(getProcessRes.message));
        message.error(getProcessRes.message);
      }
    } else {
      // yield put(showErrorMessage(getSaveResult.message));
      message.error(getSaveResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* saveProcedureLaunch({ payload }) {
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
    const getSaveResult = yield call(saveProcedureLaunchAPIcall, payload);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
    } else {
      // yield put(showErrorMessage(getSaveResult.message));
      message.error(getSaveResult.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* deleteProcess({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (
      userData !== "" &&
      userData !== null &&
      userData["IdentityId"] !== undefined
    ) {
      identityId = userData["IdentityId"];
    }
  }

  try {
    const getDeleteResult = yield call(deleteProcessAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-RowId",
        perPage: 10,
        ProcessId: payload.processId,
      };
      const getProcessRes = yield call(getProcessByProcessId, payloadData);
      if (getProcessRes.status) {
        yield put(getProcessSuccess(getProcessRes.data));
      } else {
        // yield put(showErrorMessage(getProcessRes.message));
        message.error(getProcessRes.message);
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
//process api call function end

//get synchronize data-------------------->start

const getSynchronizeDataByIdRequest = async (payloadData) =>
  // console.log("payload--->", payloadData);
  await axios
    .get(
      baseURL +
        "UpdateDatasourceFromGia?ProcessId=" +
        payloadData.ProcessId +
        "&UserId=" +
        identityId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* getSynchronizeDataById({ payload }) {
  try {
    const response = yield call(getSynchronizeDataByIdRequest, payload);

    if (response.status == true) {
      yield put(getSynchronizeSuccess(response.data));
      message.success(response.message);
    }
  } catch (error) {
    yield put(getSynchronizeFail(error.response));
    message.error(error);
  }
}

export function* getSynchronizeByIdAccount() {
  yield takeEvery(GET_SYNCHRONIZE_PENDING, getSynchronizeDataById);
}

//get synchronize data-------------------->end

//take every function call
export function* getProcess() {
  yield takeEvery(GET_PROCESS_DATA, getProcessById);
}
export function* getProcessWorkInstruction() {
  yield takeEvery(
    GET_PROCESS_WORK_INSTRUCTION_DATA,
    getProcessWorkInstructionById
  );
}
export function* getProcessList() {
  yield takeEvery(GET_PROCESS_DROPDOWN, getProcessDropDownList);
}
export function* addProcess() {
  yield takeEvery(SAVE_PROCESS_DATA, saveProcess);
}
export function* addProcedureLaunch() {
  yield takeEvery(SAVE_PROCEDURE_LAUNCH_DATA, saveProcedureLaunch);
}
export function* removeProcess() {
  yield takeEvery(DELETE_PROCESS_DATA, deleteProcess);
}
export default function* rootSaga() {
  yield all([
    fork(getProcess),
    fork(getProcessWorkInstruction),
    fork(getProcessList),
    fork(addProcess),
    fork(addProcedureLaunch),
    fork(removeProcess),
    fork(getSynchronizeByIdAccount),
  ]);
}
