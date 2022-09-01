import PropTypes from 'prop-types';
import React from 'react';

import { DAYS, MONTHS } from '../../../constants/index';
import { Flex, Select, Text } from '@chakra-ui/react';
import { Separator } from 'bloben-components';
import translateLabel from '../../../utils/translateLabel';

const RepeatYearlyOnThe = ({
  id,
  mode,
  onThe,
  hasMoreModes,
  handleChange,
  translations,
}) => {
  const isActive = mode === 'on the';

  return (
    <Flex direction={'row'} alignItems={'center'}>
      {hasMoreModes && (
        <input
          id={id}
          type="radio"
          aria-label="Repeat yearly on the"
          name="repeat.yearly.mode"
          checked={isActive}
          value="on the"
          onClick={handleChange}
        />
      )}
      <Separator width={16} />
      <Text>{translateLabel(translations, 'repeat.yearly.on_the')}</Text>
      <Separator width={16} />
      <Select
        id={`${id}-which`}
        name="repeat.yearly.onThe.which"
        aria-label="Repeat yearly on the which"
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
        name="repeat.yearly.onThe.day"
        aria-label="Repeat yearly on the day"
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
      <Separator width={16} />
      <Text className="col-sm-1">
        {translateLabel(translations, 'repeat.yearly.of')}
      </Text>
      <Separator width={16} />
      <Select
        size={'lg'}
        id={`${id}-month`}
        name="repeat.yearly.onThe.month"
        aria-label="Repeat yearly on the month"
        className="form-control"
        value={onThe.month}
        disabled={!isActive}
        onChange={handleChange}
      >
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {translateLabel(translations, `months.${month.toLowerCase()}`)}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
RepeatYearlyOnThe.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['on', 'on the']).isRequired,
  onThe: PropTypes.shape({
    which: PropTypes.oneOf(['First', 'Second', 'Third', 'Fourth', 'Last'])
      .isRequired,
    month: PropTypes.oneOf(MONTHS).isRequired,
    day: PropTypes.oneOf(DAYS).isRequired,
  }).isRequired,
  hasMoreModes: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatYearlyOnThe;
