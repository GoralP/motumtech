import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_PROCEDURES,
  GET_PROCEDURES_REPORT,
  GET_PROCEDURE_FORM,
  VIEW_PROCEDURE_DETAIL_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getProceduresSuccess,
  getProcedurereportSuccess,
  getProcedureFormSuccess,
  getProcedureDetailsSuccess,
  getProcedureDetailsFail,
} from "./../actions/ProceduresActions";
import { message } from "antd";

export const token = (state) => state.token;

let userId = "";

let licenseId = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

// let userAuth = JSON.parse(localStorage.getItem("userAuth"));

// let authToken = window.btoa(
//   // userAuth.Username + "-" + licenseId + ":" + userAuth.Password
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

const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + authBasic,
};

/*Procedure Module Start Add, Get*/

//get Procedure
const getProceduresByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "ProcedureList?licenseId=" +
        userId +
        "&deviceId=&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy +
        "&PerPage=" +
        payloadData.perPage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProceduresRes) => getProceduresRes.data)
    .catch((error) => error);

//get Procedure Reports
const getProcedureReports = async (
  dniNumber,
  currentReport,
  startingDate,
  endingDate,
  pageNumber,
  sortBy,
  perPage
) =>
  await axios
    .get(
      baseURL +
        "GetProcedureReport?licenseId=" +
        userId +
        "&Startdate=" +
        startingDate +
        "&Enddate=" +
        endingDate +
        "&DNI=" +
        dniNumber +
        "&PageNumber=" +
        pageNumber +
        "&Sort=" +
        sortBy +
        "&PerPage=" +
        perPage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getProceduresRes) => getProceduresRes.data)
    .catch((error) => error);

//get Procedure form fields
const getProcedureFormDataApi = async (payloadData) =>
  await axios
    .get(baseURL + "ProcedureListWithFileds?LicenseId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getProcedureRes) => getProcedureRes.data)
    .catch((error) => error);

//Procedure Module start functions
function* getProceduresById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getProceduresRes = yield call(getProceduresByGroupId, payload);
    if (getProceduresRes.status) {
      yield put(getProceduresSuccess(getProceduresRes.data));
    } else {
      yield put(showErrorMessage(getProceduresRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getProcedurereportById({ payload }) {
  const {
    dniNumber,
    currentReport,
    startingDate,
    endingDate,
    pageNumber,
    sortBy,
    perPage,
  } = payload;
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getProceduresRes = yield call(
      getProcedureReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate,
      pageNumber,
      sortBy,
      perPage
    );
    if (getProceduresRes.status) {
      yield put(getProcedurereportSuccess(getProceduresRes.data));
    } else {
      yield put(showErrorMessage(getProceduresRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

function* getProcedureForm({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getProcedureFormRes = yield call(getProcedureFormDataApi, payload);
    if (getProcedureFormRes.status) {
      yield put(getProcedureFormSuccess(getProcedureFormRes.data));
    } else {
      yield put(showErrorMessage(getProcedureFormRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//get single procedure data api call------------------>

const getSingleProcedureRequest = async (procedureId) =>
  await axios
    .get(baseURL + "ProcedureFormData?VisitId=" + procedureId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* getSingleProcedure(procedure) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const singleResponse = yield call(
      getSingleProcedureRequest,
      procedure.payload
    );

    if (singleResponse.status) {
      yield put(getProcedureDetailsSuccess(singleResponse.data));
      console.log("response data---->", singleResponse.data);
    } else {
      yield put(getProcedureDetailsSuccess(singleResponse.data));
      // yield put(showErrorMessage(singleResponse.message));
    }
  } catch (error) {
    yield put(getProcedureDetailsFail(error.response));
    message.error(error);
  }
}

export function* getSingleProcedureAccount() {
  yield takeEvery(VIEW_PROCEDURE_DETAIL_PENDING, getSingleProcedure);
}

//get single procedure data api call----------------------------------->end

//take Every function call
export function* getprocedures() {
  yield takeEvery(GET_PROCEDURES, getProceduresById);
}
export function* getProcedurereport() {
  yield takeEvery(GET_PROCEDURES_REPORT, getProcedurereportById);
}
export function* getProcedureform() {
  yield takeEvery(GET_PROCEDURE_FORM, getProcedureForm);
}
export default function* rootSaga() {
  yield all([
    fork(getprocedures),
    fork(getProcedurereport),
    fork(getProcedureform),
    fork(getSingleProcedureAccount),
  ]);
}
