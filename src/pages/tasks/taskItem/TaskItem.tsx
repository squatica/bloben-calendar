import './TaskItem.scss';
import {
  Button,
  Flex,
  IconButton,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CalDavTask } from 'bloben-interface';

import { Context, StoreContext } from '../../../context/store';
import { EvaIcons, createToast, createToastError } from 'bloben-components';
import { checkTask } from '../../../views/event/editEvent/editTaskHelper';
import { parseCssDark } from '../../../utils/common';
import React, { useContext, useEffect, useState } from 'react';

interface TaskItemProps {
  item: CalDavTask;
  handleOpen: any;
  refreshData: any;
}
const TaskItem = (props: TaskItemProps) => {
  const [store]: [StoreContext] = useContext(Context);
  const { isMobile, isDark } = store;

  const toast = useToast();
  const [summary, setSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { item, handleOpen, refreshData } = props;

  useEffect(() => {
    setSummary(item.summary);
  }, []);

  const handleCheckTask = async (item: any) => {
    setIsSaving(true);
    try {
      const response = await checkTask(item);

      toast(createToast(response?.data?.message));

      await refreshData(item);

      setIsSaving(false);
    } catch (e) {
      setIsSaving(false);

      toast(createToastError(e));
    }
  };

  return (
    <Flex
      direction={'row'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      paddingTop={2}
      paddingBottom={2}
      width={'100%'}
    >
      <Flex
        direction={'column'}
        height={'100%'}
        alignItems={'flex-start'}
        justifyContent={'center'}
      >
        <IconButton
          _focus={{ boxShadow: 'none' }}
          variant={'ghost'}
          background={'transparent'}
          aria-label="Check"
          icon={
            isSaving ? (
              <EvaIcons.Loader
                className={`${parseCssDark(
                  'TaskItem_check_icon-checked Spinner-icon',
                  isDark
                )} rotate`}
              />
            ) : item.status === 'COMPLETED' ? (
              <EvaIcons.SquareCheck
                className={parseCssDark('TaskItem_check_icon-checked', isDark)}
              />
            ) : (
              <EvaIcons.Square
                className={parseCssDark('TaskItem_check_icon', isDark)}
              />
            )
          }
          marginRight={4}
          isRound
          size={isMobile ? 'md' : 'xs'}
          autoFocus={false}
          onClick={() => handleCheckTask(item)}
        />
      </Flex>
      <Button
        _focus={{ boxShadow: 'none' }}
        variant={'ghost'}
        style={{ width: '100%', textAlign: 'start' }}
        onClick={() => handleOpen(item)}
      >
        <Text style={{ width: '100%' }}>{summary}</Text>
        <Spacer />
      </Button>
    </Flex>
  );
};

export default TaskItem;
