import React from "react";
import { Avatar, Input, Modal, Select, Table, Button, Card } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { baseURL } from "./../../../util/config";
import DateWithoutTimeHelper from "./../../../routes/helper/DateWithoutTimeHelper";

import {
  get_identities,
  hideMessage,
  setstatustoinitial,
} from "./../../../appRedux/actions/IdentitiesActions";
import CircularProgress from "./../../../components/CircularProgress/index";

import IntlMessages from "util/IntlMessages";
// import BulkSingature from "./bulksignature";

const { Search } = Input;

let userId = "";

class SelectIdentities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      internalButton: "default",
      externalButton: "default",
      whitelistButton: "default",
      blacklistButton: "default",
      allButton: "primary",
      pagination: {},
      loading: false,
    };
  }

  // handleIdentityStatus = (e) =>  {
  //   var status_value = e.target.value;
  //   //console.log('filter value => ', status_value);
  //   if(status_value == 'Internal') {
  //     this.setState({internalButton: 'primary', externalButton: 'default' , whitelistButton: 'default', blacklistButton: 'default', allButton: 'default'});
  //   } else if(status_value == 'External') {
  //     this.setState({internalButton: 'default', externalButton: 'primary' , whitelistButton: 'default', blacklistButton: 'default', allButton: 'default'});
  //   } else if(status_value == 'Whitelist') {
  //     this.setState({internalButton: 'default', externalButton: 'default' , whitelistButton: 'primary', blacklistButton: 'default', allButton: 'default'});
  //   } else if(status_value == 'Blacklist') {
  //     this.setState({internalButton: 'default', externalButton: 'default' , whitelistButton: 'default', blacklistButton: 'primary', allButton: 'default'});
  //   } else {
  //     this.setState({internalButton: 'default', externalButton: 'default' , whitelistButton: 'default', blacklistButton: 'default', allButton: 'primary', searchedValue: ''});
  //   }
  //   filterTag = status_value;
  //   if(status_value == '') {
  //     searchTerm = '';
  //   }
  //   var pagesize = this.state.pagination.pageSize;
  //   this.get_identitiesById('', '', pagesize, filterTag, searchTerm);
  // }

  render() {
    console.log("props data => ", this.props.getIdentitiesData);
    const Option = Select.Option;
    const { open, onOwnerParticipantClose } = this.props;

    const columns = [
      {
        title: "Name",
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "Surname",
        dataIndex: "FatherSurname",
        key: "FatherSurname",
        sorter: true,
        render: (text, record) => (
          <span className="">
            {record.FatherSurname + " " + record.MotherSurname}
          </span>
        ),
      },
      {
        title: "Email",
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: "DNI",
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    return (
      <Modal
        className="cust-doc-modal identity_select_modal"
        toggle={onOwnerParticipantClose}
        visible={open}
        closable={true}
        okText="Save"
        onCancel={onOwnerParticipantClose}
      >
        <Card
          title="Select Identities"
          extra={
            <div>
              <Search
                placeholder="search"
                onSearch={this.handleIdentitySearch}
                style={{ marginRight: "10px" }}
              />
              <Button
                type={this.state.internalButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Internal"
              >
                Internal
              </Button>
              <Button
                type={this.state.externalButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="External"
              >
                External
              </Button>
              <Button
                type={this.state.whitelistButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Whitelist"
              >
                Whitelist
              </Button>
              <Button
                type={this.state.blacklistButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Blacklist"
              >
                Blacklist
              </Button>
            </div>
          }
        >
          <Table
            rowSelection={rowSelection}
            className="gx-table-responsive custom-identity-table"
            columns={columns}
            dataSource={this.props.getIdentitiesData.identites}
          />
        </Card>
        {/* <BulkSingature open={sendSingatureState} onSingatureClose={this.onSingatureClose}/> */}
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_identities,
  hideMessage,
  setstatustoinitial,
};

const mapStateToProps = (state) => {
  return {
    getIdentitiesData: state.identitiesReducers.get_identities_res,
    loader: state.alldocumentsReducers.loader,
    showSuccessMessage: state.alldocumentsReducers.showSuccessMessage,
    successMessage: state.alldocumentsReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.alldocumentsReducers.showMessage,
    alertMessage: state.alldocumentsReducers.alertMessage,
    status: state.alldocumentsReducers.status,
  };
};

// export default AllDocuments;
export default connect(mapStateToProps, mapDispatchToProps)(SelectIdentities);
