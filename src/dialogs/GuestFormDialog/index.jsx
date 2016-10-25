import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Dialog, FlatButton } from 'material-ui';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { computed } from 'mobx';

import GuestForm from 'app/forms/GuestForm';
import styles from './styles.css';

@observer
class GuestFormDialog extends Component {
  static propTypes = {
    fields: MobxPropTypes.observableObject.isRequired,
    numTables: PropTypes.number.isRequired,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    open: PropTypes.bool,
    seatingCapacity: PropTypes.number.isRequired,
    tables: PropTypes.array,
  };

  @computed
  get guest() {
    const guest = this.props.fields.values();

    return {
      ...guest,
      allocatedTableNum: parseInt(guest.allocatedTableNum, 10),
      partySize: parseInt(guest.partySize, 10),
    };
  }

  @computed
  get isNew() {
    return this.guest.id === null || this.guest.id === '';
  }

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
    const { fields, onClose, open, numTables, seatingCapacity, tables } = this.props;

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
            label={this.isNew ? 'Add' : 'Save'}
            onTouchTap={this.handleSubmit}
            primary
          />,
        ]}
        contentStyle={{ maxWidth: 954, width: 'auto' }}
        onRequestClose={onClose}
        open={open}
        title={this.isNew ? 'Add Guest' : 'Edit Guest'}
      >
        {fields.error &&
          <p className={styles.error}>
            {fields.error}
          </p>
        }

        <GuestForm fields={fields} numTables={numTables} seatingCapacity={seatingCapacity} tables={tables} />
      </Dialog>
    );
  }
}

export default GuestFormDialog;
