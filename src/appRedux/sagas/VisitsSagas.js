import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, deskoURL, branchName } from "./../../util/config";
import {
  GET_VISITS,
  GET_VISITS_REPORT,
  SAVE_VISIT_DATA,
  GET_PROCEDURE_TYPE,
  READ_DESKO_SERVICE_DATA,
  GET_IDENTITY_DETAIL,
  GET_SCHEDULE_VISIT,
  GET_SCHEDULE_VISITS_LIST,
  GET_EVENT_AND_INVITEES,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getVisitsSuccess,
  getVisitreportSuccess,
  getProcedureTypeSuccess,
  getDeskoServiceDataSuccess,
  saveVisitSuccess,
  saveVisitUnSuccess,
  getIdentityDetailsSuccess,
  getScheduleVisitSuccess,
  getScheduleVisitsListSuccess,
  getScheduleStatusSuccess,
} from "./../actions/VisitsActions";
import { message } from "antd";

export const token = (state) => state.token;

let userId = "";
let langName = "";

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

/*Visit Module Start Add, Get*/

//get visit
const getVisitsByGroupId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetVisitList?licenseId=" +
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
    .then((getVisitsRes) => getVisitsRes.data)
    .catch((error) => error);

//read desko service continuously to get data
const readDeskoServiceContinuous = async () =>
  await axios
    .get(deskoURL + "ReadDeskoData", { mode: "cors" })
    .then((getDeskoDataResult) => getDeskoDataResult.data)
    .catch((error) => error);

//get identity details if DNI exist
const getIdentityByDNIAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetIdentityByDNI?LicenseId=" +
        userId +
        "&DNI=" +
        payloadData.DNI,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getIdentityRes) => getIdentityRes.data)
    .catch((error) => error);

//get nearest scheduled visit data for exist DNI by id
const getScheduledVisitByIdAPI = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetScheduleVisitByDNI?LicenseId=" +
        userId +
        "&IdentityId=" +
        payloadData.IdentityId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getScheduledVisitRes) => getScheduledVisitRes.data)
    .catch((error) => error);

//get all scheduled visit data
const getScheduleVisitsListByIdAPI = async () =>
  await axios
    .get(baseURL + "GetScheduleVisitList?LicenseId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getScheduleVisitsListRes) => getScheduleVisitsListRes.data)
    .catch((error) => error);

//save visit
const saveVisitAPIcall = async (payloadData) =>
  await axios
    .post(
      baseURL + payloadData.saveType + "?lang=" + langName,
      payloadData.data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getsaveResult) => getsaveResult.data)
    .catch((error) => error);

//get visit report
const getVisitReports = async (
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
        "GetVisitReport?licenseId=" +
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
    .then((getVisitsRes) => getVisitsRes.data)
    .catch((error) => error);

//get procedure types
const getProcedureTypeFromAPI = async () =>
  await axios
    .get(baseURL + "GetVisitProcedure?licenseId=" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getProcedureTypeRes) => getProcedureTypeRes.data)
    .catch((error) => error);

//get events and invitees API call
const getEventAndInvitesAPI = async () =>
  await axios
    .get(
      baseURL +
        "GetEventAndInviteesByLicense?LicenseId=" +
        userId +
        "&lang=" +
        langName,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getEventInviteeRes) => getEventInviteeRes.data)
    .catch((error) => error);
/*Visit Module END Add, Get*/

//Visit Module start ADD, GET
function* getVisitsById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getVisitsRes = yield call(getVisitsByGroupId, payload);
    if (getVisitsRes.status) {
      yield put(getVisitsSuccess(getVisitsRes.data));
    } else {
      // yield put(showErrorMessage(getVisitsRes.message));
      message.error(getVisitsRes.message);
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}

//Read and get data from desko service continuously
function* getDeskoServiceData() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getDeskoDataRes = yield call(readDeskoServiceContinuous);
    if (getDeskoDataRes.status) {
      yield put(getDeskoServiceDataSuccess(getDeskoDataRes.responseObj));
    } else {
      yield put(getDeskoServiceDataSuccess(getDeskoDataRes.responseObj));
      // yield put(showErrorMessage(getDeskoDataRes.message));
    }
  } catch (error) {
    message.error(error);
    // yield put(showErrorMessage(error));
  }
}

