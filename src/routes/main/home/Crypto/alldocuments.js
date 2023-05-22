import React from "react";
import {Avatar, Input, Modal, Select, Table} from "antd";
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import DateWithoutTimeHelper from "./../../../helper/DateWithoutTimeHelper";

import {get_alldocuments,hideMessage,setstatustoinitial,showAlldocumentorsLoader} from "./../../../../appRedux/actions/AlldocumentsActions";
import CircularProgress from "./../../../../components/CircularProgress/index";

import IntlMessages from "util/IntlMessages";

class AllDocuments extends React.Component {

  get_alldocumentsById(pageNumber = '', visit_id = ''){
    if(this.props.status == 'Initial' || (pageNumber == '' && visit_id != '')){
        this.props.get_alldocuments({'pageNumber': 1, 'visit_id': visit_id});
      } else {
        this.props.get_alldocuments({'pageNumber': pageNumber, 'visit_id': visit_id});
      }
  }

  componentDidMount(){
      this.props.setstatustoinitial();
      //this.get_alldocumentsById()
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.open) {
      if(prevProps.visit_id !== undefined || prevProps.visit_id !== this.props.visit_id) {
        this. get_alldocumentsById(1, this.props.visit_id);
      }
    } 
  }

  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    /*this.get_identitiesById({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });*/
    this.get_alldocumentsById(pagination.current, this.props.visit_id);
  };


  constructor(props) {
    super(props);

    // const {id, dni, sanidad, dni2, dni3, dni4, name} = props.contact;
    this.state = {
      pagination: {},
      loading: false,
      // id,
      // dni,
      // sanidad,
      // dni2,
      // dni3,
      // dni4,
      // name
    }
  }

  render() {
    const Option = Select.Option;
    const {onDocumentsClose, open, contact} = this.props;

    var AlldocumentsData = this.props.getAlldocumentsData;
    var AlldocumentData = '';
    //if(isEmpty(identitiesData)) {
    if(!AlldocumentsData) {
        // Object is empty (Would return true in this example)
    } else {
        // Object is NOT empty
        AlldocumentData = AlldocumentsData.DocumentList;
        
        const pagination = { ...this.state.pagination };
        
        pagination.total = AlldocumentsData.TotalCount;
        pagination.current = this.state.pagination.current ? this.state.pagination.current : 1;
        if(pagination.current != '' && this.state.pagination.current == undefined){
          this.setState({
            pagination,
          });
        }
    }
    // const {id, dni, sanidad, dni2, dni3, dni4, name} = this.state;

    const columns = [
      {
        title: 'Document Name',
        dataIndex: 'DocumentName',
        key: 'DocumentName',
        render: text => <span className="">{text}</span>,
      },
      {
        title: 'Owner Name',
        dataIndex: 'OwnerName',
        key: 'OwnerName',
        render: text => <span className="">{text}</span>,
      },
      {
        title: 'Owner NIF',
        dataIndex: 'OwnerNIF',
        key: 'OwnerNIF',
        render: text => <span className="">{text}</span>,
      },
      {
        title: 'Owner Email',
        dataIndex: 'OwnerEmail',
        key: 'OwnerEmail',
        render: text => <span className="">{text}</span>,
      },
      {
        title: 'Creation Date',
        dataIndex: 'CreationDate',
        key: 'CreationDate',
        render: text => <span className="">{DateWithoutTimeHelper(text)}</span>,
      },
      {
        title: 'Document Type',
        dataIndex: 'DocumentType',
        key: 'DocumentType',
      },
      {
        title: 'Procedure Type',
        dataIndex: 'ProcedureType',
        key: 'ProcedureType',
      },
      {
        title: 'Signed Date',
        dataIndex: 'SignedDate',
        key: 'SignedDate',
        render: text => <span className="">{ (DateWithoutTimeHelper(text) != '01-01-1970') ? DateWithoutTimeHelper(text) : '-' } </span>,
      }
    ];

    return (
      <Modal title="Document List"
        toggle={onDocumentsClose} visible={open}
        closable={true}
        footer={null}
        onOk={() => {
          // if (name === '')
          //   return;
          onDocumentsClose();
        }}
        onCancel={onDocumentsClose}>
        <Table className="gx-table-responsive" columns={columns} dataSource={AlldocumentData}/>
      </Modal>
    );
  }
}

// Object of action creators
const mapDispatchToProps = {
  get_alldocuments,
  hideMessage,
  setstatustoinitial,
}

const mapStateToProps =  state => {
return { 
      getAlldocumentsData: state.alldocumentsReducers.get_alldocuments_res ,
      loader : state.alldocumentsReducers.loader,
      showSuccessMessage : state.alldocumentsReducers.showSuccessMessage,
      successMessage : state.alldocumentsReducers.successMessage,
      //authUser : state.auth.authUser,
      showMessage : state.alldocumentsReducers.showMessage,
      alertMessage : state.alldocumentsReducers.alertMessage,
      status : state.alldocumentsReducers.status,
  }; 
};

// export default AllDocuments;
export default connect(mapStateToProps,mapDispatchToProps)(AllDocuments);