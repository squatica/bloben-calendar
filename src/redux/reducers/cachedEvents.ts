export const composeIDKey = (item: any) => `${item.id}_${item.internalID}`;

// const updateHelper = (state: any, item: any) => {
//   let foundItem: any;
//
//   const result: any = [];
//
//   forEach(state, (stateItem: any) => {
//     if (composeIDKey(stateItem) === composeIDKey(item.id)) {
//       result.push(item);
//       foundItem = item;
//     } else {
//       result.push(stateItem);
//     }
//   });
//
//   if (!foundItem) {
//     result.push(item);
//   }
//
//   return result;
// };
const cachedEvents = (state: any[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CACHED_EVENTS':
      return action.payload;
    case 'INSERT_CACHED_EVENTS':
      return [...state, ...action.payload];
    // case 'UPDATE_CACHED_EVENT':
    //   return updateHelper(state, action.payload);
    case 'DELETE_CACHED_EVENT':
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};

export default cachedEvents;
