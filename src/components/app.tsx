import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Counter from './counter';
import Pictures from './pictures';

const App = () => (
  <Provider store={store}>
    <>
      <Counter />
      <Pictures />
      <div>Hello World ! Go to build your Catstagram 💪 !</div>
    </>
  </Provider>
);

export default App;
