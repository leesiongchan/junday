import 'app/assets/css/main.css';

import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/controls');
  require('../stories/forms');

  // You can require as many stories as you need.
}

configure(loadStories, module);
