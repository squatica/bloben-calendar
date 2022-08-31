import PropTypes from 'prop-types';
import React from 'react';

import { DAYS } from '../../../constants/index';
import { Flex, Select, Text } from '@chakra-ui/react';
import Separator from '../../../../../../components/separator/Separator';
import translateLabel from '../../../utils/translateLabel';

const RepeatMonthlyOnThe = ({
  id,
  mode,
  onThe,
  hasMoreModes,
  handleChange,
  translations,
}) => {
  const isActive = mode === 'on the';

  return (
    <Flex alignItems={'center'}>
      {hasMoreModes && (
        <input
          id={id}
          type="radio"
          name="repeat.monthly.mode"
          aria-label="Repeat monthly on the"
          value="on the"
          checked={isActive}
          onChange={handleChange}
        />
      )}
      <Separator width={16} />
      <Text>{translateLabel(translations, 'repeat.monthly.on_the')}</Text>
      <Separator width={16} />
      <Select
        id={`${id}-which`}
        name="repeat.monthly.onThe.which"
        aria-label="Repeat monthly on the which"
        className="form-control"
        value={onThe.which}
        disabled={!isActive}
        onChange={handleChange}
      >
        <option value="First">
          {translateLabel(translations, 'numerals.first')}
        </option>
        <option value="Second">
          {translateLabel(translations, 'numerals.second')}
        </option>
        <option value="Third">
          {translateLabel(translations, 'numerals.third')}
        </option>
        <option value="Fourth">
          {translateLabel(translations, 'numerals.fourth')}
        </option>
        <option value="Last">
          {translateLabel(translations, 'numerals.last')}
        </option>
      </Select>
      <Separator width={16} />
      <Select
        id={`${id}-day`}
        name="repeat.monthly.onThe.day"
        aria-label="Repeat monthly on the day"
        className="form-control"
        value={onThe.day}
        disabled={!isActive}
        onChange={handleChange}
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>
            {translateLabel(translations, `days.${day.toLowerCase()}`)}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
RepeatMonthlyOnThe.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['on', 'on the']).isRequired,
  onThe: PropTypes.shape({
    which: PropTypes.oneOf(['First', 'Second', 'Third', 'Fourth', 'Last'])
      .isRequired,
    day: PropTypes.oneOf(DAYS).isRequired,
  }).isRequired,
  hasMoreModes: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatMonthlyOnThe;
