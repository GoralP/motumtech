import {
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  WINDOW_WIDTH,
} from "constants/ActionTypes";
import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  THEME_COLOR,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK,
} from "../../constants/ThemeSetting";

const branch = window.location.pathname.split("/")[1];
// set default language based on branch
let locale = {
  languageId: "catalan",
  locale: "ct",
  name: "Català",
  icon: "ct",
};

// if (branch !== 'EstabanellVisit') {
//   locale = {
//     languageId: 'spanish',
//     locale: 'es',
//     name: 'Español',
//     icon: 'es'
//   }

// }

const initialSettings = {
  navCollapsed: true,
  navStyle: NAV_STYLE_FIXED,
  layoutType: LAYOUT_TYPE_FULL,
  themeType: THEME_TYPE_SEMI_DARK,
  themeColor: THEME_COLOR,

  pathname: "/",
  width: window.innerWidth,
  isDirectionRTL: false,
  locale: locale,
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE":
      return {
        ...state,
        pathname: action.payload.location.pathname,
        navCollapsed: false,
      };
    case TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        navCollapsed: action.navCollapsed,
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width,
      };
    case THEME_TYPE:
      return {
        ...state,
        themeType: action.themeType,
      };
    case THEME_COLOR:
      console.log("yes", action.themeColor);
      return {
        ...state,
        themeColor: action.themeColor,
      };

    case NAV_STYLE:
      return {
        ...state,
        navStyle: action.navStyle,
      };
    case LAYOUT_TYPE:
      return {
        ...state,
        layoutType: action.layoutType,
      };

    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
      };
    default:
      return state;
  }
};

export default settings;
