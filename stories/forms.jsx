import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import GuestForm, { formOptions as guestFormOptions } from 'app/forms/GuestForm';
import MobxForm from 'app/libs/mobx-react-form';
import SettingsForm, { formOptions as settingsFormOptions } from 'app/forms/SettingsForm';

const tables = [{
  tableNum: 2,
  numPeople: 7,
}, {
  tableNum: 4,
  numPeople: 10,
}, {
  tableNum: 6,
  numPeople: 2,
}, {
  tableNum: 9,
  numPeople: 5,
}, {
  tableNum: 15,
  numPeople: 8,
}, {
  tableNum: 22,
  numPeople: 5,
}, {
  tableNum: 25,
  numPeople: 6,
}, {
  tableNum: 28,
  numPeople: 7,
}];
const guest = {
  name: 'Lee Siong Chan',
};
const settings = {
  numTables: 17,
  seatingCapacity: 6,
};

const guestForm = new MobxForm({ ...guestFormOptions, values: guest });
const settingsForm = new MobxForm({ ...settingsFormOptions, values: settings });

storiesOf('Forms', module)
  .addDecorator(story => (
    <MuiThemeProvider>
      {story()}
    </MuiThemeProvider>
  ))
  .add('Guest form', () => (
    <GuestForm
      fields={guestForm}
      numTables={settings.numTables}
      seatingCapacity={settings.seatingCapacity}
      tables={tables}
    />
  ))
  .add('Settings form', () => (
    <SettingsForm fields={settingsForm} />
  ));
