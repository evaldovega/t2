import {
  ACTION_CLIENTS_LOADING,
  ACTION_CLIENTS_LOADED,
  ACTION_CLIENTS_ERROR,
  ACTION_CLIENT_DELETING,
  ACTION_CLIENT_DELETED,
  ACTION_CLIENTS_REMOVE,
  ACTION_CLIENTS_EDIT,
  ACTION_CLIENTS_ADD,
} from '../Constantes';
import produce from 'immer';

const initial_state = {
  loading: false,
  items: [],
  error: '',
  success: '',
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
      case ACTION_CLIENT_DELETING:
        draft.loading = true;
        draft.error = '';
        draft.success = '';
        break;
      case ACTION_CLIENT_DELETED:
        draft.loading = false;
        draft.success = 'Cliente borrado correctamente';
        break;
      case ACTION_CLIENTS_REMOVE:
        let index = draft.items.findIndex((c) => c.id == action.id);
        if (index >= -1) {
          draft.items.splice(index, 1);
        }
        break;
      case ACTION_CLIENTS_ADD:
        draft.items.push(action.item);
        break;
      case ACTION_CLIENTS_EDIT:
        draft.items = draft.items.map((item) => {
          if (item.id == action.item.id) {
            return action.item;
          }
          return item;
        });
        break;
    }
  });
};
