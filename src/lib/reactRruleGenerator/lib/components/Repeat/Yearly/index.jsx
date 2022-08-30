import { Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import RepeatYearlyOn from './On';
import RepeatYearlyOnThe from './OnThe';
import Separator from '../../../../../../components/separator/Separator';

const RepeatYearly = ({
  id,
  yearly: { mode, on, onThe, options },
  handleChange,
  translations,
}) => {
  const isTheOnlyOneMode = (option) => options.modes === option;
  const isOptionAvailable = (option) =>
    !options.modes || isTheOnlyOneMode(option);
  return (
    <Flex direction={'column'}>
      {isOptionAvailable('on') && (
        <RepeatYearlyOn
          id={`${id}-on`}
          mode={mode}
          on={on}
          hasMoreModes={true}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      <Separator width={16} height={16} />
      {isOptionAvailable('on the') && (
        <RepeatYearlyOnThe
          id={`${id}-onThe`}
          mode={mode}
          onThe={onThe}
          hasMoreModes={true}
          handleChange={handleChange}
          translations={translations}
        />
      )}
    </Flex>
  );
};
RepeatYearly.propTypes = {
  id: PropTypes.string.isRequired,
  yearly: PropTypes.shape({
    mode: PropTypes.oneOf(['on', 'on the']).isRequired,
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

export default RepeatYearly;
