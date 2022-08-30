import { Flex, Input, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import RepeatMonthlyOn from './On';
import RepeatMonthlyOnThe from './OnThe';
import Separator from '../../../../../../components/separator/Separator';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

const RepeatMonthly = ({
  id,
  monthly: { mode, interval, on, onThe, options },
  handleChange,
  translations,
}) => {
  const isTheOnlyOneMode = (option) => options.modes === option;
  const isOptionAvailable = (option) =>
    !options.modes || isTheOnlyOneMode(option);

  return (
    <Flex direction={'column'}>
      <Flex direction={'row'} alignItems={'center'}>
        <Text>{translateLabel(translations, 'repeat.monthly.every')}</Text>
        <Separator width={16} />
        <Input
          size={'lg'}
          id={`${id}-interval`}
          name="repeat.monthly.interval"
          aria-label="Repeat monthly interval"
          className="form-control"
          value={interval}
          width={50}
          onChange={numericalFieldHandler(handleChange)}
        />
        <Separator width={16} />
        <Text>{translateLabel(translations, 'repeat.monthly.months')}</Text>
      </Flex>
      <Separator height={16} />
      {isOptionAvailable('on') && (
        <RepeatMonthlyOn
          id={`${id}-on`}
          mode={mode}
          on={on}
          hasMoreModes={!isTheOnlyOneMode('on')}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      <Separator height={16} />
      {isOptionAvailable('on the') && (
        <RepeatMonthlyOnThe
          id={`${id}-onThe`}
          mode={mode}
          onThe={onThe}
          hasMoreModes={!isTheOnlyOneMode('on the')}
          handleChange={handleChange}
          translations={translations}
        />
      )}
    </Flex>
  );
};

RepeatMonthly.propTypes = {
  id: PropTypes.string.isRequired,
  monthly: PropTypes.shape({
    mode: PropTypes.oneOf(['on', 'on the']).isRequired,
    interval: PropTypes.number.isRequired,
    on: PropTypes.object.isRequired,
    onThe: PropTypes.object.isRequired,
    options: PropTypes.shape({
      modes: PropTypes.oneOf(['on', 'on the']),
    }).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatMonthly;
