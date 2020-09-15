import React, {memo, useCallback, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View, Text, StatusBar, Image} from 'react-native';
import SvgLogo from "svgs/walkthroughs/SvgLogo";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {useNavigation} from "@react-navigation/native";
import SvgIntro1 from "svgs/walkthroughs/SvgIntro1";
import SvgIntro2 from "svgs/walkthroughs/SvgIntro2";
import SvgIntro3 from "svgs/walkthroughs/SvgIntro3";
import {ROUTERS} from "utils/navigation";

const {width: viewportWidth} = Dimensions.get('window');

function wp(percentage: number) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = '100%';
const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const data = [
    {color: '#00C48C', Svg: SvgIntro1, Titulo:"Conéctate y gana", Texto:"Conéctate y gana vendiendo seguros con Servi"},
    {color: '#0F4C81', Svg: SvgIntro2, Titulo:"Sin horarios", Texto:"Actívate cuando quieras"},
    {color: '#6979F8', Svg: SvgIntro3, Titulo:"Gana", Texto:"Genera ingresos y cumple tus metas"}];

const Walkthroughs = memo(() => {
    const {navigate} = useNavigation();
    const [indexActive, setIndex] = useState(0);

    const onPress = useCallback(()=>{
        navigate(ROUTERS.SignIn);
    },[])

    const renderItem = useCallback(({item}) => {
        const Svg = item.Svg;
        return (
            <View style={[styles.item, {backgroundColor: item.color}]}>
                {/* <Svg style={styles.svgIntro}/> */}
                <Image style={styles.sliderImage} source={require('screens/Walkthroughs/images/IMG-01.png')}></Image>
                <Text style={styles.title}>{item.Titulo}</Text>
                <Text style={styles.des}>{item.Texto}</Text>
            </View>
        )
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'}/>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('utils/images/LOGO.png')}></Image>
                <Pagination
                    dotsLength={3}
                    activeDotIndex={indexActive}
                    dotStyle={styles.dotStyle}
                    inactiveDotStyle={styles.inactiveDotStyle}
                    containerStyle={styles.containerStyle}
                    inactiveDotScale={1}
                />
            </View>
            <View style={styles.boxCarousel}>
                <Carousel
                    data={data}
                    renderItem={renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    onSnapToItem={setIndex}
                />
            </View>

            <TouchableOpacity style={styles.btnSignIn} onPress={onPress}>
                <Text style={styles.txtSignIn}>¡Vende ya!</Text>
            </TouchableOpacity>

        </View>
    )
});

export default Walkthroughs;

const styles = StyleSheet.create({
    slider: {
        marginTop: 15,
        height: '70%',
        overflow: 'visible', // for custom animations
        padding: 0,
        margin: 0
    },
    logo: {
        width: 200,
        height: 60
    },
    sliderContentContainer: {
        paddingVertical: 10, // for custom animation
    },
    sliderImage: {
        width: 279,
        height: 324
    },
    dotStyle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 0,
        backgroundColor: '#0F4C81',
    },
    inactiveDotStyle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 0,
        backgroundColor: '#6D5F6F',
    },
    containerStyle: {
        padding: 0,
        margin: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        flexDirection: 'row',
        marginTop: 56,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    boxCarousel: {
        flex: 1
    },
    btnSignIn: {
        backgroundColor: '#102e4d',
        borderRadius: 24,
        marginHorizontal: 45,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 50
    },
    txtSignIn: {
        color: '#FBFBFB',
        fontSize: 17,
        fontWeight: '600',
    },
    item: {
        borderRadius: 16,
        backgroundColor: '#00C48C',
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    svgIntro: {
        alignSelf: 'center'
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        marginTop: 50,
        marginLeft: 24,
        marginRight: 16
    },
    des: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 16,
        marginLeft: 24,
        marginRight: 16
    }
});
