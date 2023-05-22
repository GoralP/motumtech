import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    INSPECTIONS_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_INSPECTIONS_SUCCESS_DATA,
    GET_CALENDAR,
    GET_CALENDAR_SUCCESS_DATA,
    GET_INSPECTIONS_REPORT_SUCCESS_DATA,
    GET_INITIAL_SIGNIN_STATUS,
    GET_INITIAL_SIGNIN_STATUS_SUCCESS,
    SAVE_CALENDAR_DATA,
    SAVE_CALENDAR_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    VALIDATE_INITIAL_DIRECTORY,
    VALIDATE_INITIAL_DIRECTORY_SUCCESS,
    SET_DIRECTORY_TOKEN,
    SET_DIRECTORY_TOKEN_SUCCESS
} from "constants/ActionTypes";

// import States from "../states/states";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_inspections_res: '',
    get_calendar_res: '',
    get_signin_status: '',
    get_directory_status: '',
    set_directory_token: '',
    status : 'Initial'
};

export default(state = INIT_STATE, action) => {

    // if(States ===undefined){     return new States(); }
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

        case INSPECTIONS_STATUS_SHOW_SUCCESS_MESSAGE:
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
        case GET_INSPECTIONS_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_inspections_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_CALENDAR:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case GET_CALENDAR_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_calendar_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case SAVE_CALENDAR_DATA:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case SAVE_CALENDAR_SUCCESS_DATA:
            {
                return {
                    ...state,
                    // authUser: null,
                    // get_calendar_res: action.payload,
                    loader: false,
                    // status : 'Dataloaded',
                }
            }
        case GET_INITIAL_SIGNIN_STATUS:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case GET_INITIAL_SIGNIN_STATUS_SUCCESS:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_signin_status: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }

        case VALIDATE_INITIAL_DIRECTORY:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case VALIDATE_INITIAL_DIRECTORY_SUCCESS:
            {
                return {
                    ...state,
                    // authUser: null,
                    get_directory_status: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case SET_DIRECTORY_TOKEN:
            {
                return{
                    ...state,
                    status : 'Initial',
                    loader: true,
                }
            }
        case SET_DIRECTORY_TOKEN_SUCCESS:
            {
                return {
                    ...state,
                    // authUser: null,
                    set_directory_token: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                }
            }
        case GET_INSPECTIONS_REPORT_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_inspections_res: action.payload,
                    loader: false,
                    status : 'Datareortloaded',
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