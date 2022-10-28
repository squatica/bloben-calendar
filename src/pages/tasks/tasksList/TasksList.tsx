import { CalDavTask } from 'bloben-interface';
import { Flex, Spacer } from '@chakra-ui/react';
import { useHeight } from '../../../utils/layout';
import TaskItem from '../taskItem/TaskItem';

const renderTasks = (
  tasks: CalDavTask[],
  handleCheck: any,
  handleOpen: any,
  refreshData: any
) => {
  return tasks.map((item) => {
    return (
      <TaskItem
        key={item.id}
        item={item}
        handleCheck={handleCheck}
        handleOpen={handleOpen}
        refreshData={refreshData}
      />
    );
  });
};

interface TasksListProps {
  tasks: CalDavTask[];
  handleOpen: any;
  refreshData: any;
}
const TasksList = (props: TasksListProps) => {
  const { handleOpen, refreshData } = props;
  const tasks = renderTasks(
    props.tasks,
    () => {
      return;
    },
    handleOpen,
    refreshData
  );

  const height = useHeight();

  return (
    <Flex
      direction={'column'}
      style={{
        width: '100%',
        padding: 6,
        paddingLeft: 36,
        height: height - 220,
      }}
    >
      <Flex
        direction={'column'}
        style={{
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          height: '100%',
          paddingRight: 8,
        }}
      >
        {tasks}
      </Flex>
      <Spacer />
    </Flex>
  );
};

export default TasksList;
