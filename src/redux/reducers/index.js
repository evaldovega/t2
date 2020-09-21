import {combineReducers} from 'redux';
import Usuario from './Usuario';
import Capacitacion from './Capacitacion';
import Capacitaciones from './Capacitaciones';
import Clients from './Clients';

export default combineReducers({
  Usuario: Usuario,
  Capacitaciones: Capacitaciones,
  Capacitacion: Capacitacion,
  Clients: Clients,
});
