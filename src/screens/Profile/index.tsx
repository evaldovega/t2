import React, {memo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native";
import SvgClient1 from "svgs/profile/SvgClient1";
import SvgClient2 from "svgs/profile/SvgClient2";
import SvgClient3 from "svgs/profile/SvgClient3";
import SvgClient4 from "svgs/profile/SvgClient4";
import SvgClient5 from "svgs/profile/SvgClient5";
import SvgWork1 from "svgs/profile/SvgWork1";
import SvgWork2 from "svgs/profile/SvgWork2";
import SvgWork3 from "svgs/profile/SvgWork3";
import SvgAvatar from "svgs/profile/SvgAvatar";
import {getStatusBarHeight} from "react-native-iphone-x-helper";
import {Lato, Montserrat} from "utils/fonts";
import SvgBack from "svgs/profile/SvgBack";
import SvgNoti from "svgs/profile/SvgNoti";

const dataClient = [
    SvgClient1,
    SvgClient2,
    SvgClient3,
    SvgClient4,
    SvgClient5
];
const dataWork = [
    {
        title: "Illustration Collection #2",
        Svg: SvgWork1
    },
    {
        title: "Work Form Home #1",
        Svg: SvgWork2
    },
    {
        title: "Illustration Collection #2",
        Svg: SvgWork3
    }
];

const Profile = memo(() => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.back}>
                <SvgBack/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noti}>
                <SvgNoti/>
            </TouchableOpacity>

            <ScrollView>
                <SvgAvatar style={styles.avatar}/>
                <Text style={styles.name}>
                    Nannie Williams
                </Text>
                <Text style={styles.job}>
                    Senior Maketer
                </Text>
                <TouchableOpacity style={styles.btnUpdate}>
                    <Text style={styles.txtUpdate}>Upgrade Premium</Text>
                </TouchableOpacity>

                <View style={styles.containerInfo}>
                    <View style={styles.col}>
                        <Text style={styles.value}>
                            3.890
                        </Text>
                        <Text style={styles.title}>
                            Follower
                        </Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.col}>
                        <Text style={styles.value}>
                            257
                        </Text>
                        <Text style={styles.title}>
                            Project
                        </Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.col}>
                        <Text style={styles.value}>
                            10.468
                        </Text>
                        <Text style={styles.title}>
                            Loves
                        </Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.titleContent}>Our Clients (24)</Text>
                    <View style={styles.client}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                dataClient.map((Item, index) => {
                                    return <Item key={index} style={{marginRight: 25}}/>
                                })
                            }
                        </ScrollView>
                    </View>
                    <Text style={styles.titleContent}>Latest Works</Text>
                    <View style={styles.work}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                dataWork.map((item, index) => {
                                    const {Svg, title} = item;
                                    return <View key={index}>
                                        <Svg style={styles.svgWork}/>
                                        <Text style={styles.titleWork}>
                                            {title}
                                        </Text>
                                    </View>
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
});

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8F9'
    },
    avatar: {
        marginTop: getStatusBarHeight(true) + 10,
        alignSelf: 'center'
    },
    back: {
        position: 'absolute',
        left: 16,
        top: getStatusBarHeight(true) + 10
    },
    noti: {
        position: 'absolute',
        right: 16,
        top: getStatusBarHeight(true) + 10
    },
    name: {
        fontFamily: Montserrat,
        fontWeight: '500',
        fontSize: 18,
        color: '#1A051D',
        textAlign: 'center',
        marginTop: 8
    },
    job: {
        fontFamily: Montserrat,
        fontSize: 14,
        color: '#6D5F6F',
        textAlign: 'center',
        marginTop: 8
    },
    btnUpdate: {
        width: 160,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0084F4',
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    txtUpdate: {
        fontFamily: Montserrat,
        fontSize: 13,
        color: '#FFF',
    },
    containerInfo: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 32
    },
    col: {
        alignItems: 'center',
        flex: 1
    },
    value: {
        fontFamily: Montserrat,
        fontSize: 20,
        color: '#1A051D'
    },
    title: {
        fontFamily: Lato,
        fontSize: 12,
        color: '#6D5F6F'
    },
    line: {
        width: 1,
        backgroundColor: '#EAE8EA',
        height: 32
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingLeft: 32,
        paddingBottom: 20
    },
    titleContent: {
        fontFamily: Montserrat,
        fontSize: 16,
        color: '#1A051D',
        textTransform: 'uppercase',
        marginTop: 28
    },
    titleWork: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 19,
        fontFamily: Montserrat,
        fontSize: 14,
        color: '#FFF'
    },
    svgWork: {
        marginRight: 16
    },
    client: {
        marginTop: 12,
        height: 48,
        marginBottom: 32
    },
    work: {
        marginTop: 16
    }
});
