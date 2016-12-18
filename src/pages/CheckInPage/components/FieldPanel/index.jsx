import cx from 'classnames';
import React, { Component, PropTypes } from 'react';

import styles from './styles.css';

class FieldPanel extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelHtmlFor: PropTypes.string,
  };

  render() {
    const { children, className, label, labelHtmlFor } = this.props;

    return (
      <div className={cx(styles.main, className)}>
        <div className={styles.labelPane}>
          <label className={styles.label} htmlFor={labelHtmlFor}>{label}</label>
        </div>

        <div className={styles.fieldPane}>
          {children}
        </div>
      </div>
    );
  }
}

export default FieldPanel;
