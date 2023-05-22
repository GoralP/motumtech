import {
  SHOW_MESSAGE,
  GET_ROLE_SUCCESS_DATA,
  GET_PERMISSION_SUCCESS_DATA,
  SAVE_PERMISSION_SUCCESS_DATA,
  GET_STATUS_INITIAL,
  GIA_DATA_PENDING,
  GIA_DATA_SUCCESS,
  GIA_DATA_FAILURE,
  GET_GIA_DATA_PENDING,
  GET_GIA_DATA_SUCCESS,
  GET_GIA_DATA_FAILURE,
} from "constants/ActionTypes";

const INIT_STATE = {
  loader: false,
  showMessage: false,
  get_role_res: "",
  get_permission_res: "",
  changed_permission_data: "",
  status: "Initial",
  addGiaData: { loading: false, giaData: "", error: false, message: null },
  getGiaConfig: {
    loading: false,
    getGiaData: null,
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ROLE_SUCCESS_DATA: {
      return {
        ...state,
        get_role_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case GET_PERMISSION_SUCCESS_DATA: {
      return {
        ...state,
        get_permission_res: action.payload,
        loader: false,
        status: "Dataloaded",
      };
    }
    case SAVE_PERMISSION_SUCCESS_DATA: {
      return {
        ...state,
        changed_permission_data: action.payload,
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

    case GIA_DATA_PENDING:
      return {
        ...state,
        addGiaData: {
          loading: true,
          giaData: null,
          error: false,
          message: null,
        },
      };

    case GIA_DATA_SUCCESS:
      return {
        ...state,
        addGiaData: {
          loading: false,
          giaData: action.payload,
          error: false,
          message: null,
        },
      };

    case GIA_DATA_FAILURE:
      return {
        ...state,
        addGiaData: {
          loading: false,
          giaData: null,
          error: true,
          message: action.message,
        },
      };

    case GET_GIA_DATA_PENDING:
      return {
        ...state,
        getGiaConfig: {
          loading: true,
          getGiaData: null,
          error: false,
          message: null,
        },
      };
    case GET_GIA_DATA_SUCCESS:
      return {
        ...state,
        getGiaConfig: {
          loading: false,
          getGiaData: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_GIA_DATA_FAILURE:
      return {
        ...state,
        getGiaConfig: {
          loading: false,
          getGiaData: null,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
