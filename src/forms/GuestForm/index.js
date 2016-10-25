import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { computed } from 'mobx';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { TextField } from 'material-ui';

import MobxField from 'app/controls/MobxField';
import styles from './styles.css';
import TablePicker from 'app/controls/TablePicker';

const formFields = [
  'affiliation',
  'allocatedTableNum',
  'id',
  'name',
  'partySize',
  'remarks',
];

const labels = {
  affiliation: 'Affiliation',
  allocatedTableNum: 'Table',
  name: 'Name',
  partySize: 'Party Size',
  remarks: 'Remarks',
};

const rules = {
  allocatedTableNum: 'required|integer',
  name: 'required',
  partySize: 'required|integer|between:1,10',
};

export const formOptions = { fields: formFields, labels, rules };

@observer
class GuestForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    fields: MobxPropTypes.observableObject.isRequired,
    numTables: PropTypes.number,
    seatingCapacity: PropTypes.number,
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

  render() {
    const { className, fields, numTables, seatingCapacity, tables } = this.props;

    return (
      <div className={cx(styles.main, className)}>
        <aside className={styles.aside}>
          <MobxField
            component={TextField}
            field={fields.$('name')}
            floatingLabelFixed
            fullWidth
            hintText="Harvey Spectre"
            name="name"
            required
            type="text"
          />

          <MobxField
            component={TextField}
            field={fields.$('affiliation')}
            floatingLabelFixed
            fullWidth
            hintText="Bride's friend"
            name="affiliation"
            required
            type="text"
          />

          <MobxField
            component={TextField}
            field={fields.$('partySize')}
            floatingLabelFixed
            fullWidth
            hintText="3"
            max={seatingCapacity}
            min={1}
            name="partySize"
            required
            type="number"
          />

          <MobxField
            component={TextField}
            field={fields.$('remarks')}
            floatingLabelFixed
            fullWidth
            hintText="He is a vegetarian."
            multiLine
            name="remarks"
            required
            rows={3}
            rowsMax={3}
          />

          {fields.$('allocatedTableNum').error &&
            <p className={styles.error}>
              {fields.$('allocatedTableNum').error}
            </p>
          }
        </aside>

        <div className={styles.content}>
          <span className={styles.label}>
            Table Allocation <i>(Select to assign a table for your guest)</i>
          </span>

          <TablePicker
            guest={this.guest}
            numTables={numTables}
            onChange={fields.$('allocatedTableNum').sync}
            seatingCapacity={seatingCapacity}
            value={tables}
          />
        </div>
      </div>
    );
  }
}

export default GuestForm;
