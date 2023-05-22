import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_DEPARTMENT,
  GET_DROPDOWN,
  SAVE_DEPARTMENT_DATA,
  DELETE_DEPARTMENT_DATA,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getDepartmentsSuccess,
  getDropDownSuccess,
} from "./../actions/DepartmentActions";
import { message } from "antd";

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

const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + authBasic,
};

/*department api call section start*/
const getDepartmentByLicenseId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "DepartmentList?LicenseId=" +
        licenseId +
        "&PageNumber=" +
        payloadData.pageNumber +
        "&PerPage=" +
        payloadData.perPage +
        "&Sort=" +
        payloadData.sortBy,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getDepartmentRes) => getDepartmentRes.data)
    .catch((error) => error);

const getDropDownByLicenseId = async () =>
  await axios
    .get(baseURL + "GetMasterDropDown?LicenseId=" + licenseId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getDropDownRes) => getDropDownRes.data)
    .catch((error) => error);

const saveDepartmentAPIcall = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertDepartment", payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const deleteDepartmentAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteDepartment?LicenseId=" +
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

/*department api call section end*/

//department api call function start
function* getDepartmentById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getDepartmentRes = yield call(getDepartmentByLicenseId, payload);
    if (getDepartmentRes.status) {
      yield put(getDepartmentsSuccess(getDepartmentRes.data));
    } else {
      // yield put(showErrorMessage(getDepartmentRes.message));
      message.error(getDepartmentRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

//area & service api call function start
function* getDropdownList() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getDropDownRes = yield call(getDropDownByLicenseId);
    if (getDropDownRes.status) {
      yield put(getDropDownSuccess(getDropDownRes.data));
    } else {
      // yield put(showErrorMessage(getDropDownRes.message));
      message.error(getDropDownRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* saveDepartment({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    var departmentObject = Object.assign({}, payload);
    const getSaveResult = yield call(saveDepartmentAPIcall, departmentObject);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchDepartmentTerm: "",
      };
      const getDepartmentRes = yield call(
        getDepartmentByLicenseId,
        payloadData
      );
      if (getDepartmentRes.status) {
        yield put(getDepartmentsSuccess(getDepartmentRes.data));
      } else {
        // yield put(showErrorMessage(getDepartmentRes.message));
        message.error(getDepartmentRes.message);
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

function* deleteDepartment({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (userData !== "" && userData !== null && userData["id"] !== undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getDeleteResult = yield call(deleteDepartmentAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      var payloadData = {
        pageNumber: 1,
        sortBy: "-Id",
        perPage: 10,
        searchDepartmentTerm: "",
      };
      const getDepartmentRes = yield call(
        getDepartmentByLicenseId,
        payloadData
      );
      if (getDepartmentRes.status) {
        yield put(getDepartmentsSuccess(getDepartmentRes.data));
      } else {
        // yield put(showErrorMessage(getDepartmentRes.message));
        message.error(getDepartmentRes.message);
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
//department api call function end

//take every function call
export function* getDepartments() {
  yield takeEvery(GET_DEPARTMENT, getDepartmentById);
}
export function* getDropDowns() {
  yield takeEvery(GET_DROPDOWN, getDropdownList);
}
export function* addDepartment() {
  yield takeEvery(SAVE_DEPARTMENT_DATA, saveDepartment);
}
export function* removeDepartment() {
  yield takeEvery(DELETE_DEPARTMENT_DATA, deleteDepartment);
}
export default function* rootSaga() {
  yield all([
    fork(getDepartments),
    fork(getDropDowns),
    fork(addDepartment),
    fork(removeDepartment),
  ]);
}
