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

export const getGeneralSettings = (settingsData) => {
  return {
    type: GET_GENERAL_SETTINGS_PENDING,
    payload: settingsData,
  };
};

export const getGeneralSettingsSuccess = (datas) => {
  return {
    type: GET_GENERAL_SETTINGS_SUCCESS,
    payload: datas,
  };
};

export const getGeneralSettingsFail = (error) => {
  return {
    type: GET_GENERAL_SETTINGS_FAILURE,
    payload: error,
  };
};

export const getDeviceName = (deviceName) => {
  return {
    type: GET_DEVICE_NAME_PENDING,
    payload: deviceName,
  };
};

export const getDeviceNameSuccess = (deviceNameData) => {
  return {
    type: GET_DEVICE_NAME_SUCCESS,
    payload: deviceNameData,
  };
};

export const getDeviceNameFail = (error) => {
  return {
    type: GET_DEVICE_NAME_FAILURE,
    payload: error,
  };
};

export const creategenerealSetting = (data) => {
  return {
    type: ADD_GENERAL_SETTINGS_PENDING,
    payload: data,
  };
};

export const createGeneralSettingSuccess = (datas) => {
  return {
    type: ADD_GENERAL_SETTINGS_SUCCESS,
    payload: datas,
  };
};

export const createGeneralSettingsFail = (error) => {
  return {
    type: ADD_GENERAL_SETTINGS_FAILURE,
    payload: error,
  };
};
