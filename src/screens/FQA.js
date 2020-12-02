import module from '@react-native-firebase/app';
import React from 'react';
import {StatusBar, ScrollView, Text, View} from 'react-native';
import NavBar from 'components/Navbar';
import GradientContainer from 'components/GradientContainer';
import {SERVER_ADDRESS} from 'constants';
import {Card} from 'react-native-paper';
import WebView from 'react-native-webview';

class FQA extends React.Component {
  state = {
    docs: [],
  };
  componentDidMount() {
    fetch(SERVER_ADDRESS + 'api/config/faq/')
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        this.setState({docs: r});
      });
  }

  render() {
    const head = `<head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <style>
        p{
            textAlign:'justify'
        }
        body{
            textAlign:'justify';
            padding:32px
        }
        img{
            maxWidth:100%
        }
        </style>
    </head>`;
    return (
      <GradientContainer>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <NavBar back title="Preguntas frecuentes" {...this.props} />
        <ScrollView>
          {this.state.docs.map((r, key) => (
            <Card>
              <Card.Content key={key}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Roboto-Black', marginRight: 8}}>
                    {key + 1}
                  </Text>
                  <Text style={{fontFamily: 'Roboto-Medium'}}>
                    {r.pregunta}
                  </Text>
                </View>
                <WebView
                  automaticallyAdjustContentInsets={false}
                  style={{width: '100%', aspectRatio: 16 / 9}}
                  source={{html: `${head} ${r.respuesta}`}}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </GradientContainer>
    );
  }
}

export default FQA;
