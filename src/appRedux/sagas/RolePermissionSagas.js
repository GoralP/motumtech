import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL, branchName } from "./../../util/config";
import {
  GET_ROLE,
  SAVE_ROLE_DATA,
  GET_PERMISSION,
  SAVE_PERMISSION_DATA,
  DELETE_ROLE_DATA,
  GIA_DATA_PENDING,
  GET_GIA_DATA_PENDING,
} from "./../../../src/constants/ActionTypes";
import {
  showErrorMessage,
  getRoleSuccess,
  getPermissionSuccess,
  getSavePermissionSuccess,
  addGiaDataSuccess,
  getGiaDataSuccess,
  getGiaDataFail,
} from "./../actions/RolePermissionActions";
import { message } from "antd";

export const token = (state) => state.token;
let licenseId = "";
let langName = "";
let identityId = "";

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

/*role api call section start*/
const getRoleByLicenseId = async (payloadData) =>
  await axios
    .get(baseURL + "GetRoles?licenseId=" + licenseId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getRoleRes) => getRoleRes.data)
    .catch((error) => error);

const saveRoleAPIcall = async (payloadData) =>
  await axios
    .post(baseURL + "UpsertRole?lang=" + langName, payloadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((getSaveRes) => getSaveRes.data)
    .catch((error) => error);

const getPermissionByLicenseId = async (payloadData) =>
  await axios
    .get(
      baseURL +
        "GetPermissionMatrix?licenseId=" +
        licenseId +
        "&RoleId=" +
        payloadData.RoleId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((getPermissionRes) => getPermissionRes.data)
    .catch((error) => error);

const savePermissionAPIcall = async (payloadData) =>
  await axios
    .post(
      baseURL +
        "SavePermissionMatrix?lang=" +
        langName +
        "&LicenseId=" +
        licenseId +
        "&RoleId=" +
        payloadData.RoleId,
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

const deleteRoleAPIcall = async (payloadData) =>
  await axios
    .delete(
      baseURL +
        "DeleteRole?lang=" +
        langName +
        "&LicenseId=" +
        licenseId +
        "&RoleId=" +
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

/*role api call section end*/

//role api call function start
function* getRoleById() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getRoleRes = yield call(getRoleByLicenseId);
    if (getRoleRes.status) {
      console.log("licenseId", licenseId);
      yield put(getRoleSuccess(getRoleRes.data));
    } else {
      // yield put(showErrorMessage(getRoleRes.message));
      message.error(getRoleRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* saveRole({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    var roleObject = Object.assign({}, payload);
    const getSaveResult = yield call(saveRoleAPIcall, roleObject);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      let userdata = localStorage.getItem(branchName + "_data");
      langName = localStorage.getItem(branchName + "_language");
      if (userdata != "" && userdata != null) {
        let userData = JSON.parse(userdata);
        if (userData != "" && userData != null && userData["id"] != undefined) {
          licenseId = userData["id"];
        }
      }
      const getRoleRes = yield call(getRoleByLicenseId);
      if (getRoleRes.status) {
        yield put(getRoleSuccess(getRoleRes.data));
      } else {
        // yield put(showErrorMessage(getRoleRes.message));
        message.error(getRoleRes.message);
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

function* getPermissionById({ payload }) {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }

  try {
    const getPermissionRes = yield call(getPermissionByLicenseId, payload);
    if (getPermissionRes.status) {
      yield put(getPermissionSuccess(getPermissionRes.data));
    } else {
      // yield put(showErrorMessage(getPermissionRes.message));
      message.error(getPermissionRes.message);
    }
  } catch (error) {
    // yield put(showErrorMessage(error));
    message.error(error);
  }
}

function* savePermission({ payload }) {
  authBasic = localStorage.getItem("setAuthToken");
  try {
    // var roleObject = Object.assign({}, payload);
    const getSaveResult = yield call(savePermissionAPIcall, payload);
    if (getSaveResult.status) {
      message.success(getSaveResult.message);
      yield put(getSavePermissionSuccess(getSaveResult.data));
      let userdata = localStorage.getItem(branchName + "_data");
      langName = localStorage.getItem(branchName + "_language");
      if (userdata != "" && userdata != null) {
        let userData = JSON.parse(userdata);
        if (userData != "" && userData != null && userData["id"] != undefined) {
          licenseId = userData["id"];
        }
      }
      const getPermissionRes = yield call(getPermissionByLicenseId, payload);
      if (getPermissionRes.status) {
        yield put(getPermissionSuccess(getPermissionRes.data));
      } else {
        // yield put(showErrorMessage(getPermissionRes.message));
        message.error(getPermissionRes.message);
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

function* deleteRole({ payload }) {
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
    const getDeleteResult = yield call(deleteRoleAPIcall, payload);
    if (getDeleteResult.status) {
      message.success(getDeleteResult.message);
      const getRoleRes = yield call(getRoleByLicenseId);
      if (getRoleRes.status) {
        yield put(getRoleSuccess(getRoleRes.data));
      } else {
        // yield put(showErrorMessage(getRoleRes.message));
        message.error(getRoleRes.message);
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
//role api call function end

//gia configuration add data start------------------------->

const giaConfigurationRequest = async (
  licenceId,
  userName,
  password,
  createdBy,
  updatedBy,
  entityCode,
  dataMasterToken
) =>
  await axios
    .post(
      baseURL + "PostGiaConfiguration",
      {
        licenceId: licenseId,
        userName: userName,
        password: password,
        createdBy: identityId,
        updatedBy: identityId,
        entityCode: entityCode,
        dataMasterToken: dataMasterToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => error);

function* createGiaConfiguration({ payload }) {
  const {
    licenceId,
    userName,
    password,
    createdBy,
    updatedBy,
    entityCode,
    dataMasterToken,
  } = payload;

  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (
      userData != "" &&
      userData != null &&
      userData["id"] != undefined &&
      userData["IdentityId"] != undefined
    ) {
      licenseId = userData["id"];
      identityId = userData["IdentityId"];
    }
  }

  try {
    const addConfigData = yield call(
      giaConfigurationRequest,
      licenceId,
      userName,
      password,
      createdBy,
      updatedBy,
      entityCode,
      dataMasterToken
    );
    if (addConfigData.status == true) {
      message.success(addConfigData.message);
      yield put(addGiaDataSuccess(addConfigData.data));
    }
  } catch (error) {
    message.error(error);
  }
}

export function* createGiaAccount() {
  yield takeEvery(GIA_DATA_PENDING, createGiaConfiguration);
}

//gia configuration add data end------------------------------------------->

//get gia configuration data start------------------------------------------->

const getGiaDataByIdRequest = async () =>
  await axios
    .get(baseURL + "GetGiaConfigurationList?licenseId=" + licenseId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authBasic,
      },
    })
    .then((res) => res.data)
    .catch((error) => error);

function* getGiaDataById() {
  let userdata = localStorage.getItem(branchName + "_data");
  authBasic = localStorage.getItem("setAuthToken");
  // langName = localStorage.getItem(branchName+'_language');
  if (userdata != "" && userdata != null) {
    let userData = JSON.parse(userdata);
    if (userData != "" && userData != null && userData["id"] != undefined) {
      licenseId = userData["id"];
    }
  }
  try {
    const response = yield call(getGiaDataByIdRequest);
    if (response.status == true) {
      console.log("licenseId", licenseId);
      yield put(getGiaDataSuccess(response.data));
    }
  } catch (error) {
    yield put(getGiaDataFail(error.response));
    message.error(error);
  }
}

export function* getGiaDataByIdAccount() {
  yield takeEvery(GET_GIA_DATA_PENDING, getGiaDataById);
}

//get gia configuration data end------------------------------------------->

//take every function call
export function* getRole() {
  yield takeEvery(GET_ROLE, getRoleById);
}
export function* addRole() {
  yield takeEvery(SAVE_ROLE_DATA, saveRole);
}
export function* getPermission() {
  yield takeEvery(GET_PERMISSION, getPermissionById);
}
export function* addPermission() {
  yield takeEvery(SAVE_PERMISSION_DATA, savePermission);
}
export function* removeRole() {
  yield takeEvery(DELETE_ROLE_DATA, deleteRole);
}
export default function* rootSaga() {
  yield all([
    fork(getRole),
    fork(addRole),
    fork(getPermission),
    fork(addPermission),
    fork(removeRole),
    fork(createGiaAccount),
    fork(getGiaDataByIdAccount),
  ]);
}
