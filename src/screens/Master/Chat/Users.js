import React from 'react';
import {
  FlatList,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {Text, FAB, List} from 'react-native-paper';
import {styleHeader, styleInput, styleButton, styleText} from 'styles';

const DATA = [{id: 1, nombre: 'Evaldo vega vivanco'}];
const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 16,
  },
});
class ChatUsers extends React.Component {
  renderItem = ({item}) => (
    <View style={styles.item}>
      <List.Item title={item.nombre} />
    </View>
  );
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        <View style={styleHeader.wrapper}>
          <FAB
            icon="menu"
            onPress={() => this.props.navigation.openDrawer()}
            style={styleHeader.btnLeft}
          />
          <Text style={styleHeader.title}>Usuarios</Text>
          <View></View>
        </View>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={DATA}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default ChatUsers;
