import {
  SELECT_PROCEDURE_PENDING,
  SELECT_PROCEDURE_SUCCESS,
  SELECT_PROCEDURE_FAILURE,
  GET_PROCEDURE_CONFIG_PENDING,
  GET_PROCEDURE_CONFIG_SUCCESS,
  GET_PROCEDURE_CONFIG_FAILURE,
  GET_PROCEDURE_BY_ID_PENDING,
  GET_PROCEDURE_BY_ID_SUCCESS,
  GET_PROCEDURE_BY_ID_FAILURE,
  ADD_PROCEDURE_CONFIG_PENDING,
  ADD_PROCEDURE_CONFIG_SUCCESS,
  ADD_PROCEDURE_CONFIG_FAILURE,
  UPDATE_PROCEDURE_PENDING,
  UPDATE_PROCEDURE_SUCCESS,
  UPDATE_PROCEDURE_FAILURE,
  GET_STATUS_INITIAL,
  GET_STATUS_STARTING,
  CLEAR_DATA,
  DELETE_PROCEDURE_PENDING,
  DELETE_PROCEDURE_SUCCESS,
  DELETE_PROCEDURE_FAILURE,
} from "constants/ActionTypes";

const INIT_STATE = {
  status: "Initial",
  loader: false,
  selectProcedure: {
    loading: false,
    procedureData: null,
    error: false,
    message: null,
  },
  procedureConfig: {
    loading: false,
    procedureconfigData: null,
    error: false,
    message: null,
  },
  procedureById: {
    loading: false,
    procedureconfigByID: null,
    error: false,
    message: null,
  },
  addProcessConfig: {
    loading: false,
    data: "",
    error: false,
    message: null,
  },
  updateProcessConfig: {
    loading: false,
    updatedata: "",
    error: false,
    message: null,
  },
  deleteProcedureById: { loading: false, error: false, message: null },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SELECT_PROCEDURE_PENDING:
      return {
        ...state,
        loader: true,
        selectProcedure: {
          // loading: true,
          procedureData: null,
          error: false,
          message: null,
        },
      };
    case SELECT_PROCEDURE_SUCCESS:
      return {
        ...state,
        loader: false,
        selectProcedure: {
          // loading: false,
          procedureData: action.payload,
          error: false,
          message: null,
        },
      };
    case SELECT_PROCEDURE_FAILURE:
      return {
        ...state,
        loader: false,
        selectProcedure: {
          // loading: false,
          procedureData: null,
          error: true,
          message: action.message,
        },
      };

    case GET_PROCEDURE_CONFIG_PENDING:
      return {
        ...state,
        loader: true,
        procedureConfig: {
          // loading: true,
          procedureconfigData: null,
          error: false,
          message: null,
        },
      };
    case GET_PROCEDURE_CONFIG_SUCCESS:
      return {
        ...state,
        loader: false,
        procedureConfig: {
          // loading: false,
          procedureconfigData: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_PROCEDURE_CONFIG_FAILURE:
      return {
        ...state,
        loader: false,
        procedureConfig: {
          // loading: false,
          procedureconfigData: null,
          error: true,
          message: action.message,
        },
      };

    case GET_PROCEDURE_BY_ID_PENDING:
      return {
        ...state,
        loader: true,
        procedureById: {
          // loading: true,
          procedureconfigByID: null,
          error: false,
          message: null,
        },
      };
    case GET_PROCEDURE_BY_ID_SUCCESS:
      return {
        ...state,
        loader: false,
        procedureById: {
          // loading: false,
          procedureconfigByID: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_PROCEDURE_BY_ID_FAILURE:
      return {
        ...state,
        loader: false,
        procedureById: {
          // loading: false,
          procedureconfigByID: null,
          error: true,
          message: action.message,
        },
      };

    case CLEAR_DATA:
      return {
        ...state,
        procedureById: {
          procedureconfigByID: null,
        },
      };

    case ADD_PROCEDURE_CONFIG_PENDING:
      return {
        ...state,
        loader: true,
        addProcessConfig: {
          // loading: true,
          data: null,
          error: false,
          message: null,
        },
      };

    case ADD_PROCEDURE_CONFIG_SUCCESS:
      return {
        ...state,
        loader: false,
        addProcessConfig: {
          // loading: false,
          data: action.payload,
          error: false,
          message: null,
        },
      };

    case ADD_PROCEDURE_CONFIG_FAILURE:
      return {
        ...state,
        loader: false,
        addProcessConfig: {
          // loading: false,
          data: null,
          error: true,
          message: action.message,
        },
      };

    case UPDATE_PROCEDURE_PENDING:
      return {
        ...state,
        loader: true,
        updateProcessConfig: {
          // loading: true,
          updatedata: null,
          error: false,
          message: null,
        },
      };

    case UPDATE_PROCEDURE_SUCCESS:
      return {
        ...state,
        loader: false,
        updateProcessConfig: {
          // loading: false,
          updatedata: action.payload,
          error: false,
          message: null,
        },
      };

    case UPDATE_PROCEDURE_FAILURE:
      return {
        ...state,
        loader: false,
        updateProcessConfig: {
          // loading: false,
          updatedata: null,
          error: true,
          message: action.message,
        },
      };

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

    case DELETE_PROCEDURE_PENDING:
      return {
        ...state,
        deleteProcedureById: { loading: true, error: false, message: null },
      };
    case DELETE_PROCEDURE_SUCCESS:
      return {
        ...state,
        deleteProcedureById: { loading: false, error: false, message: null },
      };
    case DELETE_PROCEDURE_FAILURE:
      return {
        ...state,
        deleteProcedureById: {
          loading: false,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
