import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { baseURL, branchName } from "./../../util/config";
import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider,
} from "../../firebase/firebase";
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER,
  SIGNIN_USER_DNI,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  USER_ROLE_PERMISSION,
} from "constants/ActionTypes";
import {
  showAuthMessage,
  showAuthMessageLogin,
  showAuthMessageForgot,
  userSignInWithDNISuccess,
  userSignInSuccess,
  userSignOutSuccess,
  userSignUpSuccess,
  forgotPasswordSuccess,
  changePasswordSuccess,
} from "../../appRedux/actions/Auth";
import {
  userFacebookSignInSuccess,
  userGithubSignInSuccess,
  userGoogleSignInSuccess,
  userTwitterSignInSuccess,
} from "../actions/Auth";
import axios from "axios";
import { message } from "antd";

let langName = "";
let authBasic = "";
var signInUserDNIWithEmailPasswordRequest = "";
let hURL = window.location.hostname;

const createUserWithEmailPasswordRequest = async (email, password) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await axios
    .post(
      baseURL + "ValidateLicence?lang=" + langName,
      {
        licenseKey: email,
        licenseCode: password,
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    .then((authUser) => authUser.data)
    .catch((error) => error);

if (
  hURL === "www.motumquod.com" ||
  hURL === "www.motumlabs.com" ||
  hURL === "motum.estabanell.cat"
) {
  signInUserDNIWithEmailPasswordRequest = async (Username, Password) =>
    await axios
      .post(
        baseURL + "IdentityLogin?lang=" + langName,
        {
          Username: Username,
          Password: Password,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((authUser) => authUser.data)
      .catch((error) => error);
} else {
  signInUserDNIWithEmailPasswordRequest = async (Username, Password) =>
    await axios
      .post(
        baseURL + "IdentityLogin?licenseId=4&lang=" + langName,
        {
          Username: Username,
          Password: Password,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((authUser) => authUser.data)
      .catch((error) => error);
}

const rolePermissionByUserIdRequest = async (payload) =>
  await axios
    .get(baseURL + "RolePermissiomByUserId?UserId=" + payload, {
      headers: {
        "content-type": "application/json",
      },
    })
    .then((rolePermission) => rolePermission.data)
    .catch((error) => error);

const forgotPasswordAPIRequest = async (dni) =>
  await axios
    .post(
      baseURL + "IdentityForgotpassword",
      {
        Username: dni,
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    .then((authUser) => authUser.data)
    .catch((error) => error);

const changePasswordAPIRequest = async (
  identityId,
  currentPassword,
  newPassword
) =>
  await axios
    .post(
      baseURL + "IdentityChangePassword",
      {
        IdentityId: identityId,
        OldPassword: currentPassword,
        NewPassword: newPassword,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: "Basic " + authBasic,
        },
      }
    )
    .then((authUser) => authUser.data)
    .catch((error) => error);

// const signOutRequest = async () =>
//   await  auth.signOut()
//     .then(authUser => authUser)
//     .catch(error => error);

const signInUserWithGoogleRequest = async () =>
  await auth
    .signInWithPopup(googleAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithFacebookRequest = async () =>
  await auth
    .signInWithPopup(facebookAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithGithubRequest = async () =>
  await auth
    .signInWithPopup(githubAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

const signInUserWithTwitterRequest = async () =>
  await auth
    .signInWithPopup(twitterAuthProvider)
    .then((authUser) => authUser)
    .catch((error) => error);

function* createUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  try {
    const signUpUser = yield call(
      createUserWithEmailPasswordRequest,
      email,
      password
    );
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem(branchName + "_data", signUpUser.user.uid);
      yield put(userSignUpSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGoogle() {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      yield put(userGoogleSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      yield put(userFacebookSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      yield put(userGithubSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage("Your request has been canceled."));
      } else {
        yield put(showAuthMessage(signUpUser.message));
      }
    } else {
      yield put(userTwitterSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  langName = localStorage.getItem(branchName + "_language");

  try {
    const signInUser = yield call(
      signInUserWithEmailPasswordRequest,
      email,
      password
    );
    if (signInUser.status) {
      if (branchName === "EstabanellVisit") {
        localStorage.setItem(
          "EstabanellVisit_data",
          JSON.stringify(signInUser.data)
        );
      } else if (branchName === "Prevengest") {
        localStorage.setItem(
          "Prevengest_data",
          JSON.stringify(signInUser.data)
        );
      } else if (branchName === "Nunegal") {
        localStorage.setItem("Nunegal_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Molins") {
        localStorage.setItem("Molins_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Motumtech") {
        localStorage.setItem("Motumtech_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Kiosk") {
        localStorage.setItem("Kiosk_data", JSON.stringify(signInUser.data));
      }

      // localStorage.setItem(branchName+'_data', JSON.stringify(signInUser.data));
      yield put(userSignInSuccess(signInUser.data));
    } else {
      yield put(showAuthMessage(signInUser.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserDNIWithEmailPassword({ payload }) {
  const { Username, Password } = payload;

  langName = localStorage.getItem(branchName + "_language");
  try {
    const signInUser = yield call(
      signInUserDNIWithEmailPasswordRequest,
      Username,
      Password
    );
    if (signInUser.status) {
      if (branchName === "EstabanellVisit") {
        localStorage.setItem(
          "EstabanellVisit_data",
          JSON.stringify(signInUser.data)
        );
      } else if (branchName === "Prevengest") {
        localStorage.setItem(
          "Prevengest_data",
          JSON.stringify(signInUser.data)
        );
      } else if (branchName === "Nunegal") {
        localStorage.setItem("Nunegal_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Molins") {
        localStorage.setItem("Molins_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Motumtech") {
        localStorage.setItem("Motumtech_data", JSON.stringify(signInUser.data));
      } else if (branchName === "Kiosk") {
        localStorage.setItem("Kiosk_data", JSON.stringify(signInUser.data));
      }
      yield put(userSignInWithDNISuccess(signInUser.data));
    } else {
      yield put(showAuthMessageLogin(signInUser.message));
    }
  } catch (error) {
    yield put(showAuthMessageLogin(error));
  }
}

function* setRolePermissionWithUserId({ payload }) {
  try {
    const rolePermission = yield call(rolePermissionByUserIdRequest, payload);
    if (rolePermission.status) {
      let userdata = localStorage.getItem(branchName + "_data");
      let userData = JSON.parse(userdata);
      userData.Permission = rolePermission.data;
      localStorage.setItem(branchName + "_data", JSON.stringify(userData));
    } else {
      yield put(showAuthMessage(rolePermission.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* forgotPasswordAPI({ payload }) {
  const { dni } = payload;
  langName = localStorage.getItem(branchName + "_language");
  try {
    const signInUser = yield call(forgotPasswordAPIRequest, dni);
    if (signInUser.status) {
      yield put(forgotPasswordSuccess(signInUser.message));
    } else {
      yield put(showAuthMessageForgot(signInUser.message));
    }
  } catch (error) {
    yield put(showAuthMessageForgot(error));
  }
}

function* changePasswordAPI({ payload }) {
  const { identityId, currentPassword, newPassword } = payload;
  langName = localStorage.getItem(branchName + "_language");
  authBasic = localStorage.getItem("setAuthToken");
  try {
    const signInUser = yield call(
      changePasswordAPIRequest,
      identityId,
      currentPassword,
      newPassword
    );
    if (signInUser.status) {
      yield put(changePasswordSuccess(signInUser.message));
      message.success(signInUser.message);
    } else {
      yield put(showAuthMessage(signInUser.message));
      message.error(signInUser.message);
    }
  } catch (error) {
    yield put(showAuthMessage(error));
    message.error(error);
  }
}

function* signOut() {
  try {
    // const signOutUser = yield call(signOutRequest);
    // if (signOutUser === undefined) {
    //   localStorage.removeItem(branchName+'_data');
    //   yield put(userSignOutSuccess(signOutUser));
    // } else {
    //   yield put(showAuthMessage(signOutUser.message));
    // }
    if (branchName === "EstabanellVisit") {
      localStorage.removeItem("EstabanellVisit_data");
      localStorage.removeItem("EstabanellVisit_language");
    } else if (branchName === "Prevengest") {
      localStorage.removeItem("Prevengest_data");
      localStorage.removeItem("Prevengest_language");
    } else if (branchName === "Nunegal") {
      localStorage.removeItem("Nunegal_data");
      localStorage.removeItem("Nunegal_language");
    } else if (branchName === "Molins") {
      localStorage.removeItem("Molins_data");
      localStorage.removeItem("Molins_language");
    } else if (branchName === "Motumtech") {
      localStorage.removeItem("Motumtech_data");
      localStorage.removeItem("Motumtech_language");
    } else if (branchName === "Kiosk") {
      localStorage.removeItem("Kiosk_data");
      localStorage.removeItem("Kiosk_language");
    }
    yield put(userSignOutSuccess(signOutUser));
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signInUserDNI() {
  yield takeEvery(SIGNIN_USER_DNI, signInUserDNIWithEmailPassword);
}

export function* rolePermissionUser() {
  yield takeEvery(USER_ROLE_PERMISSION, setRolePermissionWithUserId);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export function* forgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPasswordAPI);
}

export function* changePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePasswordAPI);
}

export default function* rootSaga() {
  yield all([
    fork(signInUser),
    fork(createUserAccount),
    fork(signInWithGoogle),
    fork(signInWithFacebook),
    fork(signInWithTwitter),
    fork(signInWithGithub),
    fork(signOutUser),
    fork(signInUserDNI),
    fork(rolePermissionUser),
    fork(forgotPassword),
    fork(changePassword),
  ]);
}
