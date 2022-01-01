import { Loop, liftState } from 'redux-loop';
import { compose } from 'redux';

export type State = unknown; // TODO : Update this type !
export type Actions =  // TODO : Update this type !
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SELECT_PICTURE'; picture: Picture }
  | { type: 'CLOSE_MODAL' }
  | { type: 'FETCH_CATS_REQUEST'; method: 'GET'; path: string }
  | { type: 'FETCH_CATS_COMMIT'; payload: unknown }
  | { type: 'FETCH_CATS_ROLLBACK'; error: Error };

export type Picture = {
  previewURL: string;
  webformatURL: string;
  user: string;
  largeImageURL: string;
};

export type Success = unknown; // TODO : Update this type !
export type Loading = unknown; // TODO : Update this type !
export type Failure = unknown; // TODO : Update this type !

export const loading = () => {}; // TODO : Update this value !
export const success = (payload: unknown) => {}; // TODO : Update this value !
export const failure = (error: string) => {}; // TODO : Update this value !

export const defaultState = {}; // TODO : Update this value !

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState;
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
