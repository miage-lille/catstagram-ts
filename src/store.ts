import { legacy_createStore as createStore, compose, applyMiddleware } from 'redux';
import reducer, { State } from './reducer';
import { install, LoopReducer, StoreCreator } from 'redux-loop';
import { createLogger } from 'redux-logger';
import { Actions } from './types/actions.type';

const enhancedStore = createStore as StoreCreator;

const loopReducer = reducer as LoopReducer<State, Actions>;
const logger = createLogger({
  collapsed: true,
  diff: true,
});

export const store = enhancedStore(loopReducer, undefined, compose(install(), applyMiddleware(logger)));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
