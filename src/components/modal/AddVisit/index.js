import React from "react";
import {Avatar, Input, Modal, Select,Col} from "antd";

import IntlMessages from "util/IntlMessages";

class AddVisit extends React.Component {
  constructor(props) {
    super(props);

    const {id, dni, company_name, host_name, procedure} = props.contact;
    this.state = {
      id,
      dni,
      company_name,
      host_name,
      procedure
    }
  }

  render() {
    const Option = Select.Option;
    const {onSaveVisit, onVisitClose, open, contact} = this.props;
    const {id, dni, company_name, host_name, procedure} = this.state;
    return (
      <Modal title="Add Visit"
        toggle={onVisitClose} visible={open}
        closable={false}
        onOk={() => {
          if (dni === '')
            return;
          onVisitClose();
          onSaveVisit(
            {
              'id': id,
              'dni': dni,
              'company_name': company_name,
              'host_name': host_name,
              'procedure': procedure
            });
          this.setState({
            'id': id + 1,
            'dni': '',
            'company_name': '',
            'host_name': '',
            'procedure': '',
          })

        }}
        onCancel={onVisitClose}>

        <div className="gx-modal-box-row">
          <div className="gx-modal-box-form-item">
            <div className="gx-form-group">
            
              <Input
                required
                placeholder="Enter the DNI*"
                onChange={(event) => this.setState({dni: event.target.value})}
                defaultValue={dni}
                margin="none"/>
                
                
            </div>
            {/* ------------------------------------------------------------- */}

            <div className="gx-form-group">
              
            <Col xl={6} lg={12} md={12} sm={12} xs={24}>
              <Input
                required
                placeholder="Company Name*"
                onChange={(event) => this.setState({company_name: event.target.value})}
                defaultValue={company_name}
                margin="none"/>
            </Col>
            
            </div>
            <div className="gx-form-group">
              <Input
                placeholder="Host name*"
                onChange={(event) => this.setState({host_name: event.target.value})}
                value={host_name}
                margin="normal"/>
            </div>


            
            <div className="gx-form-group">
              <Select className="ant-input"
                onChange={(event) => this.setState({procedure: event.target.value})}
                defaultValue="Select Procedure*"
                margin="none">
                <Option value="jack">Jack</Option>
                <Option value="Visit Report">Visit Report</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddVisit;
