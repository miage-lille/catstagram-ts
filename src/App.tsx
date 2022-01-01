import { Provider } from 'react-redux';
import { store } from './store';

// TODO Replace <div> with your components !
const App = () => (
  <Provider store={store}>
    <>
      <div>Hello World ! Go to build your Catstagram !</div>
    </>
  </Provider>
);

export default App;
