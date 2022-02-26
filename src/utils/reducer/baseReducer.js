export const REPLACE_STATE = 'replace';

export const baseReducer = (state, action) => {
  return {
    ...state,
    [action.type]: [...state[action.type], action.payload],
  };
};

export const formReducer = (state, action) => {
  const { type, payload } = action;

  return {
    ...state,
    [type]: payload,
  };
};

export const stateReducer = (state, action) => {
  const { type, payload } = action;

  if (type === REPLACE_STATE) {
    return payload;
  }

  return {
    ...state,
    [type]: payload,
  };
};

export const simpleReducer = (state, type, payload) => {
  if (type === REPLACE_STATE) {
    return payload;
  }

  return {
    ...state,
    [type]: payload,
  };
};
