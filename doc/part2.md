

# Catstagram

We will build a thumnbail of cats pictures.

## Iteration 1 : Fake data

We would like to display a thumbnail of pictures.

### US1 : Display the thumbnail

AS a user
I WANT to display a thumbnail of X pictures

BUSINESS RULE: X = min(value of the counter, number of avalaible pictures)

## Exercice 2: Implement US1 with fake datas

You can use this type with some fake datas:

```ts
type Picture = {
  previewUrl: string,
  webformatUrl: string,
  user: string,
  userImageUrl: string,
}
```

Fake data in JSON format :
```json
[
  {
    "previewURL": "https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736877_150.jpg",
    "webformatURL": "https://pixabay.com/get/g79dcdcfe37eab8a7d930a0d9ad64308090da5dada313aa8e20085c91288c2b2fc5982584c594ae9839355350dd159982_640.jpg",
    "largeImageURL": "https://pixabay.com/get/g0c53e0618cdb722b735a3d5b7167b1552879a38eaf1d022e3d3fa0b9e2b84d30eba464e3bf0ea6ce1feabf58e0c19879f1c6750ecb3dbdb54ab924d3f14fa343_1280.jpg",
    "user": "Bessi"
  },
  {
    "previewURL": "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_150.jpg",
    "webformatURL": "https://pixabay.com/get/g1582de2b9a58acd22e679887e486a4ec30fe41d0f24b84b9691584e38e5e17a0c2eec61f0c021e472455db73bb691120_640.jpg",
    "largeImageURL": "https://pixabay.com/get/g5b6aad9ec56a42076101f3985924118a1c3c64ad03d7da39734defab37325fb2a05495b016d6de90297df77dd77b9b73e18b74c74f61ac27e1070bb28ff0f770_1280.jpg",
    "user": "Ty_Swartz"
  },
  {
    "previewURL": "https://cdn.pixabay.com/photo/2021/10/19/10/56/cat-6723256_150.jpg",
    "webformatURL": "https://pixabay.com/get/gfdade6d462c5095c9d636125b9a76879a2e1cf20cc3cc78c36418b88cb0897a3e37e6623567f2774ddbcdd7bac8d3b2304bee5a9fc762edc21c8d92120b08ff7_640.jpg",
    "largeImageURL": "https://pixabay.com/get/g236b3e775ba98ed2e7c92c25e0e96d41f55a8549d2ce38f1a40212707982fa46be84616c847bf542eb0bf3bbe669827b2f8daf57fb4c653f11002b131d551ca1_1280.jpg",
    "user": "bongbabyhousevn"
  }
]
```

Your tasks:
- Update the state type to store counter value and a list of pictures
- Update the reducer to update the list of pictures while updating the counter value
- Update the view to display the pictures


### US2 : Manage the popover

AS a user
WHEN I click on a picture
I WANT to display a modal with large picture, info about author and a close button

BUSINESS RULE: Click on close button must close the modal


