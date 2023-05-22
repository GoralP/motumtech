import React from "react";
import {Avatar, Input, Modal} from "antd";

import IntlMessages from "util/IntlMessages";

class EmployeeCheck extends React.Component {
  constructor(props) {
    super(props);

    const {id, dni} = props.contact;
    this.state = {
      id,
      dni
    }
  }

  render() {
    const {onSaveEmployee, onEmployeeClose, open, contact} = this.props;
    const {id, dni} = this.state;
    return (
      <Modal title="Enter Identifier Number"
        toggle={onEmployeeClose} visible={open}
        closable={false}
        onOk={() => {
          if (dni === '')
            return;
          onEmployeeClose();
          onSaveEmployee(
            {
              'id': id,
              'dni': dni
            });
          this.setState({
            'id': id + 1,
            'dni': '',
          })

        }}
        onCancel={onEmployeeClose}>

        <div className="gx-modal-box-row">
          <div className="gx-modal-box-form-item">
            <div className="gx-form-group">
              <Input
                required
                placeholder="Identifier/DNI*"
                onChange={(event) => this.setState({dni: event.target.value})}
                defaultValue={dni}
                margin="none"/>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default EmployeeCheck;
