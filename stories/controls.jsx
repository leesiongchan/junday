import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TablePicker from 'app/controls/TablePicker';

const guest = {
  partySize: 1,
};

storiesOf('Pickers', module)
  .add('Table picker', () => (
    <TablePicker guest={guest} onChange={action('changed')} />
  ));