> ℹ️  Maybe portal can help ... [ReactJS Portal](https://reactjs.org/docs/portals.html)

> 🆘 I've provided a suggested style for the modal so you don't waste too much time on it, but you can modify it of course :

```ts
const Container = styled.div`
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 50px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
`;

const Button = styled.button`
  position: absolute;
  top: 15px;
  right: 35px;
  color: black;
  font-size: 40px;
  font-weight: bold;
`;

const Image = styled.img`
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
`;
```
## Exercice 3: Implement US2 with fake datas

Your tasks:
- Update the state to store the fact you may or not have selected a picture
- Create a new action that represent the fact you selected a picture
- Create a new action that represent the fact you closed the modal
- Update the reducer
- Update the view

## Iteration 2 :  Our application is no more a simple app

### Cats API


Start by creating an account on pixabay.com to get an API key https://pixabay.com/api/docs/

![](../pixabay-register.png)

Then you can get your pictures from the API :
`https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat`

> ℹ️  To try API, you can run this command line in a terminal :
`curl https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat | jq`
(jq must be installed, it's a JSON command line processor to pretty your JSON output. But you can run command without it.)
Or you can use Postman or Insomnia to try it.


### Manage effects

Since we will manage asynchronous effects (API call, random number, ...), our application must be modify.

Previously we only handled mouse interactions but what about talking to a server ?

Within TEA effects are managed by **commands** represented by an action and triggered by a reducer, simple app was an app that doesn't trigger commands.

In React/Redux ecosystem, there are several ways to manage the effects and many libraries implements them such as [redux-thunk](https://github.com/reduxjs/redux-thunk) to manage asynchronous actions (like server calls) or [redux-saga](https://redux-saga.js.org/) which implements the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern).
In our case, [redux-loop](https://redux-loop.js.org/) is a library that implements TEA for Redux, so we will use it for our application to manage the effects.

Installing Redux-loop is pretty simple in our app : you must simply import the `install` function and provide it to the `createStore` function. To sum up, you file should look like :

```ts
import { createStore } from 'redux';
import reducer from './reducer';
import { install, LoopReducer, StoreCreator } from 'redux-loop';

const enhancedStore = createStore as StoreCreator;

const loopReducer = reducer as LoopReducer<State, Actions>;

export const store = enhancedStore(loopReducer, undefined, install());

```

In order to be compliant with Typescript compiler, you must cast `createStore` and `reducer` functions :
- `createStore` function as `StoreCreator` type
- `reducer` function as `LoopReducer<State, Actions>` type. `< >` means it's a generic type.


Redux-loop provide a way to manage our effects in reducers. It implies that our reducer function has not the same type as before. It can return either a state or a loop.

> ℹ️ Redux-loop provide a `Loop` type.

In a loop, you can dispatch another action with `Cmd.action`. In this way we can chain actions. If you need to run a function after an action, you can use `Cmd.run`. You can find more informations about `Cmd` [here](https://redux-loop.js.org/docs/api-docs/cmds.html).
An example with a loop and a store's update :

```ts
const reducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_ERROR':
      return loop(state, Cmd.run(() => console.log(state.error)));
    case 'SET_ERROR':
      return {...state, message: action.error }
  }
}
```


Another usefull Redux middleware is `redux-logger`. It logs your actions dispatched in web console. To setup it follow [this](https://github.com/LogRocket/redux-logger#usage).

> ℹ️ Options `collapsed` and `diff` are nice.

## Exercice 4: Create a app

Modify the `reducer` function to fit the new function signature. At this step we still do not have effect but we are ready for.

## Iteration 3 :  Make a service call


I provide you a redux-loop command to manage API calls. You can put it in `commands.ts` :

```ts
import { Cmd } from 'redux-loop';

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, {
        method: action.method,
      })
        .then(checkStatus)
    },
    {
      successActionCreator: fetchCatsCommit, // (equals to (payload) => fetchCatsCommit(payload))
      failActionCreator: fetchCatsRollback, // (equals to (error) => fetchCatsCommit(error))
    },
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};
```

where :
- `action.path` is the uri of the api - here: `https://pixabay.com/api/?key=[your_api_key]&per_page=[counter_value]&q=cat`
- `action.method` is the HTTP verb use for the request
- `successActionCreator` is the callback when the api responded with a success code. **It must return an action.**
- `failActionCreator` is the callback when the api responded with an error code. **It must return an action.**

Later, you can use it in reducer like :
```ts
...
case 'SOME_FETCHING_ACTION':
  return loop(state, cmdFetch(action))
...
```

In order to run, the shape of a fetch action must be :
```ts
type FetchCatsRequest = {
  type: 'FETCH_CATS_REQUEST';
  path: string;
  method: 'GET';
};
```

`cmdFetch` and `fetch` functions gives us clues about the complexity of effects like calling an api:
- Asynchrounous: meaning we want to **wait** for a result, **without blocking** the whole application
- Success: the effect may or may not be successful and we have to manage both cases

We will need to represent this in our state and in our messages.

## Exercice 5: Send command for api calls

_At this step we will put all the plumbing but not yet parse the response_

Yours tasks:

- Update the state type
>💡 Tip: At the previous step the state would have been *an int counter AND a picture list* ; at this step the *picture list* should be modify for a type that defines something like a *loading OR success of a picture list OR failure of a string* (the message error seems to be a perfect string)

- Update the initial value
>💡 Tip: a success of an empty list seems a good idea

- Update the msg type
>💡 Tip: you will need additional values that represent the 3 new events: *call the service OR service call succeeded or service call failed*

- Create bindings to your callback functions

>💡 Tip: at this step, you may log your response and return the appropriate message value. `successActionCreator` callback should return the action that represents *service call succeeded* and `failActionCreator` callback should return the action that represents *service call failed*

## Iteration 4 :  Parse response to data

One of the hardest part when you start using statically typed langage for web programming is about parsing data. Good to us, Typescript is javascript and JSON object is like a javascript object, so it will be simple.

We will use the [json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json) method from the `Response` type, returned by the `fetch` function. It provide an easy way to parse our data. This method return a Promise with data as value.


First we should take a look at a [sample of the body response from pixabay](../sample-api-response.json).

Our objective is to gets a `picture list` from the `hits`. We can proceed with 2 steps:
a. Parse the string to a JSON with `json` method
b. Extract the `hits` array and create an array of Picture.

> 💡 Tip: returning a `Promise` to chain it with `fetch` seems to be good

> ℹ️ Don't forget to update your reducer to map with your type of `Pictures`. Remember, it must be *loading OR success of a picture list OR failure of a string*.

## Exercice 6: Finalize the app

At this step you should be able to plug all parts together to parse the response and make your app works with real datas.

## Bonus: Improve the app

Your tasks:
- At previous step, the parsing works while the api is consistent. Since REST/JSON is untyped it is totally unsafe. As an exemple, if any field is renamed you will get a javascript runtime error.
- Use Styled-components to make your app beautiful