import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    IDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE,
    GET_IDENTITIES_SUCCESS_DATA,
    GET_SINGLEIDENTITY_SUCCESS_DATA,
    GET_STATUS_INITIAL,
    CLOSE_MODAL,
    OPEN_MODAL,
    CLOSE_BULKSIGNATURE_MODAL
} from "constants/ActionTypes";

// import States from "../states/states";

const INIT_STATE = {
    loader: false,
    alertMessage: '',
    successMessage: '', 
    showMessage: false,
    showSuccessMessage: false,
    initURL: '',
    get_identities_res: '',
    get_singleidentity_res: '',
    status : 'Initial',
    modalclosecall: false,
    bulksignaturemodalclosecall: false
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

        case IDENTITIES_STATUS_SHOW_SUCCESS_MESSAGE:
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
        case CLOSE_MODAL:
        {
            return {
                ...state,
                modalclosecall : true
            }
        }
        case OPEN_MODAL:
        {
            return {
                ...state,
                modalclosecall : false
            }
        }
        case CLOSE_BULKSIGNATURE_MODAL:
        {
            return {
                ...state,
                bulksignaturemodalclosecall : action.payload
            }
        }
        case GET_IDENTITIES_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_identities_res: action.payload,
                    loader: false,
                    status : 'Dataloaded',
                    
                }
            }
        case GET_SINGLEIDENTITY_SUCCESS_DATA:
            {
                // console.log("payload",action.payload)
                return {
                    ...state,
                    // authUser: null,
                    get_singleidentity_res: action.payload,
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