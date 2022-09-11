import { Flex, Input, Text } from '@chakra-ui/react';
import { Separator } from 'bloben-components';
import PropTypes from 'prop-types';
import React from 'react';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

const RepeatDaily = ({
  id,
  daily: { interval },
  handleChange,
  translations,
}) => (
  <Flex direction={'row'} alignItems={'center'}>
    <Text>{translateLabel(translations, 'repeat.daily.every')}</Text>
    <Separator width={16} />
    <Input
      size={'lg'}
      id={`${id}-interval`}
      name="repeat.daily.interval"
      aria-label="Repeat daily interval"
      className="form-control"
      value={interval}
      onChange={numericalFieldHandler(handleChange)}
    />
    <Separator width={16} />
    <Text className="col-sm-1">
      {translateLabel(translations, 'repeat.daily.days')}
    </Text>
  </Flex>
);
RepeatDaily.propTypes = {
  id: PropTypes.string.isRequired,
  daily: PropTypes.shape({
    interval: PropTypes.number.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default RepeatDaily;
