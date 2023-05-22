import {
  GET_ROLE,
  GET_ROLE_SUCCESS_DATA,
  GET_PERMISSION,
  GET_PERMISSION_SUCCESS_DATA,
  SAVE_ROLE_DATA,
  SAVE_PERMISSION_DATA,
  SAVE_PERMISSION_SUCCESS_DATA,
  CHANGED_PERMISSION_DATA,
  DELETE_ROLE_DATA,
  GET_STATUS_INITIAL,
  SHOW_MESSAGE,
  GIA_DATA_PENDING,
  GIA_DATA_SUCCESS,
  GIA_DATA_FAILURE,
  GET_GIA_DATA_PENDING,
  GET_GIA_DATA_SUCCESS,
  GET_GIA_DATA_FAILURE,
} from "constants/ActionTypes";

export const getRole = (roles) => {
  return {
    type: GET_ROLE,
    payload: roles,
  };
};

export const getRoleSuccess = (data) => {
  return {
    type: GET_ROLE_SUCCESS_DATA,
    payload: data,
  };
};

export const getPermission = (permission) => {
  return {
    type: GET_PERMISSION,
    payload: permission,
  };
};

export const getPermissionSuccess = (data) => {
  return {
    type: GET_PERMISSION_SUCCESS_DATA,
    payload: data,
  };
};

export const saveRoleData = (Data) => {
  return {
    type: SAVE_ROLE_DATA,
    payload: Data,
  };
};

export const savePermissionData = (Data) => {
  return {
    type: SAVE_PERMISSION_DATA,
    payload: Data,
  };
};

export const getSavePermissionSuccess = (data) => {
  return {
    type: SAVE_PERMISSION_SUCCESS_DATA,
    payload: data,
  };
};

export const deleteRoleData = (Data) => {
  return {
    type: DELETE_ROLE_DATA,
    payload: Data,
  };
};

export const setStatusToInitial = () => {
  return {
    type: GET_STATUS_INITIAL,
  };
};

export const showErrorMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message,
  };
};

export const addGiaData = (data) => {
  return {
    type: GIA_DATA_PENDING,
    payload: data,
  };
};

export const addGiaDataSuccess = (datas) => {
  return {
    type: GIA_DATA_SUCCESS,
    payload: datas,
  };
};

export const giaDataFail = (error) => {
  return {
    type: GIA_DATA_FAILURE,
    payload: error,
  };
};

export const getGiaDataByLicenseId = (giaData) => {
  return {
    type: GET_GIA_DATA_PENDING,
    payload: giaData,
  };
};

export const getGiaDataSuccess = (giaDatas) => {
  return {
    type: GET_GIA_DATA_SUCCESS,
    payload: giaDatas,
  };
};

export const getGiaDataFail = (error) => {
  return {
    type: GET_GIA_DATA_FAILURE,
    payload: error,
  };
};
