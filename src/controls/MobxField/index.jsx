import React, { Component, PropTypes } from 'react';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';

@observer
class MobxField extends Component {
  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.any.isRequired,
    field: MobxPropTypes.observableObject.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  };

  get isToggle() {
    return this.props.type === 'radio' || this.props.type === 'checkbox';
  }

  handleChange(ev) {
    this.props.field.sync((ev.target && ev.target.rawValue) || ev);
  }
  handleChange = ::this.handleChange;

  render() {
    const { className, component, field, placeholder, type, ...props } = this.props;

    return React.createElement(component, {
      ...props,
      checked: this.isToggle ? field.value : null,
      className,
      disabled: field.disabled,
      errorText: field.error,
      floatingLabelText: placeholder || field.label,
      name: field.name,
      onChange: this.handleChange,
      type,
      value: !this.isToggle ? field.value || '' : null,
    });
  }
}

export default MobxField;
