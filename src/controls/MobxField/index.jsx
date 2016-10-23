import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';

import styles from './styles.css';

@observer
class MobxField extends Component {
  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.any.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    field: MobxPropTypes.observableObject.isRequired,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    error: true,
  };

  get isToggle() {
    return this.props.type === 'radio' || this.props.type === 'checkbox';
  }

  handleChange(ev) {
    this.props.field.sync((ev.target && ev.target.rawValue) || ev);
  }
  handleChange = ::this.handleChange;

  render() {
    const { className, component, error, field, inputClassName, placeholder, type, ...props } = this.props;

    return (
      <div className={cx(styles.main, className)}>
        {React.createElement(component, {
          ...props,
          checked: this.isToggle ? field.value : null,
          className: inputClassName,
          disabled: field.disabled,
          name: field.name,
          onChange: this.handleChange,
          placeholder: placeholder || field.label,
          type,
          value: !this.isToggle ? field.value || '' : null,
        })}

        {error && field.error &&
          <p className={styles.error}>
            {typeof error === 'boolean' ? field.error : error}
          </p>
        }
      </div>
    );
  }
}

export default MobxField;
