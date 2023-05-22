import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";

const InjectMassagePlace = props => <FormattedMessage {...props} />;
export default injectIntl(InjectMassagePlace, {
  withRef: false
});