//Get Identity Details if DNI exist
function* getIdentityByDNI({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getDetailRes = yield call(getIdentityByDNIAPI, payload);
    if (getDetailRes.status) {
      yield put(getIdentityDetailsSuccess(getDetailRes));
    } else {
      yield put(getIdentityDetailsSuccess(getDetailRes));
      // yield put(showErrorMessage(getDetailRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//Get schedule visit by id
function* getScheduledVisitById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getScheduleRes = yield call(getScheduledVisitByIdAPI, payload);
    if (getScheduleRes.status) {
      yield put(getScheduleVisitSuccess(getScheduleRes));
    } else {
      yield put(getScheduleVisitSuccess(getScheduleRes));
      // yield put(showErrorMessage(getScheduleRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//Get schedule visit list by id
function* getScheduleVisitsListById() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getScheduleListRes = yield call(getScheduleVisitsListByIdAPI);
    if (getScheduleListRes.status) {
      yield put(getScheduleVisitsListSuccess(getScheduleListRes.data));
      yield put(getScheduleStatusSuccess());
    } else {
      message.error(getScheduleListRes.message);
      // yield put(getScheduleVisitSuccess(getScheduleListRes));
      // yield put(showErrorMessage(getScheduleListRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//Save visit
function* saveVisit({ payload }) {
  langName = localStorage.getItem(branchName + "_language");
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const getsaveResult = yield call(saveVisitAPIcall, payload);
    if (getsaveResult.status) {
      message.success(getsaveResult.message);
      yield put(saveVisitSuccess(getsaveResult));
      var payloadData = { pageNumber: 1, sortBy: "-VisitId", perPage: 10 };
      const getVisitRes1 = yield call(getVisitsByGroupId, payloadData);
      if (getVisitRes1.status) {
        yield put(getVisitsSuccess(getVisitRes1.data));
      } else {
        yield put(showErrorMessage(getVisitRes1.message));
      }

      const getScheduleListRes1 = yield call(getScheduleVisitsListByIdAPI);
      if (getScheduleListRes1.status) {
        yield put(getScheduleVisitsListSuccess(getScheduleListRes1.data));
      } else {
        message.error(getScheduleListRes1.message);
        // yield put(getScheduleVisitSuccess(getScheduleListRes));
        // yield put(showErrorMessage(getScheduleListRes.message));
      }
    } else {
      yield put(saveVisitUnSuccess(getsaveResult));
      message.error(getsaveResult.message);
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//Visit report Module start ADD, GET
function* getVisitreportById({ payload }) {
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
    const getVisitsRes = yield call(
      getVisitReports,
      dniNumber,
      currentReport,
      startingDate,
      endingDate,
      pageNumber,
      sortBy,
      perPage
    );
    if (getVisitsRes.status) {
      yield put(getVisitreportSuccess(getVisitsRes.data));
    } else {
      yield put(showErrorMessage(getVisitsRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}

//Procedure Type Module start ADD, GET
function* getProcedureTypeAPI() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getProcedureTypeRes = yield call(getProcedureTypeFromAPI);
    if (getProcedureTypeRes.status) {
      yield put(getProcedureTypeSuccess(getProcedureTypeRes.data));
    } else {
      yield put(showErrorMessage(getProcedureTypeRes.message));
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Get events and invitees API call
function* getEventAndInviteesById() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  langName = localStorage.getItem(branchName + "_language");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      userId = userData["id"];
    }
  }

  try {
    const getEventInviteesRes = yield call(getEventAndInvitesAPI);
    if (getEventInviteesRes.status) {
      // No need to get response & pass to success method
      // yield put(getProcedureTypeSuccess(getEventInviteesRes.data));
      // just recall schedule API for get fresh visits list on success
      const getScheduleListRes2 = yield call(getScheduleVisitsListByIdAPI);
      if (getScheduleListRes2.status) {
        yield put(getScheduleVisitsListSuccess(getScheduleListRes2.data));
      } else {
        message.error(getScheduleListRes2.message);
      }
    } else {
      // yield put(showErrorMessage(getEventInviteesRes.message));
      message.error(getEventInviteesRes.message);
    }
  } catch (error) {
    yield put(showErrorMessage(error));
  }
}
//Identities Module end ADD, GET

//take Every function call
export function* getvisits() {
  yield takeEvery(GET_VISITS, getVisitsById);
}
export function* getdeskodata() {
  yield takeEvery(READ_DESKO_SERVICE_DATA, getDeskoServiceData);
}
export function* getDetails() {
  yield takeEvery(GET_IDENTITY_DETAIL, getIdentityByDNI);
}
export function* getSchedules() {
  yield takeEvery(GET_SCHEDULE_VISIT, getScheduledVisitById);
}
export function* getScheduleLists() {
  yield takeEvery(GET_SCHEDULE_VISITS_LIST, getScheduleVisitsListById);
}
export function* getEventInvitees() {
  yield takeEvery(GET_EVENT_AND_INVITEES, getEventAndInviteesById);
}
export function* addVisit() {
  yield takeEvery(SAVE_VISIT_DATA, saveVisit);
}
export function* getVisitreport() {
  yield takeEvery(GET_VISITS_REPORT, getVisitreportById);
}
export function* getProcedureType() {
  yield takeEvery(GET_PROCEDURE_TYPE, getProcedureTypeAPI);
}
export default function* rootSaga() {
  yield all([
    fork(getvisits),
    fork(getdeskodata),
    fork(getDetails),
    fork(getSchedules),
    fork(addVisit),
    fork(getVisitreport),
    fork(getProcedureType),
    fork(getScheduleLists),
    fork(getEventInvitees),
  ]);
}
