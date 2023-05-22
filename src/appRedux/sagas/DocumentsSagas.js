import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_DOCUMENTS,
  GET_DOCUMENTS_REPORT,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getDocumentsSuccess,
  getDocumentreportSuccess,
} from "./../actions/DocumentsActions";
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

/*Identities Module Start Add, Get*/

//get identities
const getDocumentsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "DocumentList?licenseId=" +
        userId +
        "&documentType=" +
        payloadData.filterBy +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy +
        "&VisitId=0&perPage=" +
        payloadData.perPage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDocumentsRes) => getDocumentsRes.data)
    .catch((error) => error);

const getDocumentReports = async (
  dniNumber,
  currentReport,
  startingDate,
  endingDate
) =>
  await axios
    .get(
      baseURL +
        "FilterDocument?licenseId=" +
        userId +
        "&Startdate=" +
        startingDate +
        "&Enddate=" +
        endingDate +
        "&DNI=" +
        dniNumber +
        "&PageNumber=1&Sort=+OwnerName",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDocumentsRes) => getDocumentsRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getDocumentsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getDocumentsRes = yield call(getDocumentsByGroupId, payload);
    if (getDocumentsRes.status) {
      yield put(getDocumentsSuccess(getDocumentsRes.data));
    } else {
      // yield put(showErrorMessage(getDocumentsRes.message));
      message.error(getDocumentsRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}
//Identities Module end ADD, GET

function* getDocumentreportById({ payload }) {
  const { dniNumber, currentReport, startingDate, endingDate } = payload;
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getDocumentsRes = yield call(
      getDocumentReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate
    );
    if (getDocumentsRes.status) {
      yield put(getDocumentreportSuccess(getDocumentsRes.data));
    } else {
      yield put(showErrorMessage(getDocumentsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//take Every function call
export function* getdocuments() {
  yield takeEvery(GET_DOCUMENTS, getDocumentsById);
}
export function* getDocumentreport() {
  yield takeEvery(GET_DOCUMENTS_REPORT, getDocumentreportById);
}
export default function* rootSaga() {
  yield all([fork(getdocuments), fork(getDocumentreport)]);
}
