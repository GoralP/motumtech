import {
  SHOW_MESSAGE,
  GET_DEPARTMENT_SUCCESS_DATA,
  GET_DROPDOWN_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  GET_DROPDOWN,
} from "constants/ActionTypes";

const INIT_STATE = {
  loader: false,
  showMessage: false,
  get_department_res: "",
  get_dropdown_res: "",
  status: "Initial",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENT_SUCCESS_DATA: {
      return {
        ...state,
        get_department_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }

    case GET_DROPDOWN: {
      return {
        ...state,

        loader: true,
      };
    }
    case GET_DROPDOWN_SUCCESS_DATA: {
      return {
        ...state,
        get_dropdown_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_STATUS_INITIAL: {
      return {
        ...state,
        status: "Initial",
        loader: true,
      };
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        showMessage: true,
        loader: true,
        status: "Initial",
      };
    }
    default:
      return state;
  }
};
