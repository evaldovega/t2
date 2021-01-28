import ColorfullContainer from 'components/ColorfullContainer';
import React from 'react';
import Navbar from 'components/Navbar';
import Button from 'components/Button';
import {
  COLORS,
  TITULO_TAM,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
} from 'constants';
import {Text, View, StatusBar, Platform} from 'react-native';
import NumberFormat from 'react-number-format';
import WebView from 'react-native-webview';
import ZoomIn from 'components/ZoomIn';

import Cover from 'components/Cover';

class PlanDetalle extends React.PureComponent {
  componentDidMount() {}

  adquirir = () => {
    console.log('ADQUIRIR');
    this.setState({modal_show: false});
    this.props.navigation.push('NegocioDiligenciarInformacion', {
      ...this.props.route.params.doc,
      cliente: this.props.route.params.cliente,
    });
  };

  render() {
    const {titulo, imagen, precio, informacion} = this.props.route.params.doc;

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <Cover uri={imagen} style={{height: '25%'}} />
        <Navbar
          style={{marginTop: MARGIN_VERTICAL * 2}}
          back
          transparent
          icon_color={COLORS.BLANCO}
          {...this.props}
          style_title={{color: COLORS.BLANCO}}
          title={titulo}
        />

        <ZoomIn>
          <NumberFormat
            value={precio}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
            renderText={(nf) => (
              <Text
                style={{
                  fontSize: TITULO_TAM * 1.3,
                  fontFamily: 'Mont-Bold',
                  color: COLORS.BLANCO,
                  textAlign: 'center',
                  marginTop: MARGIN_VERTICAL * 1,
                  marginBottom: MARGIN_VERTICAL * 3,
                }}>
                {nf}
              </Text>
            )}
          />
        </ZoomIn>
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS === 'ios' ? MARGIN_VERTICAL * 5 : 0,
          }}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: `<html>
                                <head>
                                    <meta name="viewport" content="width=device-width,user-scale=no">
                                    <style>
                                        body {
                                            padding:12px 32px 32px;
                                            margin:0 auto;
                                        }
                                        *{
                                          text-align: justify;
                                        }
                                    </style>
                                </head>
                                <body>
                                    ${informacion}
                                </body>
                                </html>`,
            }}
            style={{width: '100%', backgroundColor: 'transparent', flex: 1}}
          />

          <Button
            onPress={this.adquirir}
            style={{
              marginVertical: MARGIN_VERTICAL * 2,
              marginHorizontal: MARGIN_HORIZONTAL,
            }}
            title="Diligenciar información"
          />
        </View>
      </ColorfullContainer>
    );
  }
}

export default PlanDetalle;
