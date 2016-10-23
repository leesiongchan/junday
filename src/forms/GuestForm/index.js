import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { action } from 'mobx';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { TextField } from 'material-ui';

import Loader from 'app/components/Loader';
import styles from './styles.css';

@observer
class GuestForm extends Component {
  static propTypes = {
    guest: MobxPropTypes.observableObject.isRequired,
    settingStore: PropTypes.object.isRequired,
    tableStore: PropTypes.object.isRequired,
  };

  @action
  handleInputChange(ev) {
    this.props.guest[ev.target.name] = ev.target.value;

    // We need to further checking to determine whether the partySize has exceed
    // the capacity of the table.
    if (ev.target.name === 'partySize' && this.props.guest.allocatedTableNum !== null) {
      const table = this.props.tableStore.items.find(t => t.tableNum === this.props.guest.allocatedTableNum);

      if (table && this.props.guest.partySize > (this.props.settingStore.seatingCapacity - table.numPeople)) {
        this.props.guest.allocatedTableNum = null;
      }
    }
  }
  handleInputChange = ::this.handleInputChange;

  @action
  handleTableClick(table) {
    if (this.props.guest.partySize <= (this.props.settingStore.seatingCapacity - table.numPeople)) {
      this.props.guest.allocatedTableNum = table.tableNum;
    }
  }
  handleTableClick = ::this.handleTableClick;

  render() {
    const { guest, settingStore, tableStore } = this.props;

    return (
      <form className={styles.main}>
        <aside className={styles.aside}>
          <TextField
            floatingLabelFixed
            floatingLabelText="Name*"
            fullWidth
            hintText="Harvey Spectre"
            keyboardFocused
            name="name"
            onChange={this.handleInputChange}
            required
            type="text"
            value={guest.name}
          />

          <TextField
            floatingLabelFixed
            floatingLabelText="Affiliation"
            fullWidth
            hintText="Bride's friend"
            name="affiliation"
            onChange={this.handleInputChange}
            required
            type="text"
            value={guest.affiliation}
          />

          <TextField
            floatingLabelFixed
            floatingLabelText="Party Size*"
            fullWidth
            hintText="3"
            min={0}
            name="partySize"
            onChange={this.handleInputChange}
            required
            type="number"
            value={guest.partySize}
          />

          <TextField
            floatingLabelFixed
            floatingLabelText="Remarks"
            fullWidth
            hintText="He is a vegetarian."
            multiLine
            name="remarks"
            onChange={this.handleInputChange}
            required
            rows={3}
            rowsMax={3}
            value={guest.remarks}
          />
        </aside>

        <div className={styles.content}>
          <span className={styles.label}>Table Allocation* <i>(Select to assign a table for your guest)</i></span>

          {tableStore.items &&
            <div className={styles.tables}>
              {tableStore.items.map(table =>
                <div className={styles.tableItem} key={table.id}>
                  <div
                    className={cx(styles.table, {
                      [styles.busy]: (settingStore.seatingCapacity - table.numPeople) / settingStore.seatingCapacity <= 0.5,
                      [styles.free]: settingStore.seatingCapacity - table.numPeople > 0,
                      [styles.full]: settingStore.seatingCapacity - table.numPeople === 0,
                      [styles.overCapacity]: guest.partySize > (settingStore.seatingCapacity - table.numPeople),
                      [styles.selected]: guest.allocatedTableNum === table.tableNum,
                    })}
                    onClick={() => this.handleTableClick(table)}
                  >
                    <span className={styles.tableNum}>#{table.tableNum}</span>
                    <span className={styles.capacity}>{table.numPeople} / {settingStore.seatingCapacity}</span>
                  </div>
                </div>
              )}
            </div>
          }

          {!tableStore.items &&
            <Loader />
          }
        </div>
      </form>
    );
  }
}

export default GuestForm;
