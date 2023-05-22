import React from "react";
import { Input, Modal, Table, Button, Card } from "antd";
import { connect } from "react-redux";
import {
  get_identities,
  hideMessage,
  setstatustoinitial,
} from "./../../../../appRedux/actions/IdentitiesActions";
import IntlMessages from "util/IntlMessages";
import { FormattedMessage } from "react-intl";

const { Search } = Input;

var sortBy = "";
var filterTag = "";
var searchTerm = "";

class IdentityList extends React.Component {
  get_identitiesById(
    pageNumber = "",
    sortBy = "-id",
    perPage = "10",
    filterTag = "",
    searchTerm = ""
  ) {
    if (this.props.status === "Initial") {
      this.props.get_identities({
        pageNumber: 1,
        sortBy: "-id",
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
      });
    } else {
      if (pageNumber === "") {
        pageNumber = 1;
      }
      if (perPage === "") {
        perPage = "10";
      }
      if (sortBy === "") {
        sortBy = "-id";
      }
      this.props.get_identities({
        pageNumber: pageNumber,
        sortBy: sortBy,
        perPage: perPage,
        filterTag: filterTag,
        searchTerm: searchTerm,
      });
    }
  }

  componentDidMount() {
    this.props.setstatustoinitial();
    this.get_identitiesById();
  }

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        //showSizeChanger: true,
        //pageSizeOptions: ['10', '20', '30', '40'],
        //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      },
      loading: false,
      internalButton: "default",
      externalButton: "default",
      whitelistButton: "default",
      blacklistButton: "default",
      allButton: "primary",
      searchedValue: "",
      selectedRowKeys: [],
    };
  }

  start = () => {
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
      });
    }, 1000);
  };

  handleIdentityStatus = (e) => {
    var status_value = e.target.value;
    if (status_value === "Internal") {
      this.setState({
        internalButton: "primary",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "External") {
      this.setState({
        internalButton: "default",
        externalButton: "primary",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Whitelist") {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "primary",
        blacklistButton: "default",
        allButton: "default",
      });
    } else if (status_value === "Blacklist") {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "primary",
        allButton: "default",
      });
    } else {
      this.setState({
        internalButton: "default",
        externalButton: "default",
        whitelistButton: "default",
        blacklistButton: "default",
        allButton: "primary",
        searchedValue: "",
      });
    }
    filterTag = status_value;
    if (status_value === "") {
      searchTerm = "";
    }
    var pagination_new = this.state.pagination;
    var pagesize = this.state.pagination.pageSize;
    pagination_new.current = 1;
    this.setState({ pagination: pagination_new });
    this.get_identitiesById("", "", pagesize, filterTag, searchTerm);
  };

  handleIdentitySearch = (value) => {
    searchTerm = value;
    var pagesize = this.state.pagination.pageSize;
    this.get_identitiesById("", "", pagesize, filterTag, searchTerm);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    if (sorter.order === "ascend") {
      sortBy = "+" + sorter.field;
    } else if (sorter.order === "descend") {
      sortBy = "-" + sorter.field;
    }
    this.get_identitiesById(
      pagination.current,
      sortBy,
      pagination.pageSize,
      filterTag,
      searchTerm
    );
  };

  render() {
    const { open, onOwnerParticipantClose, onSaveOwnerParticipant } =
      this.props;
    const { selectedRowKeys } = this.state;

    var identitiesData = this.props.getIdentitiesData;
    var identityData = "";
    if (!identitiesData) {
    } else {
      identityData = identitiesData.identites;

      const pagination = { ...this.state.pagination };
      var old_pagination_total = pagination.total;

      pagination.total = identitiesData.TotalCount;
      pagination.current = this.state.pagination.current
        ? this.state.pagination.current
        : 1;
      // var start_record = '';
      var end_record = "";
      if (pagination.current === 1) {
        // start_record = 1;
        end_record = pagination.pageSize;
      } else {
        // start_record = ((pagination.current -1) * pagination.pageSize) + 1;
        end_record = pagination.current * pagination.pageSize;
        if (end_record > pagination.total) {
          end_record = pagination.total;
        }
      }

      if (
        pagination.current !== "" &&
        this.state.pagination.current === undefined
      ) {
        this.setState({
          pagination,
        });
      } else if (
        pagination.total === "" &&
        pagination.total !== old_pagination_total
      ) {
        pagination.current = 1;
        this.setState({
          pagination,
        });
      } else if (
        (pagination.total === "" || pagination.total === 0) &&
        pagination.total !== old_pagination_total
      ) {
        this.setState({
          pagination,
        });
      }
    }

    const columns = [
      {
        title: <IntlMessages id="column.name" />,
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.surname" />,
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
        title: <IntlMessages id="column.email" />,
        dataIndex: "Email",
        key: "Email",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
      {
        title: <IntlMessages id="column.DNI" />,
        dataIndex: "DNI",
        key: "DNI",
        sorter: true,
        render: (text) => <span className="">{text}</span>,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: (record) => ({
        Name: record.Name,
      }),
    };

    return (
      <Modal
        style={{ top: 20 }}
        className="cust-doc-modal identity_select_modal"
        toggle={onOwnerParticipantClose}
        visible={open}
        closable={true}
        okText={<IntlMessages id="additentity.save" />}
        onOk={() => onSaveOwnerParticipant(selectedRowKeys)}
        onCancel={onOwnerParticipantClose}
      >
        <Card
          title={<IntlMessages id="selectidentity.title" />}
          extra={
            <div>
              <FormattedMessage id="placeholder.Search">
                {(placeholder) => (
                  <Search
                    placeholder={placeholder}
                    onSearch={this.handleIdentitySearch}
                    style={{ marginRight: "10px" }}
                  />
                )}
              </FormattedMessage>
              <Button
                type={this.state.internalButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Internal"
              >
                <IntlMessages id="button.internal" />
              </Button>
              <Button
                type={this.state.externalButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="External"
              >
                <IntlMessages id="button.external" />
              </Button>
              <Button
                type={this.state.whitelistButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Whitelist"
              >
                <IntlMessages id="button.whitelist" />
              </Button>
              <Button
                type={this.state.blacklistButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value="Blacklist"
              >
                <IntlMessages id="button.blacklist" />
              </Button>
              <Button
                type={this.state.allButton}
                className="identity_button"
                onClick={this.handleIdentityStatus}
                value=""
              >
                <IntlMessages id="button.ALL" />
              </Button>
            </div>
          }
        >
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            className="gx-table-responsive custom-identity-table"
            columns={columns}
            dataSource={identityData}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
          />
        </Card>
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
    loader: state.identitiesReducers.loader,
    showSuccessMessage: state.identitiesReducers.showSuccessMessage,
    successMessage: state.identitiesReducers.successMessage,
    //authUser : state.auth.authUser,
    showMessage: state.identitiesReducers.showMessage,
    alertMessage: state.identitiesReducers.alertMessage,
    status: state.identitiesReducers.status,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(IdentityList);
