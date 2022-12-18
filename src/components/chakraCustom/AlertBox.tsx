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
  hideIcon?: boolean;
}

const AlertBox = (props: AlertBoxProps) => {
  const { title, type, description, hideIcon } = props;

  return (
    <Alert status={type} variant="subtle" style={{ borderRadius: 8 }}>
      <Flex direction={'column'}>
        {title ? (
          <Flex direction={'row'}>
            <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
          </Flex>
        ) : null}
        {description ? (
          <Flex direction={'row'}>
            {hideIcon ? null : <AlertIcon style={{ opacity: title ? 0 : 1 }} />}
            <AlertDescription>{description}</AlertDescription>
          </Flex>
        ) : null}
      </Flex>
    </Alert>
  );
};

export default AlertBox;
