import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Dialog, FlatButton } from 'material-ui';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';

import UserForm from 'app/forms/UserForm';
import styles from './styles.css';

@observer
class SignUpFormDialog extends Component {
  static propTypes = {
    fields: MobxPropTypes.observableObject.isRequired,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    open: PropTypes.bool,
  };

  handleSubmit(ev) {
    this.props.fields.onSubmit(ev, {
      onError: (form) => {
        const error = _.filter(form.errors(), e => !!e)[0];

        form.invalidate(error);
      },
      onSuccess: (form) => {
        if (this.props.onSubmit) {
          this.props.onSubmit(form.values());
        }
      },
    });
  }
  handleSubmit = ::this.handleSubmit;

  render() {
    const { fields, onClose, open } = this.props;

    return (
      <Dialog
        actions={[
          <FlatButton
            disabled={this.submitting}
            label="Cancel"
            onTouchTap={onClose}
          />,
          <FlatButton
            disabled={!fields.isValid || this.submitting}
            label="Create"
            onTouchTap={this.handleSubmit}
            primary
          />,
        ]}
        contentStyle={{ maxWidth: 400, width: 'auto' }}
        modal
        onRequestClose={onClose}
        open={open}
        title="Create User"
      >
        {fields.error &&
          <p className={styles.error}>
            {fields.error}
          </p>
        }

        <UserForm fields={fields} fullWidth />
      </Dialog>
    );
  }
}

export default SignUpFormDialog;
