import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_EMPLOYEES,
  GET_EMPLOYEES_REPORT,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getEmployeesSuccess,
  getEmployeereportSuccess,
} from "./../actions/EmployeesActions";

export const token = (state) => state.token;

let licenseId = "";

// let userdata = localStorage.getItem(branchName + "_data");
// if (userdata != "" && userdata != null) {
//   let userData = JSON.parse(userdata);
//   if (userData != "" && userData != null && userData["id"] != undefined) {
//     licenseId = userData["id"];
//   }
// }

let userId = "";

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
const getEmployeesByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetEmployees?licenseId=" +
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
    .then((getEmployeesRes) => getEmployeesRes.data)
    .catch((error) => error);

const getEmployeeReports = async (
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
        "GetEmployeeReport?licenseId=" +
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
    .then((getEmployeesRes) => getEmployeesRes.data)
    .catch((error) => error);
/*Identities Module END Add, Get*/

//Identities Module start ADD, GET
function* getEmployeesById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getEmployeesRes = yield call(getEmployeesByGroupId, payload);
    if (getEmployeesRes.status) {
      yield put(getEmployeesSuccess(getEmployeesRes.data));
    } else {
      yield put(showErrorMessage(getEmployeesRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

function* getEmployeereportById({ payload }) {
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
    const getEmployeesRes = yield call(
      getEmployeeReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate,
      pageNumber,
      sortBy,
      perPage
    );
    if (getEmployeesRes.status) {
      yield put(getEmployeereportSuccess(getEmployeesRes.data));
    } else {
      yield put(showErrorMessage(getEmployeesRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//take Every function call
export function* getemployees() {
  yield takeEvery(GET_EMPLOYEES, getEmployeesById);
}
export function* getEmployeereport() {
  yield takeEvery(GET_EMPLOYEES_REPORT, getEmployeereportById);
}
export default function* rootSaga() {
  yield all([fork(getemployees), fork(getEmployeereport)]);
}
