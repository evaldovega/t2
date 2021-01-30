import ColorfullContainer from 'components/ColorfullContainer';
import {MARGIN_HORIZONTAL} from 'constants';
import React, {useEffect, useRef, useImperativeHandle} from 'react';
import {ScrollView, View} from 'react-native';
import Producto from './Producto';
import Button from 'components/Button';

const Variaciones = React.forwardRef(
  ({navigation, setCurrentTab, productos, datosPrecargados}, ref) => {
    const visible = navigation.isFocused();
    // const productosRefs = useRef([]);
    const productosRefs = {};

    const valid = () => {
      const productosValidos = [];

      Object.keys(productosRefs).forEach((key) => {
        const ref = productosRefs[key];
        if (ref && ref.valid && ref.seleccionado === true) {
          productosValidos.push(ref.valid());
        }
      });
      return new Promise((resolve, reject) => {
        Promise.all(productosValidos)
          .then((productos) => {
            resolve(productos);
          })
          .catch((errores) => {
            reject(errores);
          });
      });
    };

    const obtenerDatosPrecargados = (planId) => {
      if (datosPrecargados) {
        return datosPrecargados.find((dp) => dp.plan == planId);
      }
      return null;
    };

    const next = () => {
      valid()
        .then(() => {
          navigation.navigate('Finalizar');
        })
        .catch((error) => {
          console.log(error);
        });
    };

    useImperativeHandle(ref, () => ({
      valid: valid,
      total: () => {
        let total = 0;
        Object.keys(productosRefs).forEach((key) => {
          total += productosRefs[key].total();
        });
        return total;
      },
    }));

    useEffect(() => {
      if (visible) {
        setCurrentTab('Variaciones');
      }
    }, [visible]);

    return (
      <ColorfullContainer style={{flex: 1}}>
        <ScrollView>
          {productos.map((producto, index) => {
            const planDatosPrecargados = obtenerDatosPrecargados(
              producto.plan_hijo,
            );

            return (
              <Producto
                ref={(r) => (productosRefs[index] = r)}
                key={producto.id}
                data={producto}
                datosPrecargados={planDatosPrecargados}
              />
            );
          })}
        </ScrollView>
        <Button title="Continuar" onPress={next} />
      </ColorfullContainer>
    );
  },
);
//ref={(el) => productosRefs.current.push(el)}
export default Variaciones;
