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
import React, { useContext, useEffect, useState } from 'react';

interface TaskItemProps {
  item: CalDavTask;
  handleOpen: any;
  refreshData: any;
}
const TaskItem = (props: TaskItemProps) => {
  const [store]: [StoreContext] = useContext(Context);
  const { isMobile } = store;

  const toast = useToast();
  const [summary, setSummary] = useState('');

  const { item, handleOpen, refreshData } = props;

  useEffect(() => {
    setSummary(item.summary);
  }, []);

  const handleCheckTask = async (item: any) => {
    toast({ ...createToast('Saving'), isClosable: false, id: 'saving' });
    try {
      const response = await checkTask(item);

      toast.close('saving');
      toast(createToast(response?.data?.message));
      await refreshData(item);
    } catch (e) {
      toast.close('saving');
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
            item.status === 'COMPLETED' ? (
              <EvaIcons.SquareCheck className={'TaskItem_check_icon-checked'} />
            ) : (
              <EvaIcons.Square className={'TaskItem_check_icon'} />
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
