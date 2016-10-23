import React, { PropTypes } from 'react';
import { CircularProgress } from 'material-ui';

import styles from './styles.css';

const Loader = ({ mode = 'indeterminate', size = 1, value }) => (
  <div className={styles.main}>
    <CircularProgress mode={mode} size={size} value={value} />
  </div>
);
Loader.propTypes = {
  mode: PropTypes.string,
  size: PropTypes.number,
  value: PropTypes.string,
};

export default Loader;
