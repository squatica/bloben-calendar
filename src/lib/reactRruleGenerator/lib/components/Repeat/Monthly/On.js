import { Flex, Select, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Separator from '../../../../../../components/separator/Separator';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

const RepeatMonthlyOn = ({
  id,
  mode,
  on,
  hasMoreModes,
  handleChange,
  translations,
}) => {
  const isActive = mode === 'on';

  return (
    <Flex direction={'row'} alignItems={'center'}>
      {hasMoreModes && (
        <input
          id={id}
          type="radio"
          name="repeat.monthly.mode"
          aria-label="Repeat monthly on"
          value="on"
          checked={isActive}
          onChange={handleChange}
        />
      )}
      <Separator width={16} />
      <Text>{translateLabel(translations, 'repeat.monthly.on_day')}</Text>
      <Separator width={16} />
      <Select
        size={'lg'}
        id={`${id}-day`}
        name="repeat.monthly.on.day"
        aria-label="Repeat monthly on a day"
        className="form-control"
        value={on.day}
        disabled={!isActive}
        onChange={numericalFieldHandler(handleChange)}
        width={70}
      >
        {[...new Array(31)].map((day, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
RepeatMonthlyOn.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['on', 'on the']).isRequired,
  on: PropTypes.shape({
    day: PropTypes.number.isRequired,
  }).isRequired,
  hasMoreModes: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatMonthlyOn;
