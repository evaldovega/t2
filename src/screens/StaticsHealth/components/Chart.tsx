import React, {memo} from 'react';
import {StyleSheet, Text, View} from "react-native";

const data = [16, 32, 48, 24, 40, 80, 64];
const labelY = [100, 50, 10, 0];
const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const Chart = memo(() => {

    return (
        <View style={styles.chart}>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.boxY}>
                    {
                        labelY.map((item, index) => {
                            return <Text style={styles.txtY} key={index}>{item}</Text>
                        })
                    }
                </View>
                <View style={styles.boxChart}>
                    {
                        data.map((item, index) => {
                            return <View style={styles.containerValue} key={index}>
                                <View style={[styles.item, {height: item}]}/>
                            </View>
                        })
                    }
                </View>
            </View>
            <View style={styles.boxX}>
                {
                    labels.map((item, index) => {
                        return <Text style={styles.txtX} key={index}>{item}</Text>
                    })
                }
            </View>
        </View>
    )

});
export default Chart;

const styles = StyleSheet.create({
    chart: {
        marginTop: 20,
        marginBottom: 8,
    },
    boxY: {
        marginBottom: 10,
        width: 30,
    },
    txtY: {
        marginTop: 17,
        fontSize: 12,
        color: '#ABA4AC'
    },
    boxChart: {
        flexDirection: 'row',
        marginBottom: 10,
        flex: 1,
        alignItems: 'flex-end',
    },
    containerValue: {
        borderRadius: 12,
        flex: 1,
        alignItems: 'center'
    },
    item: {
        borderRadius: 12,
        backgroundColor: '#0084F4',
        width: 4,
    },
    boxX: {
        flexDirection: 'row',
        marginLeft: 30
    },
    txtX: {
        flex: 1,
        fontSize: 12,
        color: '#ABA4AC',
        textAlign: 'center'
    }
});
