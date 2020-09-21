import {
  ACTION_CLIENTS_LOADING,
  ACTION_CLIENTS_LOADED,
  ACTION_CLIENTS_ERROR,
} from '../Constantes';
import produce from 'immer';

const initial_state = {
  loading: false,
  items: [],
  error: '',
};
export default Clients = (state = initial_state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_CLIENTS_LOADING:
        draft.loading = true;
        draft.items = [];
        draft.error = '';
        break;
      case ACTION_CLIENTS_LOADED:
        draft.loading = false;
        draft.items = action.items;
        draft.error = '';
        break;
      case ACTION_CLIENTS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });
};
