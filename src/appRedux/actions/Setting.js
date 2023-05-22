import {
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  WINDOW_WIDTH,
} from "constants/ActionTypes";
import {
  LAYOUT_TYPE,
  NAV_STYLE,
  THEME_COLOR,
  THEME_TYPE,
} from "../../constants/ThemeSetting";
import { branchName } from "./../../util/config";

export function toggleCollapsedSideNav(navCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, navCollapsed };
}

export function updateWindowWidth(width) {
  return (dispatch) => {
    dispatch({ type: WINDOW_WIDTH, width });
  };
}

export function setThemeType(themeType) {
  return (dispatch) => {
    dispatch({ type: THEME_TYPE, themeType });
  };
}

export function setThemeColor(themeColor) {
  // console.log("ms",themeColor)
  return (dispatch) => {
    dispatch({ type: THEME_COLOR, themeColor });
  };
}

export function onNavStyleChange(navStyle) {
  return (dispatch) => {
    dispatch({ type: NAV_STYLE, navStyle });
  };
}

export function onLayoutTypeChange(layoutType) {
  return (dispatch) => {
    dispatch({ type: LAYOUT_TYPE, layoutType });
  };
}

export function switchLanguage(locale) {
  // console.log("LOCALE", locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1));
  // console.log("LOCALE =>", locale.languageId.charAt(0).toUpperCase() + locale.langaugeId.slice(1));
  if (branchName === "EstabanellVisit") {
    localStorage.setItem(
      "EstabanellVisit_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  } else if (branchName === "Prevengest") {
    localStorage.setItem(
      "Prevengest_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  } else if (branchName === "Nunegal") {
    localStorage.setItem(
      "Nunegal_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  } else if (branchName === "Molins") {
    localStorage.setItem(
      "Molins_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  } else if (branchName === "Motumtech") {
    localStorage.setItem(
      "Motumtech_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  } else if (branchName === "Kiosk") {
    localStorage.setItem(
      "Kiosk_language",
      locale.languageId.charAt(0).toUpperCase() + locale.languageId.slice(1)
    );
  }
  return (dispatch) => {
    dispatch({
      type: SWITCH_LANGUAGE,
      payload: locale,
    });
  };
}
