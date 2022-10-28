import { CalDavEvent } from '../../types/interface';
import { CalDavTask } from 'bloben-interface';
import { Center, Flex } from '@chakra-ui/react';
import { OnEventClickData } from 'kalend';
import { REPEATED_EVENT_CHANGE_TYPE } from '../../enums';
import { updateRepeatedEvent } from '../../views/event/editEvent/editEventHelper';
import { useHeight } from '../../utils/layout';
import Card from '../../components/card/Card';
import DuplicateMultipleModal from '../../components/duplicateMultipleModal/DuplicateModal';
import EditEvent from '../../views/event/editEvent/EditEvent';
import EventView from '../../views/event/eventView/EventView';
import PaginationRow from '../../components/paginationRow/PaginationRow';
import React, { useEffect, useState } from 'react';
import RepeatEventModal, {
  REPEAT_MODAL_TYPE,
} from '../../components/repeatEventModal/RepeatEventModal';
import TaskInput from './taskInput/TaskInput';
import TasksApi from '../../api/TasksApi';
import TasksList from './tasksList/TasksList';
import TasksMenu from './tasksMenu/TasksMenu';

const getPageCount = (total: number, limit: number) => {
  let result = parseInt((total / limit).toString());

  if (total % limit !== 0) {
    result += 1;
  }

  return result;
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<any>([]);
  const [selectedView, setSelectedView] = useState('latest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isEditingEventOpen, setEditingEventOpen] = useState<any>(null);
  const [isEventViewOpen, setEventViewOpen] = useState<any>(null);
  const [isRepeatModalOpen, setRepeatModalOpen] = useState<any>(null);
  const [currentE, setCurrentE] = useState<any>(null);
  const [duplicatingEvent, setDuplicatingEvent] = useState(false);
  const [duplicateModalOpen, openDuplicateModal] = useState<any>(false);

  const loadLatest = async () => {
    const response = await TasksApi.getLatestTasks();

    if (response.data) {
      setTasks(response.data);
    }
  };

  const refreshData = async (task: CalDavTask) => {
    if (selectedView === 'latest') {
      loadLatest();
    } else {
      loadTasks(page, task.calendarID);
    }
  };

  const loadTasks = async (requestPage: number, calendarID: string) => {
    const response = await TasksApi.getTasks(requestPage, calendarID);

    if (response.data) {
      const { todos, pagination } = response.data;
      setTasks(todos);
      setPage(Number(pagination.page));

      setTotal(getPageCount(pagination.total, 20));
    } else {
      setTasks([]);
    }
  };

  useEffect(() => {
    loadLatest();
  }, []);

  const handleSelect = async (value: string) => {
    setPage(1);

    if (selectedView === value) {
      return;
    }

    setSelectedView(value);

    if (value === 'latest') {
      await loadLatest();
    } else {
      await loadTasks(1, value);
    }
  };

  const nextFunc = async () => {
    await loadTasks(page + 1, selectedView);
    setPage(page + 1);
  };

  const prevFunc = async () => {
    await loadTasks(page - 1, selectedView);
    setPage(page - 1);
  };

  const clickOnNumber = async (value: number) => {
    await loadTasks(value, selectedView);
    setPage(value);
  };

  const closeEventView = () => {
    setEventViewOpen(null);
  };

  const height = useHeight();

  const openEditingEvent = (eventData: CalDavEvent, duplicate?: boolean) => {
    setEditingEventOpen(eventData);
    if (duplicate) {
      setDuplicatingEvent(true);
    }
  };

  const handleCloseEditingEventModal = () => {
    setEditingEventOpen(null);

    setDuplicatingEvent(false);
  };

  const handleEventClick = (data: OnEventClickData, e: any) => {
    setEventViewOpen(data);
    setCurrentE(e);
  };

  const handleUpdateRepeatedEvent = async (
    value: REPEATED_EVENT_CHANGE_TYPE
  ) => {
    if (!isRepeatModalOpen) {
      return;
    }

    setRepeatModalOpen(false);

    await updateRepeatedEvent(
      isRepeatModalOpen.updatedEvent,
      value,
      undefined,
      undefined,
      isRepeatModalOpen.prevEvent
    );

    setRepeatModalOpen(false);
  };

  return (
    <Card
      isDark={false}
      style={{
        margin: 48,
        padding: 12,
        minHeight: height - 100,
        maxHeight: height - 100,
      }}
    >
      <Flex direction={'row'} style={{ height: '100%', paddingBottom: 4 }}>
        <TasksMenu onClick={handleSelect} selected={selectedView} />
        <Flex direction={'column'} style={{ width: '100%' }}>
          <TaskInput
            selectedCalendarID={selectedView}
            refreshCallback={loadTasks}
            disabled={selectedView === 'latest'}
          />
          <TasksList
            tasks={tasks}
            handleOpen={handleEventClick}
            refreshData={refreshData}
          />
          <Center>
            <PaginationRow
              page={page}
              total={total}
              nextFunc={nextFunc}
              prevFunc={prevFunc}
              clickOnNumber={clickOnNumber}
            />
          </Center>
        </Flex>
      </Flex>

      {isEditingEventOpen ? (
        <EditEvent
          isNewEvent={false}
          event={isEditingEventOpen}
          handleClose={handleCloseEditingEventModal}
          currentE={null}
          isTask={true}
          isDuplicatingEvent={duplicatingEvent}
        />
      ) : null}
      {isEventViewOpen ? (
        <EventView
          data={isEventViewOpen}
          handleClose={closeEventView}
          openEditEventModal={openEditingEvent}
          currentE={currentE}
          openDuplicateModal={openDuplicateModal}
          refreshData={refreshData}
        />
      ) : null}
      {isRepeatModalOpen ? (
        <RepeatEventModal
          type={REPEAT_MODAL_TYPE.UPDATE}
          handleClose={() => {
            setRepeatModalOpen(null);
            if (isRepeatModalOpen.resetPosition) {
              isRepeatModalOpen.resetPosition();
            }
          }}
          title={''}
          handleClick={handleUpdateRepeatedEvent}
        />
      ) : null}

      {duplicateModalOpen ? (
        <DuplicateMultipleModal
          event={duplicateModalOpen}
          handleClose={() => openDuplicateModal(false)}
        />
      ) : null}
    </Card>
  );
};

export default TasksPage;
