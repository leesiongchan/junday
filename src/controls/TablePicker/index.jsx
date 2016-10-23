import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import shallowEqual from 'shallowequal';

import styles from './styles.css';

class TablePicker extends Component {
  static propTypes = {
    guest: PropTypes.shape({
      allocatedTableNum: PropTypes.number,
      partySize: PropTypes.number.isRequired,
    }).isRequired,
    numTables: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    seatingCapacity: PropTypes.number.isRequired,
    value: PropTypes.array,
  };

  static defaultProps = {
    numTables: 30,
    seatingCapacity: 10,
  };

  constructor(props) {
    super(props);

    this.state = {
      guest: props.guest,
      initialGuest: props.guest,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.guest, this.props.guest)) {
      this.setState({
        guest: nextProps.guest,
      });
    }
  }

  get tables() {
    const tables = [];

    for (let i = 0; i < this.props.numTables; i++) {
      tables.push({
        tableNum: i + 1,
        numPeople: 0,
      });
    }

    return _(this.props.value)
      .unionBy(tables, 'tableNum')
      .sortBy('tableNum')
      .value();
  }

  countOccupiedSeating(table) {
    if (
      table.tableNum === this.state.initialGuest.allocatedTableNum &&
      this.state.initialGuest.allocatedTableNum === this.state.guest.allocatedTableNum
    ) {
      return table.numPeople - this.state.initialGuest.partySize + this.state.guest.partySize;
    } else if (
      table.tableNum === this.state.initialGuest.allocatedTableNum &&
      this.state.initialGuest.allocatedTableNum !== this.state.guest.allocatedTableNum
    ) {
      return table.numPeople - this.state.initialGuest.partySize;
    } else if (
      table.tableNum === this.state.guest.allocatedTableNum &&
      this.state.initialGuest.allocatedTableNum !== this.state.guest.allocatedTableNum
    ) {
      return table.numPeople + this.state.guest.partySize;
    }

    return table.numPeople;
  }

  handleTableClick(table) {
    if (this.state.guest.partySize <= (this.props.seatingCapacity - table.numPeople)) {
      this.setState({
        guest: {
          ...this.state.guest,
          allocatedTableNum: table.tableNum,
        },
      }, () => {
        if (this.props.onChange) {
          this.props.onChange(table.tableNum);
        }
      });
    }
  }
  handleTableClick = ::this.handleTableClick;

  render() {
    const { seatingCapacity } = this.props;
    const { guest } = this.state;

    return (
      <div className={styles.main}>
        {this.tables.map(table =>
          <div className={styles.item} key={table.tableNum}>
            <div
              className={cx(styles.table, {
                [styles.busy]: (seatingCapacity - this.countOccupiedSeating(table)) / seatingCapacity <= 0.5,
                [styles.free]: seatingCapacity - this.countOccupiedSeating(table) > 0,
                [styles.full]: seatingCapacity - this.countOccupiedSeating(table) === 0,
                [styles.overCapacity]: seatingCapacity - this.countOccupiedSeating(table) < 0,
                [styles.selected]: guest.allocatedTableNum === table.tableNum,
              })}
              onClick={() => this.handleTableClick(table)}
            >
              <span className={styles.tableNum}>#{table.tableNum}</span>
              <span className={styles.capacity}>
                {this.countOccupiedSeating(table)}
                {' / '}
                {seatingCapacity}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TablePicker;
