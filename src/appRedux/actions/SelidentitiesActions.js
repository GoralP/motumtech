import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    SELIDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_SELIDENTITIES,
    GET_SELIDENTITIES_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    CLOSE_MODAL,
    OPEN_MODAL,
    CLOSE_SELIDENTITY_MODAL,
    OPEN_SELIDENTITY_MODAL
  } from "constants/ActionTypes";
  
  export const getSelidentitiesSuccess = (data) => {
    return {
      type: GET_SELIDENTITIES_SUCCESS_DATA,
      payload: data
    };
  };

  export const close_selidentity_modal = () => {
    return {
      type: CLOSE_SELIDENTITY_MODAL,
    };
  };

  export const open_selidentity_modal = () => {
    return {
      type: OPEN_SELIDENTITY_MODAL,
    };
  };

  export const get_selidentities = (identity) => {
    return {
      type: GET_SELIDENTITIES,
      payload: identity
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
      type: SELIDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
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