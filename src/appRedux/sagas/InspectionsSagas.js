import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_INSPECTIONS,
  GET_CALENDAR,
  SAVE_CALENDAR_DATA,
  GET_INITIAL_SIGNIN_STATUS,
  GET_INSPECTIONS_REPORT,
  VALIDATE_INITIAL_DIRECTORY,
  SET_DIRECTORY_TOKEN,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getInspectionsSuccess,
  getCalendarSuccess,
  getInitialSigninStatusSuccess,
  getInspectionreportSuccess,
  saveCalendarSuccess,
  validateInitialDirectorySuccess,
  setDirectoryTokenSuccess,
} from "./../actions/InspectionsActions";
import { message } from "antd";
import { showIdentitiersLoader } from "../actions/IdentitiesActions";

export const token = (state) => state.token;

let userId = "";
let identityId = "";

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

/*Inspection Module Start Add, Get*/

//get inspection
const getInspectionsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "InspectionList?licenseId=" +
        userId +
        "&deviceId=&PageNumber=" +
        payloadData.pageNumber +
        "&Sort=" +
        payloadData.sortBy,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getInspectionsRes) => getInspectionsRes.data)
    .catch((error) => error);

//get calendat list
const getCalendarByCodeAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetOutLookTokenByCode?LicenseId=" +
        userId +
        "&Code=" +
        payloadData.code +
        "&RedirectUrl=" +
        payloadData.redirectURL,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getCalendarRes) => getCalendarRes.data)
    .catch((error) => error);

const saveCalendarAPI = async (payloadData) =>
  await axios
    .post(baseURL + "UpdateCalendarId", payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getsaveResult) => getsaveResult.data)
    .catch((error) => error);

const getStatusByLicenseId = async () =>
  await axios
    .get(baseURL + "ValidateOutLookToken?LicenseId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getStatusRes) => getStatusRes.data)
    .catch((error) => error);

const getDirectoryStatusByLicenseId = async () =>
  await axios
    .get(baseURL + "ValidateAzureDirectoryToken?LicenseId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getDirectoryStatus) => getDirectoryStatus.data)
    .catch((error) => error);

const setDirectoryTokenByCodeAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetOutLookTokenByCodeForAzureDirectory?LicenseId=" +
        userId +
        "&Code=" +
        payloadData.code +
        "&RedirectUrl=" +
        payloadData.redirectURL,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((setTokenRes) => setTokenRes.data)
    .catch((error) => error);

const getInspectionReports = async (
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
        "GetInspectionReport?licenseId=" +
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
    .then((getInspectionsRes) => getInspectionsRes.data)
    .catch((error) => error);
/*Inspection Module END Add, Get*/

//Inspection Module start ADD, GET
function* getInspectionsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");

  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getInspectionsRes = yield call(getInspectionsByGroupId, payload);
    if (getInspectionsRes.status) {
      yield put(getInspectionsSuccess(getInspectionsRes.data));
    } else {
      yield put(showErrorMessage(getInspectionsRes.message));
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* getCalendarByCode({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");

  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getCalendarResult = yield call(getCalendarByCodeAPI, payload);
    if (getCalendarResult.status) {
      yield put(getCalendarSuccess(getCalendarResult.data));
    } else {
      var calRes = [];
      yield put(getCalendarSuccess(calRes));
      // message.error(getCalendarResult.message);
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}

function* saveCalendar({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  // const {payloadData} = payload;
  try {
    var myObject = Object.assign({}, payload);
    const getsaveResult = yield call(saveCalendarAPI, myObject);
    if (getsaveResult.status) {
      message.success(getsaveResult.message);
      yield put(saveCalendarSuccess());
    } else {
      message.error(getsaveResult.message);
      yield put(saveCalendarSuccess());
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}

function* getSigninStatus() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getSigninRes = yield call(getStatusByLicenseId);
    if (getSigninRes.status) {
      yield put(getInitialSigninStatusSuccess(getSigninRes.data));
    } else {
      yield put(getInitialSigninStatusSuccess(getSigninRes.data));
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* getActiveDirectoryStatus() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getDirectoryRes = yield call(getDirectoryStatusByLicenseId);
    if (getDirectoryRes.status) {
      yield put(validateInitialDirectorySuccess(getDirectoryRes.status));
    } else {
      yield put(validateInitialDirectorySuccess(getDirectoryRes.status));
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}

function* setDirectoryTokenByCode({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const setTokenResult = yield call(setDirectoryTokenByCodeAPI, payload);
    if (setTokenResult.status) {
      yield put(setDirectoryTokenSuccess(setTokenResult.status));
    } else {
      yield put(setDirectoryTokenSuccess(setTokenResult.status));
      // message.error(setTokenResult.message);
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}
//Inspection Module end ADD, GET

function* getInspectionreportById({ payload }) {
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
    const getInspectionsRes = yield call(
      getInspectionReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate,
      pageNumber,
      sortBy,
      perPage
    );
    if (getInspectionsRes.status) {
      yield put(getInspectionreportSuccess(getInspectionsRes.data));
    } else {
      // yield put(showErrorMessage(getInspectionsRes.message));
      message.error(getInspectionsRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));

    message.error(error);
  }
}

//take Every function call
export function* getinspections() {
  yield takeEvery(GET_INSPECTIONS, getInspectionsById);
}
export function* getInspectionreport() {
  yield takeEvery(GET_INSPECTIONS_REPORT, getInspectionreportById);
}
export function* getcalendar() {
  yield takeEvery(GET_CALENDAR, getCalendarByCode);
}
export function* addCalendar() {
  yield takeEvery(SAVE_CALENDAR_DATA, saveCalendar);
}
export function* getStatus() {
  yield takeEvery(GET_INITIAL_SIGNIN_STATUS, getSigninStatus);
}
export function* getDirectory() {
  yield takeEvery(VALIDATE_INITIAL_DIRECTORY, getActiveDirectoryStatus);
}
export function* setToken() {
  yield takeEvery(SET_DIRECTORY_TOKEN, setDirectoryTokenByCode);
}
export default function* rootSaga() {
  yield all([
    fork(getinspections),
    fork(getInspectionreport),
    fork(getcalendar),
    fork(addCalendar),
    fork(getStatus),
    fork(getDirectory),
    fork(setToken),
  ]);
}
