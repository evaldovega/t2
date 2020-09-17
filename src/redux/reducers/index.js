import {combineReducers} from 'redux';
import Usuario from './Usuario';
import Capacitacion from './Capacitacion';
import Capacitaciones from './Capacitaciones';

export default combineReducers({
  Usuario: Usuario,
  Capacitaciones: Capacitaciones,
  Capacitacion: Capacitacion,
});
