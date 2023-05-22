import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE_LOGIN,
  SHOW_MESSAGE_FORGOT,
  SIGNIN_FACEBOOK_USER_SUCCESS,
  SIGNIN_GITHUB_USER_SUCCESS,
  SIGNIN_GOOGLE_USER_SUCCESS,
  SIGNIN_TWITTER_USER_SUCCESS,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER_SUCCESS,
  SIGNIN_USER_DNI_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
} from "constants/ActionTypes";
import { branchName } from "./../../util/config";

const INIT_STATE = {
  loader: false,
  alertMessage: "",
  showMessage: false,
  showMessageLogin: false,
  showMessageForgotSuccess: false,
  showMessageForgotError: false,
  initURL: "",
  authUser: localStorage.getItem(branchName + "_data"),
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        loader: false,
        alertMessage: action.payload,
        showMessage: true,
        // authUser: action.payload
      };
    }
    case FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        loader: false,
        alertMessage: action.payload,
        showMessageForgotSuccess: true,
        // authUser: action.payload
      };
    }
    case SIGNUP_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SIGNIN_USER_SUCCESS: {
      if (branchName === "EstabanellVisit") {
        localStorage.setItem("EstabanellVisit_language", "English");
      } else if (branchName === "Prevengest") {
        localStorage.setItem("Prevengest_language", "English");
      } else if (branchName === "Nunegal") {
        localStorage.setItem("Nunegal_language", "English");
      } else if (branchName === "Molins") {
        localStorage.setItem("Molins_language", "English");
      } else if (branchName === "Motumtech") {
        localStorage.setItem("Motumtech_language", "English");
      } else if (branchName === "Kiosk") {
        localStorage.setItem("Kiosk_language", "English");
      }
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SIGNIN_USER_DNI_SUCCESS: {
      if (branchName === "EstabanellVisit") {
        localStorage.setItem("EstabanellVisit_language", "English");
      } else if (branchName === "Prevengest") {
        localStorage.setItem("Prevengest_language", "English");
      } else if (branchName === "Nunegal") {
        localStorage.setItem("Nunegal_language", "English");
      } else if (branchName === "Molins") {
        localStorage.setItem("Molins_language", "English");
      } else if (branchName === "Motumtech") {
        localStorage.setItem("Motumtech_language", "English");
      } else if (branchName === "Kiosk") {
        localStorage.setItem("Kiosk_language", "English");
      }

      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload,
      };
    }
    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        authUser: null,
        initURL: "/",
        loader: false,
      };
    }

    case SHOW_MESSAGE_LOGIN: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessageLogin: true,
        loader: false,
      };
    }
    case SHOW_MESSAGE_FORGOT: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessageForgotError: true,
        loader: false,
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: "",
        showMessageLogin: false,
        showMessageForgotSuccess: false,
        showMessageForgotError: false,
        loader: false,
      };
    }

    case SIGNIN_GOOGLE_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SIGNIN_FACEBOOK_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SIGNIN_TWITTER_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case SIGNIN_GITHUB_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload,
      };
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true,
      };
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false,
      };
    }
    default:
      return state;
  }
};
