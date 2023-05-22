import React from "react";
import {Avatar, Input, Modal, Row, Col, Select, Checkbox} from "antd";

import IntlMessages from "util/IntlMessages";

class AddProcess extends React.Component {
  constructor(props) {
    super(props);

    const {id, dni, sanidad, dni2, dni3, cip, tratamiento} = props.contact;
    this.state = {
      id,
      dni,
      sanidad,
      dni2,
      dni3,
      cip,
      tratamiento
    }
  }

  render() {
    const Option = Select.Option;
    const {onSaveProcess, onProcessClose, open, contact} = this.props;
    const {id, dni, sanidad, dni2, dni3, cip, tratamiento} = this.state;
    return (
      <Modal title="New Process"
        toggle={onProcessClose} visible={open}
        closable={false}
        onOk={() => {
          if (dni === '')
            return;
          onProcessClose();
          onSaveProcess(
            {
              'id': id,
              'dni': dni,
              'sanidad': sanidad,
              'dni2': dni2,
              'dni3': dni3,
              'cip': cip,
              'tratamiento': tratamiento
            });
          this.setState({
            'id': id + 1,
            'dni': '',
            'sanidad': '',
            'dni2': '',
            'dni3': '',
            'cip': '',
            'tratamiento': '',
          })

        }}
        onCancel={onProcessClose}>

        <div className="gx-modal-box-row">
          <div className="gx-modal-box-form-item">
            <div className="gx-form-group">
              <Input
                required
                placeholder="DNI*"
                onChange={(event) => this.setState({dni: event.target.value})}
                defaultValue={dni}
                margin="none"/>
            </div>
            <div className="gx-form-group">
              <Select className="ant-input"
                onChange={(event) => this.setState({sanidad: event.target.value})}
                defaultValue="SANIDAD"
                margin="none">
                <Option value="jack">Jack</Option>
                <Option value="Visit Report">Visit Report</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </div>
            <div className="gx-form-group">
              <Row>
                <Col lg={18}>
                  <Input
                    required
                    placeholder="DNI 2"
                    onChange={(event) => this.setState({dni2: event.target.value})}
                    defaultValue={dni2}
                    margin="none"/>
                </Col>
                <Col lg={6}>
                  <Checkbox>Is Singer</Checkbox>
                </Col>
              </Row>
            </div>
            <div className="gx-form-group">
              <Row>
                <Col lg={18}>
                  <Input
                    required
                    placeholder="DNI 3"
                    onChange={(event) => this.setState({dni3: event.target.value})}
                    defaultValue={dni3}
                    margin="none"/>
                </Col>
                <Col lg={6}>
                  <Checkbox>Is Singer</Checkbox>
                </Col>
              </Row>
            </div>
            <div className="gx-form-group">
              <Input
                required
                placeholder="CIP"
                onChange={(event) => this.setState({cip: event.target.value})}
                defaultValue={cip}
                margin="none"/>
            </div>
            <div className="gx-form-group">
              <Input
                required
                placeholder="Tratamiento"
                onChange={(event) => this.setState({tratamiento: event.target.value})}
                defaultValue={tratamiento}
                margin="none"/>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddProcess;
