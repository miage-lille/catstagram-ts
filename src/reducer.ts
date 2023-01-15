import { LoopReducer, liftState } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';

export type State = unknown; // TODO : Update this type !

export const defaultState = {}; // TODO : Update this value !

export const reducer = (state: State | undefined, action: Actions): State | LoopReducer<State, Actions> => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      throw 'Not Implemented';
    case 'DECREMENT':
      throw 'Not Implemented';
    case 'SELECT_PICTURE':
      throw 'Not Implemented';
    case 'CLOSE_MODAL':
      throw 'Not Implemented';
    case 'FETCH_CATS_REQUEST':
      throw 'Not Implemented';
    case 'FETCH_CATS_COMMIT':
      throw 'Not Implemented';
    case 'FETCH_CATS_ROLLBACK':
      throw 'Not Implemented';
  }
};

export const counterSelector = (state: State) => {
  throw 'Not Implemented';
};
export const picturesSelector = (state: State) => {
  throw 'Not Implemented';
};
export const getSelectedPicture = (state: State) => {
  throw 'Not Implemented';
};

export default compose(liftState, reducer);
