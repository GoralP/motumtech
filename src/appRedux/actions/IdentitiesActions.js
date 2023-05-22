import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    IDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_IDENTITIES,
    GET_SINGLEIDENTITY,
    GET_IDENTITIES_SUCCESS_DATA,
    GET_SINGLEIDENTITY_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    CLOSE_MODAL,
    OPEN_MODAL,
    CLOSE_BULKSIGNATURE_MODAL
  } from "constants/ActionTypes";
  
  export const getIdentitiesSuccess = (data) => {
    return {
      type: GET_IDENTITIES_SUCCESS_DATA,
      payload: data
    };
  };

  export const getSingleIdentitySuccess = (data) => {
    return {
      type: GET_SINGLEIDENTITY_SUCCESS_DATA,
      payload: data
    };
  };

  export const close_bulksignature_modal = (data) => {
    return {
      type: CLOSE_BULKSIGNATURE_MODAL,
      payload: data
    };
  };

  export const get_identities = (identity) => {
    return {
      type: GET_IDENTITIES,
      payload: identity
    };
  };

  export const get_singleidentity = (singleId) => {
    return {
      type: GET_SINGLEIDENTITY,
      payload: singleId
    };
  };
  
  export const closemodal = () => {
    return {
      type: CLOSE_MODAL,
    };
  };

  export const openmodal = () => {
    return {
      type: OPEN_MODAL,
    };
  };

  export const setstatustoinitial = () => {
    return {
      type: GET_STATUS_INITIAL,
    };
  };

  export const showIdentitiersLoader = () => {
    return {
      type: ON_SHOW_LOADER,
    };
  };
  
  export const showErrorMessage = (message) => {
    return {
      type: SHOW_MESSAGE,
      payload: message
    };
  };
  
  export const showSuccessMessage = (message) => {
    return {
      type: IDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
      payload: message
    };
  };
  
  export const showAuthLoader = () => {
    return {
      type: ON_SHOW_LOADER,
    };
  };
  
  export const hideMessage = () => {
    return {
      type: HIDE_MESSAGE,
    };
  };
  
  export const hideAuthLoader = () => {
    return {
      type: ON_HIDE_LOADER,
    };
  };