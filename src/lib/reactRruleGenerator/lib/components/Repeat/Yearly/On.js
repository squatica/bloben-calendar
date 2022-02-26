import { range } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { Flex, Select, Text } from '@chakra-ui/react';
import { MONTHS } from '../../../constants/index';
import Separator from '../../../../../../components/separator/Separator';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

const RepeatYearlyOn = ({
  id,
  mode,
  on,
  hasMoreModes,
  handleChange,
  translations,
}) => {
  const daysInMonth = moment(on.month, 'MMM').daysInMonth();
  const isActive = mode === 'on';

  return (
    <Flex direction={'row'} alignItems={'center'}>
      {hasMoreModes && (
        <input
          id={id}
          type="radio"
          name="repeat.yearly.mode"
          aria-label="Repeat yearly on"
          value="on"
          checked={isActive}
          onChange={handleChange}
        />
      )}
      <Separator width={16} />
      <Text>{translateLabel(translations, 'repeat.yearly.on')}</Text>
      <Separator width={16} />
      <Select
        size={'lg'}
        id={`${id}-month`}
        name="repeat.yearly.on.month"
        aria-label="Repeat yearly on month"
        className="form-control"
        value={on.month}
        disabled={!isActive}
        onChange={handleChange}
      >
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {translateLabel(translations, `months.${month.toLowerCase()}`)}
          </option>
        ))}
      </Select>
      <Separator width={16} />
      <Select
        size={'lg'}
        id={`${id}-day`}
        name="repeat.yearly.on.day"
        aria-label="Repeat yearly on a day"
        className="form-control"
        value={on.day}
        disabled={!isActive}
        onChange={numericalFieldHandler(handleChange)}
      >
        {range(0, daysInMonth).map((i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
RepeatYearlyOn.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['on', 'on the']).isRequired,
  on: PropTypes.shape({
    month: PropTypes.oneOf(MONTHS).isRequired,
    day: PropTypes.number.isRequired,
  }).isRequired,
  hasMoreModes: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatYearlyOn;
