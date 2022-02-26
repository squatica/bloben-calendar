import RRule from 'rrule';

import computeEnd from './computeEnd';
import computeOptions from './computeOptions';
import computeRepeat from './computeRepeat';
import computeStart from './computeStart';

const computeRRule = ({ start, repeat, end, options }) => {
  const rruleObject = {
    ...computeStart(start),
    ...computeRepeat(repeat),
    ...computeEnd(end),
    ...computeOptions(options),
  };
  const rrule = new RRule(rruleObject);
  return rrule.toString();
};

export default computeRRule;
