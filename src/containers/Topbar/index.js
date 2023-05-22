import React, { useState } from "react";
import { Layout, Popover, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { baseURL, webURL, branchName } from "util/config";
import IntlMessages from "util/IntlMessages";
import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData";
import {
  switchLanguage,
  toggleCollapsedSideNav,
} from "../../appRedux/actions/Setting";
import { setGlobaldata } from "../../appRedux/actions/VisitsActions";
import SearchBox from "components/SearchBox";
import { FormattedMessage, injectIntl } from "react-intl";

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import Auxiliary from "util/Auxiliary";

const { Header } = Layout;
let userId = "";
let userName = "";

const Topbar = (props) => {
  const { locale, width, navCollapsed, navStyle } = useSelector(
    ({ settings }) => settings
  );
  // const { width, navCollapsed, navStyle} = useSelector(({settings}) => settings);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
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
  const languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll cust-box-size">
      <ul className="gx-sub-popover">
        {languageData.map((language) => (
          <li
            className="gx-media gx-pointer"
            key={JSON.stringify(language)}
            onClick={(e) => dispatch(switchLanguage(language))}
          >
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        ))}
      </ul>
    </CustomScrollbars>
  );

  const updateSearchChatUser = (evt) => {
    setSearchText(evt.target.value);
  };

  let userdata = localStorage.getItem(branchName + "_data");
  if (userdata !== "" && userdata !== null) {
    let userData = JSON.parse(userdata);
    if (
      userData !== "" &&
      userData !== null &&
      userData["id"] !== undefined &&
      userData["IdentityName"] !== undefined
    ) {
      userId = userData["id"];
      userName = userData["IdentityName"];
    }
  }

  const toTitles = (s) => {
    return s.replace(/\w\S*/g, function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  };

  const searchGlobalrecords = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      var searchWord = e.target.value;
      if (searchWord !== "") {
        let authBasic = "";

        authBasic = localStorage.getItem("setAuthToken");
        const requestOptions = {
          headers: { "Content-Type": "application/json" },
        };
        if (branchName === "EstabanellVisit") {
          localStorage.setItem("EstabanellVisit_searchWord", searchWord);
        } else if (branchName === "Prevengest") {
          localStorage.setItem("Prevengest_searchWord", searchWord);
        } else if (branchName === "Nunegal") {
          localStorage.setItem("Nunegal_searchWord", searchWord);
        } else if (branchName === "Molins") {
          localStorage.setItem("Molins_searchWord", searchWord);
        } else if (branchName === "Motumtech") {
          localStorage.setItem("Motumtech_searchWord", searchWord);
        } else if (branchName === "Kiosk") {
          localStorage.setItem("Kiosk_searchWord", searchWord);
        }

        fetch(
          baseURL +
            "Searchall?licenceId=" +
            userId +
            "&searchKeyWord=" +
            searchWord,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + authBasic,
            },
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            dispatch(setGlobaldata(data.data));
            history.push(`/${webURL}/main/home/global_search`);
          });
      } else {
        message.error(props.intl.formatMessage({ id: "global.GlobalSearch" }));
      }
    }
  };

  return (
    <Header>
      {navStyle === NAV_STYLE_DRAWER ||
      ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) &&
        width < TAB_SIZE) ? (
        <div className="gx-linebar gx-mr-3">
          <i
            className="gx-icon-btn icon icon-menu"
            onClick={() => {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            }}
          />
        </div>
      ) : null}
      <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
        {/*<img alt="" src={require("assets/images/w-logo.png")}/>*/}
      </Link>
      <FormattedMessage id="search.placeholder">
        {(placeholder) => (
          <SearchBox
            styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
            placeholder={placeholder}
            value={searchText}
            onChange={updateSearchChatUser}
            onKeyDown={searchGlobalrecords}
          />
        )}
      </FormattedMessage>
      <ul className="gx-header-notifications gx-ml-auto">
        <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
          <Popover
            overlayClassName="gx-popover-horizantal"
            placement="bottomRight"
            content={
              <SearchBox
                styleName="gx-popover-search-bar"
                placeholder="Search in app..."
                onChange={updateSearchChatUser}
                value={searchText}
              />
            }
            trigger="click"
          >
            <span className="gx-pointer gx-d-block">
              <i className="icon icon-search-new" />
            </span>
          </Popover>
        </li>

        <Auxiliary>
          <li className="gx-msg">
            <span className="gx-status-pos gx-d-block cust-top-welcome">
              <IntlMessages id="welcome.title" />
            </span>
            <span className="gx-status-pos gx-d-block cust-top-username">
              {toTitles(userName)}
            </span>
          </li>
        </Auxiliary>

        <li className="gx-language">
          <Popover
            overlayClassName="gx-popover-horizantal"
            placement="bottomRight"
            content={languageMenu()}
            trigger="click"
          >
            <span className="gx-pointer gx-flex-row gx-align-items-center">
              <i className={`flag flag-24 flag-${locale.icon}`} />
              <span className="gx-pl-2 gx-language-name">{locale.name}</span>
              <i className="icon icon-chevron-down gx-pl-2" />
            </span>
          </Popover>
        </li>
      </ul>
    </Header>
  );
};

export default injectIntl(Topbar);
