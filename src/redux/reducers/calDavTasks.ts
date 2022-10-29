import { CalDavTask } from 'bloben-interface';

const calDavTasks = (state: CalDavTask[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CALDAV_TASKS':
      return action.payload;
    case 'UPDATE_CALDAV_TASK':
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    case 'ADD_CALDAV_TASK':
      return [...state, action.payload];
    default:
      return state;
  }
};

export default calDavTasks;
