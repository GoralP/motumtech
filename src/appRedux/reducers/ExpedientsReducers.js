import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    EXPEDIENTS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_EXPEDIENTS_SUCCESS_DATA,
    GET_EXPEDIENTS_REPORT_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    GET_EXPEDIENT_FORM_SUCCESS_DATA,
    CLOSE_EXPEDIENT_MODAL,
    OPEN_EXPEDIENT_MODAL
} from "constants/ActionTypes";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_expedients_res: '',
    get_expedient_form_res: '',
    status : 'Initial',
    expedientmodalclosecall: false
};

export default(state = INIT_STATE, action) => {

    switch (action.type) {

        case SHOW_MESSAGE:
            {
                return {
                    ...state,
                    alertMessage: action.payload,
                    showMessage: true,
                    loader: true,
                    status : 'Initial',
                }
            }

        case EXPEDIENTS_STATUS_SHOW_SUCCESS_MESSAGE:
            {
                return {
                    ...state,
                    // authUser: null,
                    successMessage: action.payload,
                    showSuccessMessage: true,
                    loader: true,
                    status : 'Initial',
                }
            }
        case GET_STATUS_INITIAL:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case CLOSE_EXPEDIENT_MODAL:
            {
                return {
                    ...state,
                    expedientmodalclosecall : action.payload
                }
            }
        case OPEN_EXPEDIENT_MODAL:
            {
                return {
                    ...state,
                    expedientmodalclosecall : action.payload
                }
            }
        case GET_EXPEDIENTS_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_expedients_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_EXPEDIENTS_REPORT_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_expedients_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_EXPEDIENT_FORM_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_expedient_form_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
            
        case HIDE_MESSAGE:
            {
                return {
                    ...state,
                    alertMessage: '',
                    successMessage: '',
                    showMessage: false,
                    showSuccessMessage: false,
                    loader: false
                }
            }

        case ON_SHOW_LOADER:
            {
                return {
                    ...state,
                    loader: true
                }
            }
        case ON_HIDE_LOADER:
            {
                return {
                    ...state,
                    loader: false
                }
            }
        default:
            return state;
    }
}
// export default INIT_STATE;