import BaseMobxForm from 'mobx-react-form';
import dvr from 'validatorjs';
import vjf from 'validator';

class MobxForm extends BaseMobxForm {
  constructor(props) {
    super({
      ...props,
      plugins: { dvr, vjf },
    });
  }
}

export function isEmail({ field, validator }) {
  return [validator.isEmail(field.value), `The ${field.label} should be an email address.`];
}

export default MobxForm;

