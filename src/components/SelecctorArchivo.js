import React from 'react';
import {SafeAreaView, View, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Button, FAB, Text} from 'react-native-paper';
import {styleHeader} from 'styles';
var RNFS = require('react-native-fs');

class SelecctorArchivo extends React.Component {
  componentDidMount() {
    const path =
      Platform.OS == 'android'
        ? RNFS.DocumentDirectoryPath
        : RNFS.MainBundlePath;
    RNFS.readDir(path).then((result) => {
      console.log(result);
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styleHeader.wrapper}>
          <FAB
            icon="arrow-left"
            onPress={() => this.props.navigation.pop()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Selector de archivos</Text>
          <FAB style={{opacity: 0}} />
        </View>
        <SafeAreaView style={{flex: 1}}></SafeAreaView>
      </View>
    );
  }
}

export default SelecctorArchivo;
