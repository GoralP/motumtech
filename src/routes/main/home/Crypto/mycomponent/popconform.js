import React, { Component } from "react";
import {Row, Col, Card, Typography, Divider, Table, Button, message, Popconfirm, Badge, Tabs} from "antd";
import { Link } from 'react-router-dom'
import Auxiliary from "util/Auxiliary";

class Popconform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advalue : 'Active',
      status_color : '#52c41a',
      data : [],
      // columns : []
    };

  }

  render(){

    return (
        <div class="ant-popover-inner" role="tooltip">
        <div>
            <div class="ant-popover-inner-content">
                <div class="ant-popover-message"><span role="img" aria-label="exclamation-circle" class="anticon anticon-exclamation-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg></span>
                    <div class="ant-popover-message-title">Are you sure to delete this task?</div>
                </div>
                <div class="ant-popover-buttons">
                    <button type="button" class="ant-btn ant-btn-sm"><span>No</span></button>
                    <button type="button" class="ant-btn ant-btn-primary ant-btn-sm"><span>Yes</span></button>
                </div>
            </div>
        </div>
    </div>
    );
  }
};

export default Popconform;
