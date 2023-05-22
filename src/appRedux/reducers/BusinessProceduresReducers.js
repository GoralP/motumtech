import {
  SHOW_MESSAGE11,
  GET_MOREAPPFORMDATA_DATA,
  GET_MOREAPPFORMDATA_SUCCESS_DATA,
  GET_MOREAPPFORMDATA_FAIL_DATA,
  GET_DEVICE_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  GET_PROCEDURE_SUCCESS_DATA,
  GET_DETAIL_PROCEDURE_SUCCESS_DATA,
  GET_STATUS_STARTING,
  RESUBMIT_TO_GIA_PENDING,
  RESUBMIT_TO_GIA_SUCCESS,
  RESUBMIT_TO_GIA_FAILURE,
  GET_COUNTER_PENDING,
  GET_COUNTER_SUCCESS,
  GET_COUNTER_FAILURE,
  RELAUNCH_DATA_PENDING,
  RELAUNCH_DATA_SUCCESS,
  RELAUNCH_DATA_FAILURE,
  GET_EXPORT_PENDING,
  GET_EXPORT_SUCCESS,
  GET_EXPORT_FAILURE,
} from "constants/ActionTypes";

const INIT_STATE = {
  loader: false,
  showMessage: [],
  get_formdata_res: [],
  get_formdata_status: false,
  get_device_res: [],
  get_procedure_res: [],
  get_detail_procedure: [],
  status: "Initial",
  successStatus: false,
  successData: { status: false, message: "" },
  giaData: {
    data: "",
    error: false,
    message: null,
  },
  getCounter: {
    data: null,
    error: false,
    message: null,
  },
  relaunch: {
    data: "",
    error: false,
    message: null,
  },
  getexport: {
    data: null,
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROCEDURE_SUCCESS_DATA: {
      return {
        ...state,
        get_procedure_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_DETAIL_PROCEDURE_SUCCESS_DATA: {
      return {
        ...state,
        get_detail_procedure: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_MOREAPPFORMDATA_DATA: {
      return {
        ...state,
        loader: true,
      };
    }

    case GET_MOREAPPFORMDATA_FAIL_DATA: {
      return {
        ...state,
        get_formdata_status: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_MOREAPPFORMDATA_SUCCESS_DATA: {
      return {
        ...state,
        get_formdata_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_DEVICE_SUCCESS_DATA: {
      return {
        ...state,
        get_device_res: action.payload,
        // loader: false,
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
    case GET_STATUS_STARTING: {
      return {
        ...state,
        status: "Initial",
        loader: true,
      };
    }
    case SHOW_MESSAGE11: {
      return {
        ...state,
        showMessage: action.payload,
        // get_detail_procedure: [],
        // loader: true,
        // status : 'Dataloaded',
      };
    }

    case RESUBMIT_TO_GIA_PENDING:
      return {
        ...state,
        loader: true,
        giaData: {
          // loading: true,
          data: null,
          error: false,
          message: null,
        },
      };

    case RESUBMIT_TO_GIA_SUCCESS:
      return {
        ...state,
        loader: false,
        giaData: {
          // loading: false,
          data: action.payload,
          error: false,
          message: null,
        },
      };

    case RESUBMIT_TO_GIA_FAILURE:
      return {
        ...state,
        loader: false,
        giaData: {
          // loading: false,
          data: null,
          error: true,
          message: action.message,
        },
      };

    case GET_COUNTER_PENDING:
      return {
        ...state,
        loader: true,
        getCounter: {
          data: null,
          error: false,
          message: null,
        },
      };
    case GET_COUNTER_SUCCESS:
      return {
        ...state,
        loader: false,
        getCounter: {
          data: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_COUNTER_FAILURE:
      return {
        ...state,
        loader: false,
        getCounter: {
          data: null,
          error: true,
          message: action.message,
        },
      };

    case RELAUNCH_DATA_PENDING:
      return {
        ...state,
        loader: true,
        relaunch: {
          data: null,
          error: false,
          message: null,
        },
      };

    case RELAUNCH_DATA_SUCCESS:
      return {
        ...state,
        loader: false,
        relaunch: {
          data: action.payload,
          error: false,
          message: null,
        },
      };

    case RELAUNCH_DATA_FAILURE:
      return {
        ...state,
        loader: false,
        relaunch: {
          data: null,
          error: true,
          message: action.message,
        },
      };

    case GET_EXPORT_PENDING:
      return {
        ...state,
        loader: true,
        getexport: {
          data: null,
          error: false,
          message: null,
        },
      };
    case GET_EXPORT_SUCCESS:
      return {
        ...state,
        loader: false,
        getexport: {
          data: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_EXPORT_FAILURE:
      return {
        ...state,
        loader: false,
        getexport: {
          data: null,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
