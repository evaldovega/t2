import React, {memo} from 'react';
import {StyleSheet, Text, View, Image,PixelRatio} from "react-native";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {getStatusBarHeight} from "react-native-iphone-x-helper";
import { COLORS,MARGIN_VERTICAL,TITULO_TAM } from 'constants';

const Header = memo((props) => {
    return (
        <View style={styles.container}>
            <SimpleLineIcons name='arrow-left' size={16} onPress={()=>props.navigation.pop()}/>
            <Text style={styles.txtTo}>¡Crea tu cuenta {'\n'}en Servi!</Text>
            <Image style={styles.image} resizeMode='contain' source={require('utils/images/registro.png')}></Image>
        </View>
    )
});

export default Header;

const styles = StyleSheet.create({
    container: {
        marginTop: getStatusBarHeight(true) + 20,
        paddingHorizontal:24,
        alignSelf:'center',
        paddingTop: 0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:0
    },
    txtWelcome: {
        fontSize: 18,
        color: COLORS.PRIMARY_COLOR,
        fontFamily: 'Mont-Bold'
    },
    logo: {
        width: 60,
        height: 60
    },
    image: {
        width: PixelRatio.getPixelSizeForLayoutSize(35),
        height: PixelRatio.getPixelSizeForLayoutSize(35)
    },
    txtTo: {
        flex:1,
        marginLeft:16,
        fontSize: TITULO_TAM,
        color: COLORS.NEGRO,
        fontFamily:'Mont-Bold',
        fontWeight:'bold'
        
    },
    circle: {
        width: 176,
        height: 176,
        borderRadius: 88,
        backgroundColor: '#FF647C',
        position: 'absolute',
        right: -88
    },
    svgPerson: {
        position: 'absolute',
        right: 0,
        top: 22
    }
});
