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
import {Image, Text, View, StatusBar, Platform} from 'react-native';
import NumberFormat from 'react-number-format';
import WebView from 'react-native-webview';
import ZoomIn from 'components/ZoomIn';

class PlanDetale extends React.PureComponent {
  componentDidMount() {}

  adquirir = () => {
    console.log('ADQUIRIR');
    this.setState({modal_show: false});
    this.props.navigation.push('AdquirirPlan', {
      ...this.props.route.params.doc,
      cliente: this.props.route.params.cliente,
    });
  };

  render() {
    const fileName = Platform.select({
      ios: `file:///assets/fonts/Mont-Bold.otf`,
      android: `file:///android_asset/fonts/Mont-Bold.otf`,
    });
    const {titulo, imagen, precio, informacion} = this.props.route.params.doc;

    return (
      <ColorfullContainer style={{flex: 1, backgroundColor: COLORS.BLANCO}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <Image
          source={{uri: imagen}}
          style={{width: '100%', height: '30%', position: 'absolute', top: 0}}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '30%',
            backgroundColor: 'rgba(0,0,0,.7)',
          }}
        />
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
                  marginTop: MARGIN_VERTICAL,
                }}>
                {nf}
              </Text>
            )}
          />
        </ZoomIn>
        <View style={{flex: 1, marginTop: '20%'}}>
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

export default PlanDetale;