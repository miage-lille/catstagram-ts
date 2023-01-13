import * as fc from 'fast-check';
import { getCmd, getModel, ActionCmd, RunCmd } from 'redux-loop';
import reducer, {
  counterSelector,
  getSelectedPicture,
  picturesSelector,
  loading,
  failure,
  success,
} from '../src/reducer';
import {
  fetchCatsCommit,
  fetchCatsRollback,
  FetchCatsCommit,
  FetchCatsRequest,
  FetchCatsRollback,
} from '../src/actions';
import 'fp-ts-jest-matchers';
import {
  getStateWithCounterEquals3,
  getState,
  getPictureArb,
  getPayload,
  getError,
  getFetchCatsRequestAction,
} from './generators';

test('given state with counter equals to 3 and DECREMENT action then counter value must not change', () => {
  fc.assert(
    fc.property(getStateWithCounterEquals3(), state => {
      const nextState = reducer(state, { type: 'DECREMENT' });
      expect(counterSelector(state)).toEqual(counterSelector(getModel(nextState)));
    }),
  );
});

test('given state with counter greater than 3 and DECREMENT action then counter value must be lower than previous counter value', () => {
  fc.assert(
    fc.property(
      getState().filter(s => s.counter > 3),
      state => {
        const nextState = reducer(state, { type: 'DECREMENT' });
        expect(counterSelector(state)).toBeGreaterThan(counterSelector(getModel(nextState)));
      },
    ),
  );
});

test('given state with counter greater than 3 and DECREMENT action then counter value must be decrease by 1', () => {
  fc.assert(
    fc.property(
      getState().filter(s => s.counter > 3),
      state => {
        const nextState = reducer(state, { type: 'DECREMENT' });
        expect(counterSelector(getModel(nextState))).toEqual(counterSelector(state) - 1);
      },
    ),
  );
});

test('given state with counter value lower than MAX_INT and INCREMENT action then counter value must be greater than previous counter value', () => {
  fc.assert(
    fc.property(
      getState().filter(s => s.counter < Number.MAX_SAFE_INTEGER),
      state => {
        const nextState = reducer(state, { type: 'INCREMENT' });
        expect(counterSelector(getModel(nextState))).toBeGreaterThan(counterSelector(state));
      },
    ),
  );
});

test('given state and CLOSE_MODAL action then next pictureSelected value must be none', () => {
  fc.assert(
    fc.property(getState(), state => {
      const nextState = reducer(state, { type: 'CLOSE_MODAL' });
      expect(getSelectedPicture(getModel(nextState))).toBeNone();
    }),
  );
});

test('given state and SELECT_PICTURE action then next pictureSelected value must be some of picture', () => {
  fc.assert(
    fc.property(getState(), getPictureArb(), (state, picture) => {
      const nextState = reducer(state, { type: 'SELECT_PICTURE', picture });
      expect(getSelectedPicture(getModel(nextState))).toBeSome(picture);
    }),
  );
});

test('given state and FETCH_CATS_REQUEST action then next pictures value must be loading', () => {
  fc.assert(
    fc.property(getState(), state => {
      const nextState = reducer(state, { type: 'FETCH_CATS_REQUEST', method: 'GET', path: 'http://hello.world' });
      expect(picturesSelector(getModel(nextState))).toEqual(loading());
    }),
  );
});

test('given state and FETCH_CATS_SUCCESS action then next pictures value must be success of pictures', () => {
  fc.assert(
    fc.property(getState(), getPayload(), (state, payload) => {
      const nextState = reducer(state, { type: 'FETCH_CATS_COMMIT', payload });
      expect(picturesSelector(getModel(nextState))).toEqual(success(payload));
    }),
  );
});

test('given state and FETCH_CATS_ROLLBACK action then next pictures value must be failure of error', () => {
  fc.assert(
    fc.property(getState(), getError(), (state, error) => {
      const nextState = reducer(state, { type: 'FETCH_CATS_ROLLBACK', error });
      expect(picturesSelector(getModel(nextState))).toEqual(failure(error.message));
    }),
  );
});

test('given state and INCREMENT action then FETCH_CATS_REQUEST must be dispatched', () => {
  fc.assert(
    fc.property(
      getState().chain(s => fc.tuple(fc.constant(s), getFetchCatsRequestAction(s.counter + 1))),
      ([state, fetchRequestAction]) => {
        const nextState = reducer(state, { type: 'INCREMENT' });
        const cmd = getCmd(nextState) as ActionCmd<FetchCatsRequest>;
        expect(cmd.simulate()).toEqual(fetchRequestAction);
      },
    ),
  );
});

test('given state and DECREMENT action then FETCH_CATS_REQUEST must be dispatched', () => {
  fc.assert(
    fc.property(
      getState()
        .filter(s => s.counter > 3)
        .chain(s => fc.tuple(fc.constant(s), getFetchCatsRequestAction(s.counter - 1))),
      ([state, fetchRequestAction]) => {
        const nextState = reducer(state, { type: 'DECREMENT' });
        const cmd = getCmd(nextState) as ActionCmd<FetchCatsRequest>;
        expect(cmd.simulate()).toEqual(fetchRequestAction);
      },
    ),
  );
});

test('given state and FETCH_CATS_REQUEST action then cmdFetch command must be executed', () => {
  fc.assert(
    fc.property(getState(), getPayload(), getError(), (state, payload, error) => {
      const nextState = reducer(state, { type: 'FETCH_CATS_REQUEST', path: 'http://hello.world', method: 'GET' });
      const cmd = getCmd(nextState) as RunCmd<FetchCatsCommit, FetchCatsRollback>;
      expect(cmd.simulate({ success: true, result: payload })).toEqual(fetchCatsCommit(payload));
      expect(cmd.simulate({ success: false, result: error })).toEqual(fetchCatsRollback(error));
    }),
  );
});
