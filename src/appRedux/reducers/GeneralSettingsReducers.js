import {
  GET_GENERAL_SETTINGS_PENDING,
  GET_GENERAL_SETTINGS_SUCCESS,
  GET_GENERAL_SETTINGS_FAILURE,
  GET_DEVICE_NAME_PENDING,
  GET_DEVICE_NAME_SUCCESS,
  GET_DEVICE_NAME_FAILURE,
  ADD_GENERAL_SETTINGS_PENDING,
  ADD_GENERAL_SETTINGS_SUCCESS,
  ADD_GENERAL_SETTINGS_FAILURE,
} from "constants/ActionTypes";

const INIT_STATE = {
  getGeneralData: {
    loading: false,
    generalData: null,
    error: false,
    message: null,
  },
  getDevice: {
    loading: false,
    deviceData: null,
    error: false,
    message: null,
  },
  creategenerealSettings: {
    loading: false,
    createData: "",
    error: false,
    message: null,
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GENERAL_SETTINGS_PENDING:
      return {
        ...state,
        getGeneralData: {
          loading: true,
          generalData: null,
          error: false,
          message: null,
        },
      };
    case GET_GENERAL_SETTINGS_SUCCESS:
      return {
        ...state,
        getGeneralData: {
          loading: false,
          generalData: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_GENERAL_SETTINGS_FAILURE:
      return {
        ...state,
        getGeneralData: {
          loading: false,
          generalData: null,
          error: true,
          message: action.message,
        },
      };

    case GET_DEVICE_NAME_PENDING:
      return {
        ...state,
        getDevice: {
          loading: true,
          deviceData: null,
          error: false,
          message: null,
        },
      };
    case GET_DEVICE_NAME_SUCCESS:
      return {
        ...state,
        getDevice: {
          loading: false,
          deviceData: action.payload,
          error: false,
          message: null,
        },
      };
    case GET_DEVICE_NAME_FAILURE:
      return {
        ...state,
        getDevice: {
          loading: false,
          deviceData: null,
          error: true,
          message: action.message,
        },
      };

    case ADD_GENERAL_SETTINGS_PENDING:
      return {
        ...state,
        creategenerealSettings: {
          loading: true,
          createData: null,
          error: false,
          message: null,
        },
      };

    case ADD_GENERAL_SETTINGS_SUCCESS:
      return {
        ...state,
        creategenerealSettings: {
          loading: false,
          createData: action.payload,
          error: false,
          message: null,
        },
      };

    case ADD_GENERAL_SETTINGS_FAILURE:
      return {
        ...state,
        creategenerealSettings: {
          loading: false,
          createData: null,
          error: true,
          message: action.message,
        },
      };

    default:
      return state;
  }
};
