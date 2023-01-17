import fc from 'fast-check';
import * as O from 'fp-ts/lib/Option';
import { FetchCatsRequest } from '../src/types/actions.type';
import { Loading, Success, Failure } from '../src/types/api.type';
import { Picture } from '../src/types/picture.type';

const getPictureArb = (): fc.Arbitrary<Picture> =>
  fc.record({
    previewFormat: fc.webUrl(),
    webFormat: fc.webUrl(),
    author: fc.string(),
    largeFormat: fc.webUrl(),
  });

const getError = (): fc.Arbitrary<Error> => fc.string().map(Error);
const getPayload = (): fc.Arbitrary<Picture[]> => fc.array(getPictureArb());

const getFetchCatsRequestAction = (counter: number): fc.Arbitrary<FetchCatsRequest> =>
  fc.record({
    type: fc.constant('FETCH_CATS_REQUEST'),
    path: fc.constant(`https://pixabay.com/api/?key=24523143-8a90135b40ac6e775ba6758cb&per_page=${counter}&q=cat`),
    method: fc.constant('GET'),
  });

const getSomeFromPicture = (picture: fc.Arbitrary<Picture>): fc.Arbitrary<O.Option<Picture>> => picture.map(O.some);
const getNone = (): fc.Arbitrary<O.Option<Picture>> => fc.constant(O.none);

const getLoadingArb = (): fc.Arbitrary<Loading> => fc.record({ kind: fc.constant('LOADING') });
const getSuccessArb = (): fc.Arbitrary<Success> =>
  fc.record({ kind: fc.constant('SUCCESS'), pictures: fc.array(getPictureArb()) });
const getFailureArb = (): fc.Arbitrary<Failure> =>
  fc.record({ kind: fc.constant('FAILURE'), error: fc.constant('error') });

const getPictures = (): fc.Arbitrary<any> => fc.oneof(getLoadingArb(), getSuccessArb(), getFailureArb());

const getState = () =>
  fc.record({
    counter: fc.integer(),
    pictures: getPictures(),
    pictureSelected: fc.oneof(getSomeFromPicture(getPictureArb()), getNone()),
  });

const getStateWithCounterEquals3 = () =>
  fc.record({
    counter: fc.constant(3),
    pictures: getPictures(),
    pictureSelected: fc.oneof(getSomeFromPicture(getPictureArb()), getNone()),
  });

export {
  getFailureArb,
  getFetchCatsRequestAction,
  getLoadingArb,
  getNone,
  getPayload,
  getPictureArb,
  getPictures,
  getSomeFromPicture,
  getState,
  getStateWithCounterEquals3,
  getSuccessArb,
  getError,
};
