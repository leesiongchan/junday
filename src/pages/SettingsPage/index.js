import React, { Component, PropTypes } from 'react';
import { action, observable, runInAction } from 'mobx';
import { Card, RaisedButton, TextField } from 'material-ui';
import { observer } from 'mobx-react';

import styles from './styles.css';

@observer
class Settings extends Component {
  static propTypes = {
    settingStore: PropTypes.object.isRequired,
  };

  @observable submitting = false;

  handleInputChange(ev) {
    this.props.settingStore[ev.target.name] = ev.target.value;
  }
  handleInputChange = ::this.handleInputChange;

  @action
  async handleSaveClick(ev) {
    this.submitting = true;

    await this.props.settingStore.save();
    this.props.settingStore.rearrangeTables();

    runInAction(() => {
      this.submitting = false;
    });
  }
  handleSaveClick = ::this.handleSaveClick;

  render() {
    return (
      <div className={styles.main}>
        <Card>
          <div className={styles.content}>
            <section className={styles.section}>
              <TextField
                disabled={this.submitting}
                floatingLabelFixed
                floatingLabelText="Number of Tables*"
                hintText="30"
                min={1}
                name="numTables"
                onChange={this.handleInputChange}
                required
                type="number"
                value={this.props.settingStore.numTables}
              />
            </section>

            <section className={styles.section}>
              <TextField
                disabled={this.submitting}
                floatingLabelFixed
                floatingLabelText="Table Seating Capacity*"
                hintText="10"
                min={1}
                name="seatingCapacity"
                onChange={this.handleInputChange}
                required
                type="number"
                value={this.props.settingStore.seatingCapacity}
              />
            </section>

            <footer className={styles.footer}>
              <RaisedButton
                disabled={this.submitting || this.props.settingStore.pristine}
                label="Save"
                onClick={this.handleSaveClick}
              />
            </footer>
          </div>
        </Card>
      </div>
    );
  }
}

export default Settings;
