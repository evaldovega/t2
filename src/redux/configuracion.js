import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Reducers from './reducers';
export default configureStore = () => {
  let store = createStore(Reducers, applyMiddleware(thunk));
  return store;
};
