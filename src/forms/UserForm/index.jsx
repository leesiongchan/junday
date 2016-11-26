import React, { Component, PropTypes } from 'react';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { TextField } from 'material-ui';

import MobxField from 'app/controls/MobxField';

const formFields = [
  'email',
  'password',
];

const labels = {
  email: 'Email Address',
  password: 'Password',
};

const rules = {
  email: 'required|email',
  password: 'required|between:8,30',
};

export const formOptions = { fields: formFields, labels, rules };

@observer
class UserForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    fields: MobxPropTypes.observableObject.isRequired,
    fullWidth: PropTypes.bool,
  };

  render() {
    const { className, fields, fullWidth } = this.props;

    return (
      <div className={className}>
        <div>
          <MobxField
            component={TextField}
            field={fields.$('email')}
            floatingLabelFixed
            fullWidth={fullWidth}
            required
            type="email"
          />
        </div>

        <div>
          <MobxField
            component={TextField}
            field={fields.$('password')}
            floatingLabelFixed
            fullWidth={fullWidth}
            required
            type="password"
          />
        </div>
      </div>
    );
  }
}

export default UserForm;
