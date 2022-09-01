import { Flex, Input, Text } from '@chakra-ui/react';
import { Separator } from 'bloben-components';
import PropTypes from 'prop-types';
import React from 'react';
import numericalFieldHandler from '../../utils/numericalFieldHandler';
import translateLabel from '../../utils/translateLabel';

const EndAfter = ({ id, after, handleChange, translations }) => (
  <Flex direction={'row'} alignItems={'center'}>
    <Input
      size={'lg'}
      id={id}
      maxWidth={50}
      name="end.after"
      aria-label="End after"
      value={after}
      onChange={numericalFieldHandler(handleChange)}
    />
    <Separator width={16} />
    <Text>{translateLabel(translations, 'end.executions')}</Text>
  </Flex>
);

EndAfter.propTypes = {
  id: PropTypes.string.isRequired,
  after: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  translations: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
};

export default EndAfter;
