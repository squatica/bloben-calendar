import { ALERT_BOX_TYPE } from '../../enums';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react';
import React from 'react';

interface AlertBoxProps {
  title: string;
  type: ALERT_BOX_TYPE;
  description?: string;
}

const AlertBox = (props: AlertBoxProps) => {
  const { title, type, description } = props;

  return (
    <Alert status={type} variant="subtle" style={{ borderRadius: 8 }}>
      <Flex direction={'column'}>
        <Flex direction={'row'}>
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
        </Flex>
        {description ? (
          <Flex direction={'row'}>
            <AlertIcon style={{ opacity: 0 }} />
            <AlertDescription>{description}</AlertDescription>
          </Flex>
        ) : null}
      </Flex>
    </Alert>
  );
};

export default AlertBox;
