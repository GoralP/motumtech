import {
  GET_PROCESS_SUCCESS_DATA,
  GET_PROCESS_WORK_ISTRUCTION_SUCCESS_DATA,
  GET_PROCESS_WORK_INSTRUCTION_DATA,
  SHOW_MESSAGE,
  GET_STATUS_INITIAL,
  GET_PROCESS_DROPDOWN_SUCCESS,
  GET_SYNCHRONIZE_PENDING,
  GET_SYNCHRONIZE_SUCCESS,
  GET_SYNCHRONIZE_FAILURE,
  GET_PROCESS_DATA,
} from "constants/ActionTypes";

const INIT_STATE = {
  loader: false,
  showMessage: false,
  get_process_res: "",
  get_process_work_res: "",
  get_process_dropdown: "",
  status: "Initial",
  getSynchronizeData: {
    // loading: false,
    syncData: null,
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROCESS_DATA: {
      return {
        ...state,
        loader: true,
      };
    }
    case GET_PROCESS_SUCCESS_DATA: {
      return {
        ...state,
        get_process_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }

    case GET_PROCESS_WORK_INSTRUCTION_DATA: {
      return {
        ...state,
        loader: true,
      };
    }

    case GET_PROCESS_WORK_ISTRUCTION_SUCCESS_DATA: {
      return {
        ...state,
        get_process_Work_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_PROCESS_DROPDOWN_SUCCESS: {
      return {
        ...state,
        get_process_dropdown: action.payload,
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

    case GET_SYNCHRONIZE_PENDING:
      return {
        ...state,
        loader: true,
        getSynchronizeData: {
          // loading: true,
          syncData: null,
          error: false,
          message: null,
        },
      };

    case GET_SYNCHRONIZE_SUCCESS:
      return {
        ...state,
        loader: false,
        getSynchronizeData: {
          // loading: false,
          syncData: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_SYNCHRONIZE_FAILURE:
      return {
        ...state,
        loader: false,
        getSynchronizeData: {
          // loading: false,
          syncData: null,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
