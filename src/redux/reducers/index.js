import {combineReducers} from 'redux';
import Usuario from './Usuario';
import Capacitacion from './Capacitacion';
import Capacitaciones from './Capacitaciones';

import Clients from './Clients';
import Client from './Client';
import Productos from './Productos';
import ProductosTomar from './ProductosTomar';

import TaskType from './TaskType';

export default combineReducers({
  Usuario: Usuario,
  Capacitaciones: Capacitaciones,
  Capacitacion: Capacitacion,
  Clients: Clients,
  Client: Client,
  Productos: Productos,
  ProductosTomar: ProductosTomar,
  TaskType: TaskType,
});
