import { Flex } from '@chakra-ui/react';
import RRuleGenerator from '../../lib/reactRruleGenerator/index';
import React from 'react';

interface RRuleCustomProps {
  setForm: any;
  form?: any;
}
const RRuleCustom = (props: RRuleCustomProps) => {
  const { setForm, form } = props;

  return (
    <Flex direction={'column'} minWidth={300}>
      <RRuleGenerator
        value={form.rRule}
        onChange={(rrule: string) => setForm('rRule', rrule)}
      />
    </Flex>
  );
};

export default RRuleCustom;
