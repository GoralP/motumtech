import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSignOut } from "appRedux/actions/Auth";
import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import FooterLogo from "./FooterLogo";
import UserProfile from "./UserProfile";
import {
  // NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import { useSelector } from "react-redux";
import { webURL, branchName } from "util/config";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = () => {
  const dispatch = useDispatch();
  let { navStyle, themeType, pathname } = useSelector(
    ({ settings }) => settings
  );
  // const {rolePermission}= useSelector(({auth}) => auth);

  var permitVisit = "";
  var permitProcedure = "";
  var permitIdentity = "";
  var permitExpedient = "";
  var permitInspection = "";
  var permitEmployeeWorkLog = "";
  var permitDocument = "";
  var permitUserReport = "";
  var permitOutLook = "";
  var permitPermission = "";
  var permitRole = "";
  var permitActiveDirectory = "";
  var permitImportConfig = "";
  var permitImportDocument = "";
  let procedureList = "";
  let businessprocedureList = "";
  let areaList = "";
  let departmentList = "";
  let serviceList = "";
  let processDataList = "";
  let giaCongigurationList = "";
  let genralSettingList = "";
  let procedureConfigurationList = "";
  let logManagementList = "";

  let userdata = localStorage.getItem(branchName + "_data");
  let userData = JSON.parse(userdata);
  // console.log("user", userData.data.Permission);

  if (userData) {
    if (userdata !== "" && userdata !== null) {
      let businessprocedure_list =
        userData.Permission.BusinessProcedure.BusinessProcedure_List;
      let area_list = userData.Permission.Area.Area_List;
      let department_list = userData.Permission.Department.Department_List;
      let service_list = userData.Permission.Services.Service_List;
      let process_list = userData.Permission.ProcessData.Process_List;

      let permit_visit = userData.Permission.Visit.Visit_List;
      let permit_procedure = userData.Permission.Procedure.Procedure_List;
      let permit_identity = userData.Permission.Employees.Identity_List;
      let permit_expedient = userData.Permission.Expedient.Expedient_List;
      let permit_inspection = userData.Permission.Inspection.Inspection_List;
      let permit_employee_work =
        userData.Permission.EmployeeWorkLog.EmployeeWorkLog_List;
      let permit_document = userData.Permission.Document.Document_List;
      let permit_user_report = userData.Permission.UserReport.UserReport_List;
      let permit_outlook =
        userData.Permission.Configuration.Configuration_OutLookSetting;
      let permit_permission = userData.Permission.Permission.Permission_List;
      let permit_role = userData.Permission.Role.Role_List;
      let permit_active_directory =
        userData.Permission.Configuration.Configuration_ActiveDirectorySetting;
      let permit_import_config =
        userData.Permission.Configuration.Configuration_ImportConfig;
      let permit_import_document =
        userData.Permission.Configuration.Configuration_ImportDocument;
      let Giaconfiguration_List =
        userData.Permission.GiaConfiguration.Giaconfiguration_List;
      let Logmanagement_List =
        userData.Permission.LogManagement.LogManagement_List;

      let GenralSetting_List =
        userData.Permission.GenralSetting.GenralSetting_List;
      // let ProcedureConfiguration_List =
      //   userData.Permission.ProcedureConfiguration.ProcedureConfiguration_List;

      if (
        userData !== "" &&
        userData !== null &&
        permit_visit !== undefined &&
        permit_procedure !== undefined &&
        permit_identity !== undefined &&
        permit_expedient !== undefined &&
        permit_inspection !== undefined &&
        permit_employee_work !== undefined &&
        permit_document !== undefined &&
        permit_user_report !== undefined &&
        permit_outlook !== undefined &&
        permit_permission !== undefined &&
        permit_role !== undefined &&
        permit_active_directory !== undefined &&
        permit_import_config !== undefined &&
        permit_import_document !== undefined &&
        area_list !== undefined &&
        department_list !== undefined &&
        service_list !== undefined &&
        businessprocedure_list !== undefined &&
        process_list !== undefined &&
        Giaconfiguration_List != undefined &&
        Logmanagement_List != undefined &&
        GenralSetting_List != undefined
        // ProcedureConfiguration_List != undefined
      ) {
        console.log("AREA LIST =>", permit_outlook);
        permitVisit = permit_visit;
        permitProcedure = permit_procedure;
        permitIdentity = permit_identity;
        permitExpedient = permit_expedient;
        permitInspection = permit_inspection;
        permitEmployeeWorkLog = permit_employee_work;
        permitDocument = permit_document;
        permitUserReport = permit_user_report;
        permitOutLook = permit_outlook;
        permitPermission = permit_permission;
        permitRole = permit_role;
        permitActiveDirectory = permit_active_directory;
        permitImportConfig = permit_import_config;
        permitImportDocument = permit_import_document;
        areaList = area_list;
        departmentList = department_list;
        serviceList = service_list;
        processDataList = process_list;
        businessprocedureList = businessprocedure_list;
        giaCongigurationList = Giaconfiguration_List;
        logManagementList = Logmanagement_List;
        genralSettingList = GenralSetting_List;
        // procedureConfigurationList = ProcedureConfiguration_List;
      }
    }
  } else {
    dispatch(userSignOut());
  }

  // useEffect(() => {
  //   dispatch(userRolePermissionByUserId(IdentityId))
  // }, []);

  // useEffect(() => {
  //   let mounted = true;
  //   IdentityId = userData.IdentityId;
  //   userRolePermissionByUserId(IdentityId)
  //     .then(items => {
  //       if(mounted) {
  //         setList(items)
  //       }
  //     })
  //   return () => mounted = false;
  // }, [])

  // const getNoHeaderClass = (navStyle) => {
  //   if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
  //     return "gx-no-header-notifications";
  //   }
  //   return "";
  // };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };
  let selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split("/")[2];

  if (selectedKeys === "add-profiler") {
    selectedKeys = "profiler";
  } else if (selectedKeys === "add-staff") {
    selectedKeys = "staff";
  } else if (selectedKeys === "dashboard") {
    selectedKeys = "dashboard";
  }
  return (
    <>
      <SidebarLogo />

      <div className="gx-sidebar-content">
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            <MenuItemGroup key="main" className="gx-menu-group">
              <Menu.Item key={`/${webURL}main/home/crypto`}>
                <Link to={`/${webURL}main/home/crypto`}>
                  <i className="icon icon-home" />
                  <span>
                    <IntlMessages id="sidebar.home" />
                  </span>
                </Link>
              </Menu.Item>

              {permitIdentity === true ? (
                <Menu.Item key={`/${webURL}main/home/employee`}>
                  <Link to={`/${webURL}main/home/employee`}>
                    <i className="icon icon-profile" />
                    <span>
                      <IntlMessages id="sidebar.employee" />
                    </span>
                  </Link>
                </Menu.Item>
              ) : null}
              {businessprocedureList === true ? (
                <Menu.Item key={`/${webURL}main/home/business-procedure`}>
                  <Link to={`/${webURL}main/home/business-procedure`}>
                    <i className="icon icon-culture-calendar" />
                    <span>
                      <IntlMessages id="sidebar.procedures" />
                    </span>
                  </Link>
                </Menu.Item>
              ) : null}

              {/* Process Data Master menu item */}
              <SubMenu
                key="Data Master"
                className={getNavStyleSubMenuClass(navStyle)}
                style={{ whiteSpace: "normal" }}
                title={
                  <span>
                    <i className="icon icon-wysiwyg" />
                    <span>
                      <IntlMessages id="sidebar.dataMaster" />
                    </span>
                  </span>
                }
              >
                {areaList === true ? (
                  <Menu.Item key={`/${webURL}main/home/area`}>
                    <Link to={`/${webURL}main/home/area`}>
                      <span>
                        <IntlMessages id="sidebar.area" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {departmentList === true ? (
                  <Menu.Item key={`/${webURL}main/home/department`}>
                    <Link to={`/${webURL}main/home/department`}>
                      <span>
                        <IntlMessages id="sidebar.department" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {serviceList === true ? (
                  <Menu.Item key={`/${webURL}main/home/services`}>
                    <Link to={`/${webURL}main/home/services`}>
                      <span>
                        <IntlMessages id="sidebar.services" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {processDataList === true ? (
                  <Menu.Item key={`/${webURL}main/home/process`}>
                    <Link to={`/${webURL}main/home/process`}>
                      <span>
                        <IntlMessages id="sidebar.processData" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
              </SubMenu>

              {/*  Basic Process menu item*/}

              {permitVisit === true ||
              permitEmployeeWorkLog === true ||
              permitProcedure === true ||
              permitExpedient === true ||
              permitInspection === true ? (
                <SubMenu
                  key="process"
                  className={getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-filter-circle" />
                      <span>
                        <IntlMessages id="sidebar.process" />
                      </span>
                    </span>
                  }
                >
                  {permitVisit === true ? (
                    <Menu.Item key={`/${webURL}main/home/visit`}>
                      <Link to={`/${webURL}main/home/visit`}>
                        <span>
                          <IntlMessages id="sidebar.visit" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                  {permitEmployeeWorkLog === true ? (
                    <Menu.Item key={`/${webURL}main/home/employee-work-log`}>
                      <Link to={`/${webURL}main/home/employee-work-log`}>
                        <span>
                          <IntlMessages id="sidebar.employeeworklog" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                  {permitProcedure === true ? (
                    <Menu.Item key={`/${webURL}main/home/procedure`}>
                      <Link to={`/${webURL}main/home/procedure`}>
                        <span>
                          <IntlMessages id="sidebar.procedure" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                  {permitExpedient === true ? (
                    <Menu.Item key={`/${webURL}main/home/expedient`}>
                      <Link to={`/${webURL}main/home/expedient`}>
                        <span>
                          <IntlMessages id="sidebar.expedient" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                  {permitInspection === true ? (
                    <Menu.Item key={`/${webURL}main/home/inspection`}>
                      <Link to={`/${webURL}main/home/inspection`}>
                        <span>
                          <IntlMessages id="sidebar.inspection" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : (
                ""
              )}

              {/* Process Flow Menu item */}

              {/* <SubMenu
                key="process flow"
                className={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-filter-circle" />
                    <span>
                      <IntlMessages id="sidebar.processflow" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key={`/${webURL}main/home/visit`}>
                  <Link to={`/${webURL}main/home/visit`}>
                    <span>
                      <IntlMessages id="sidebar.processflow" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu> */}

              {/* business procedure menu item */}

              {permitDocument === true ? (
                <SubMenu
                  key="formations"
                  className={getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-editor" />
                      <span>
                        <IntlMessages id="sidebar.formations" />
                      </span>
                    </span>
                  }
                >
                  {permitDocument === true ? (
                    <Menu.Item key={`/${webURL}main/home/document`}>
                      <Link to={`/${webURL}main/home/document`}>
                        <span>
                          <IntlMessages id="sidebar.document" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : null}

              {permitUserReport === true ? (
                <SubMenu
                  key="reports"
                  className={getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-select" />
                      <span>
                        <IntlMessages id="sidebar.reports" />
                      </span>
                    </span>
                  }
                >
                  {permitUserReport === true ? (
                    <Menu.Item key={`/${webURL}main/home/user-reports`}>
                      <Link to={`/${webURL}main/home/user-reports`}>
                        <span>
                          <IntlMessages id="sidebar.userReports" />
                        </span>
                      </Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : null}

              {/* <Menu.Item key="main/home/help">
                <Link to="/main/home/help">
                  <i className="icon icon-testimonial" />
                    <span><IntlMessages id="sidebar.help"/></span>
                </Link>
              </Menu.Item> */}

              <SubMenu
                key="configuration"
                className={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-extra-components" />
                    <span>
                      <IntlMessages id="sidebar.configuration" />
                    </span>
                  </span>
                }
              >
                {permitOutLook === true ? (
                  <Menu.Item key={`/${webURL}main/home/out-look-setting`}>
                    <Link to={`/${webURL}main/home/out-look-setting`}>
                      <span>
                        <IntlMessages id="sidebar.outLookSetting" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {permitActiveDirectory === true ? (
                  <Menu.Item
                    key={`/${webURL}main/home/active-directory-setting`}
                  >
                    <Link to={`/${webURL}main/home/active-directory-setting`}>
                      <span>
                        <IntlMessages id="sidebar.activeDirectorySetting" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {permitRole === true || permitPermission === true ? (
                  <Menu.Item key={`/${webURL}main/home/role-and-permission`}>
                    <Link to={`/${webURL}main/home/role-and-permission`}>
                      <span>
                        <IntlMessages id="sidebar.rolePermission" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {permitImportConfig === true ||
                permitImportDocument === true ? (
                  <Menu.Item key={`/${webURL}main/home/setting`}>
                    <Link to={`/${webURL}main/home/setting`}>
                      <span>
                        <IntlMessages id="sidebar.Setting" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                <Menu.Item key={`/${webURL}main/home/change-password`}>
                  <Link to={`/${webURL}main/home/change-password`}>
                    <span>
                      <IntlMessages id="confirmPassword.title" />
                    </span>
                  </Link>
                </Menu.Item>

                {giaCongigurationList === true ? (
                  <Menu.Item key={`/${webURL}main/home/giaconfiguration`}>
                    <Link to={`/${webURL}main/home/giaconfiguration`}>
                      <span>
                        <IntlMessages id="sidebar.giaconfig" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {genralSettingList === true ? (
                  <Menu.Item key={`/${webURL}main/home/general-settings`}>
                    <Link to={`/${webURL}main/home/general-settings`}>
                      <span>
                        <IntlMessages id="sidebar.generalSettings" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}
                {procedureConfigurationList === true ? (
                  <Menu.Item
                    key={`/${webURL}main/home/visit-procedure-management`}
                  >
                    <Link to={`/${webURL}main/home/visit-procedure-management`}>
                      <span>
                        <IntlMessages id="sidebar.visitproceduremanagement" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : null}

                {/* <Menu.Item
                  key={`/${webURL}main/home/visit-procedure-management`}
                >
                  <Link to={`/${webURL}main/home/visit-procedure-management`}>
                    <span>
                      <IntlMessages id="sidebar.visitproceduremanagement" />
                    </span>
                  </Link>
                </Menu.Item> */}

                {logManagementList === true ? (
                  <Menu.Item key={`/${webURL}main/home/log-management`}>
                    <Link to={`/${webURL}main/home/log-management`}>
                      <span>
                        <IntlMessages id="sidebar.logmanagement" />
                      </span>
                    </Link>
                  </Menu.Item>
                ) : (
                  ""
                )}

                {/* <Menu.Item
                  key={`/${webURL}main/home/business-procedure-management`}
                >
                  <Link
                    to={`/${webURL}main/home/business-procedure-management`}
                  >
                    <span>
                      <IntlMessages id="sidebar.businessProcedureManagement" />
                    </span>
                  </Link>
                </Menu.Item> */}
              </SubMenu>

              <Menu.Item key="">
                <UserProfile />
              </Menu.Item>
            </MenuItemGroup>
          </Menu>
        </CustomScrollbars>
        <FooterLogo />
      </div>
    </>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;
