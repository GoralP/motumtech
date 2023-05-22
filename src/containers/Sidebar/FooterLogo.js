import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

// import {onNavStyleChange, toggleCollapsedSideNav} from "appRedux/actions/Setting";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import {userSignOut} from "appRedux/actions/Auth";
import {branchName} from "../../util/config";


const FooterLogo = () => {
  const dispatch = useDispatch();
  const {width, themeType} = useSelector(({settings}) => settings);

  let navStyle = useSelector(({settings}) => settings.navStyle);

  let applicationLogo = '';

  let userdata = localStorage.getItem(branchName+'_data');
  let userData = JSON.parse(userdata);

  if (userData) {
    if (userdata !== '' && userdata !== null)
    {
      let application_logo = userData.ApplicationLogo;
      if((userData !== '' && userData !== null) && application_logo !== undefined)
      {
        applicationLogo = application_logo;
      }    
    }
  } else {
    dispatch(userSignOut());
  }

  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }
  return (
    <Link to="./crypto" className="gx-site-logo">
      {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && width >= TAB_SIZE ?
        <img alt="lo" src={require("assets/images/motum-logo.png")}/> :
        themeType === THEME_TYPE_LITE ?
          <img alt="logo1" src={require("assets/images/motum-logo.png")} height="70" width="70"/> :
          <center><img alt="logo2" src={require("assets/images/motum-logo.png")} height="70" width="70"/></center>
      }
    </Link>
  );
};

export default FooterLogo;
