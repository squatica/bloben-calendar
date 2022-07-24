import './Warning.scss';
import { Context } from '../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { Text } from '@chakra-ui/react';
import { parseCssDark } from '../../utils/common';
import React, { useContext } from 'react';

interface WarningProps {
  text: string;
}
const Warning = (props: WarningProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={parseCssDark('Warning-container', isDark)}>
      <EvaIcons.Info className={parseCssDark('Warning-Icon', isDark)} />
      <Text>{props.text}</Text>
    </div>
  );
};

export default Warning;
