import React from "react";
import { useDispatch } from "react-redux";
// import {Avatar, Popover} from "antd";
import { userSignOut } from "appRedux/actions/Auth";
import { Link } from "react-router-dom";
import IntlMessages from "../../util/IntlMessages";

const UserProfile = () => {
  const dispatch = useDispatch();

  const removeUserAuth = () => {
    localStorage.removeItem("setAuthToken");
    localStorage.removeItem("userAuth");
    localStorage.removeItem("ProcedureId");
    localStorage.removeItem("pageNumber");
    localStorage.removeItem("perPage");
    localStorage.removeItem("searchDetailProcedure");
  };

  return (
    <Link
      onClick={() => {
        dispatch(userSignOut());
        removeUserAuth();
      }}
    >
      <i className="icon icon-signin" />
      <span>
        <IntlMessages id="sidebar.signout" />
      </span>
    </Link>
  );
};

export default UserProfile;
