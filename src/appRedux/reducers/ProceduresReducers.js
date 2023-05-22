import {
  HIDE_MESSAGE,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  PROCEDURES_STATUS_SHOW_SUCCESS_MESSAGE,
  GET_PROCEDURES_SUCCESS_DATA,
  GET_PROCEDURES_REPORT_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  GET_PROCEDURE_FORM_SUCCESS_DATA,
  CLOSE_PROCEDURE_MODAL,
  OPEN_PROCEDURE_MODAL,
  VIEW_PROCEDURE_DETAIL_PENDING,
  VIEW_PROCEDURE_DETAIL_SUCCESS,
  VIEW_PROCEDURE_DETAIL_FAILURE,
} from "constants/ActionTypes";

// import States from "../states/states";

const INIT_STATE = {
  loader: false,
  alertMessage: "",
  successMessage: "",
  showMessage: false,
  showSuccessMessage: false,
  initURL: "",
  get_procedures_res: "",
  get_procedure_form_res: "",
  proceduremodalclosecall: false,
  status: "Initial",
  singleProcedureById: {
    viewData: null,
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: true,
        status: "Initial",
      };
    }

    case PROCEDURES_STATUS_SHOW_SUCCESS_MESSAGE: {
      return {
        ...state,
        // authUser: null,
        successMessage: action.payload,
        showSuccessMessage: true,
        loader: true,
        status: "Initial",
      };
    }
    case GET_STATUS_INITIAL: {
      return {
        ...state,
        status: "Initial",
        loader: true,
      };
    }
    case GET_PROCEDURES_SUCCESS_DATA: {
      return {
        ...state,
        // authUser: null,
        get_procedures_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_PROCEDURES_REPORT_SUCCESS_DATA: {
      return {
        ...state,
        // authUser: null,
        get_procedures_res: action.payload,
        loader: false,
        status: "Datareortloaded",
      };
    }
    case GET_PROCEDURE_FORM_SUCCESS_DATA: {
      return {
        ...state,
        get_procedure_form_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case CLOSE_PROCEDURE_MODAL: {
      return {
        ...state,
        proceduremodalclosecall: action.payload,
      };
    }
    case OPEN_PROCEDURE_MODAL: {
      return {
        ...state,
        proceduremodalclosecall: action.payload,
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: "",
        successMessage: "",
        showMessage: false,
        showSuccessMessage: false,
        loader: false,
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

    case VIEW_PROCEDURE_DETAIL_PENDING:
      return {
        ...state,
        loader: true,
        singleProcedureById: {
          viewData: null,
          error: false,
          message: null,
        },
      };
    case VIEW_PROCEDURE_DETAIL_SUCCESS:
      return {
        ...state,
        loader: false,
        singleProcedureById: {
          viewData: action.payload,
          error: false,
          message: null,
        },
      };
    case VIEW_PROCEDURE_DETAIL_FAILURE:
      return {
        ...state,
        loader: false,
        singleProcedureById: {
          viewData: null,
          error: true,
          message: action.message,
        },
      };
    default:
      return state;
  }
};
// export default INIT_STATE;
