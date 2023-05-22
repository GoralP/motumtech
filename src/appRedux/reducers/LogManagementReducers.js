import {
  GET_LOG_MANAGEMENT_DATA_PENDING,
  GET_LOG_MANAGEMENT_DATA_SUCCESS,
  GET_LOG_MANAGEMENT_DATA_FAILURE,
} from "constants/ActionTypes";

const INIT_STATE = {
  status: "Initial",
  loader: false,

  logData: {
    data: null,
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOG_MANAGEMENT_DATA_PENDING:
      return {
        ...state,
        loader: true,
        logData: {
          data: null,
          error: false,
          message: null,
        },
      };
    case GET_LOG_MANAGEMENT_DATA_SUCCESS:
      return {
        ...state,
        loader: false,
        logData: {
          data: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_LOG_MANAGEMENT_DATA_FAILURE:
      return {
        ...state,
        loader: false,
        logData: {
          data: null,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
