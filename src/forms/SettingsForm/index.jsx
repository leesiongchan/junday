import React, { Component, PropTypes } from 'react';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { TextField } from 'material-ui';

import MobxField from 'app/controls/MobxField';

const formFields = [
  'numTables',
  'seatingCapacity',
];

const labels = {
  numTables: 'Number of Tables',
  seatingCapacity: 'Table Seating Capacity',
};

const rules = {
  numTables: 'required|integer|between:1,48',
  seatingCapacity: 'required|integer|between:1,99',
};

export const formOptions = { fields: formFields, labels, rules };

@observer
class SettingsForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    fields: MobxPropTypes.observableObject.isRequired,
  };

  render() {
    const { className, fields } = this.props;

    return (
      <div className={className}>
        <div>
          <MobxField
            component={TextField}
            field={fields.$('numTables')}
            floatingLabelFixed
            hintText="48"
            max={48}
            min={1}
            required
            type="number"
          />
        </div>

        <div>
          <MobxField
            component={TextField}
            field={fields.$('seatingCapacity')}
            floatingLabelFixed
            hintText="10"
            max={99}
            min={1}
            required
            type="number"
          />
        </div>
      </div>
    );
  }
}

export default SettingsForm;
