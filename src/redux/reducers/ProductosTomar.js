import {
  ACTION_PRODUCTOS_SET_METADATA,
  ACTION_PRODUCTOS_CARGANDO_DETALLE,
  ACTION_PRODUCTOS_DETALLE_CARGADO,
  ACTION_PRODUCTOS_ERROR_CARANDO_DETALLE,
  ACTION_PRODUCTOS_CARGANDO_FORMULARIO,
  ACTION_PRODUCTOS_FORMULARIO_CARGADO,
  ACTION_PRODUCTOS_ERROR_CARANDO_FORMULARIO,
} from '../Constantes';

import produce from 'immer';

const estado_inicial = {
  cargando: false,
  error: '',
  cliente_id: '',
  producto_id: '',
  plan_id: '',
  detalle: {},
  formulario_producto: {},
  formulario_plan: {},
};

export default ProductosTomar = (state = estado_inicial, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ACTION_PRODUCTOS_SET_METADATA:
        draft.cliente_id = action.cliente_id;
        draft.producto_id = action.producto_id;
        draft.plan_id = action.plan_id;
        break;
      case ACTION_PRODUCTOS_CARGANDO_DETALLE:
        draft.cargando = true;
        draft.error = '';
        draft.detalle = {};
        break;
      case ACTION_PRODUCTOS_DETALLE_CARGADO:
        draft.cargando = false;
        draft.detalle = action.detalle;
        break;
      case ACTION_PRODUCTOS_ERROR_CARANDO_DETALLE:
        dradft.cargando = false;
        draft.detalle = {};
        draft.error = action.error.toString();
        break;
      case ACTION_PRODUCTOS_CARGANDO_FORMULARIO:
        draft.cargando = true;
        draft.error = '';
        draft.formulario_producto = {};
        draft.formulario_plan = {};
        break;
      case ACTION_PRODUCTOS_FORMULARIO_CARGADO:
        draft.cargando = false;
        draft.error = '';
        draft.formulario_producto = action.formulario_producto;
        draft.formulario_plan = action.formulario_plan;
        break;
      case ACTION_PRODUCTOS_ERROR_CARANDO_FORMULARIO:
        draft.cargando = false;
        draft.error = action.error;
        break;
    }
  });
};
