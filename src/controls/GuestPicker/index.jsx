import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Creatable from './Creatable';
import styles from './styles.css';

@observer
class GuestPicker extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    className: PropTypes.string,
    guestStore: PropTypes.object.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  };

  @computed
  get guests() {
    return this.props.guestStore.items.map(guest => ({
      guest,
      label: guest.name,
      value: guest.id,
    }));
  }

  handleChange({ label, value }) {
    if (this.props.onChange) {
      this.props.onChange({ label, value }); // We do not want to expose the entire guest object.
    }
  }
  handleChange = ::this.handleChange;

  handleNewOptionClick(option) {
    this.props.appStore.toggleGuestFormDialog(true, {
      name: option.value,
    });
  }
  handleNewOptionClick = ::this.handleNewOptionClick;

  handleOptionRenderer({ className, guest, value }) {
    if (!guest) {
      return (
        <span className={className}>{value}</span>
      );
    }

    return (
      <span className={cx(styles.label, className)}>
        <span>{guest.name}</span>
        <span className={cx(styles.status, { [styles.checkedIn]: guest.status === 'registered' })}>
          {guest.status !== 'registered' ? 'Not Registered' : 'Registered'}
        </span>
      </span>
    );
  }
  handleOptionRenderer = ::this.handleOptionRenderer;

  handlePromptTextCreator(label) {
    return `Add new guest "${label}"`;
  }
  handlePromptTextCreator = ::this.handlePromptTextCreator;

  render() {
    const { className, guestStore, name, placeholder, value } = this.props;

    return (
      <Creatable
        className={className}
        clearable={false}
        isLoading={guestStore.isLoading}
        name={name}
        onChange={this.handleChange}
        onNewOptionClick={this.handleNewOptionClick}
        optionRenderer={this.handleOptionRenderer}
        options={this.guests}
        placeholder={placeholder}
        promptTextCreator={this.handlePromptTextCreator}
        value={value}
      />
    );
  }
}

export default GuestPicker;
