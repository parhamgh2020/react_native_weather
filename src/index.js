import {
    Alert,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Text,
    View,
    Image,
    Dimensions,
    FlatList
} from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import example_Data from '../example'


const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=1a1de8602e308c01160350d53c0aad7f'


export default function Weather() {
    const [forecast, setForecast] = useState(example_Data)
    const [refreshing, setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        // const response = await fetch(`${url}&lat=${location.coord.latiude}&lon=${location.coord.longtitude}`);
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            Alert.alert('error', 'somthing went wrong');
        } else {
            setForecast(data)
        }
    }
    useEffect(() => {
        setRefreshing(false)
    }
    useEffect(() => {
        loadForecast();
    }, []);


    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
                <Text style={{ textAlign: "center" }}>forecae:{forecast}</Text>
            </SafeAreaView>
        );
    }
    const current = forecast.current.forecast[0]

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadForecast()} />
                }
                style={{ margin: 50 }}>
                <Text style={styles.title}>
                    Current Weather
                </Text>
                <Text style={styles.locationText}>
                    Your Location
                </Text>
                <View style={styles.current}>
                    <Image
                        source={{
                            uri: `http://openweatheramp.org/img/wn/${current.icon}@4x.png`,
                        }}
                        style={styles.largeIcon}
                    />
                </View>
                <Text style={styles.currentTemp}>
                    {Math.round(forecast.current.temp)}&#8451
                </Text>
                <Text style={styles.currentDescription}>
                    {current.description}
                </Text>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            source={require('../assets/temp.png')}
                            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}
                        />
                        <Text style={styles.text}>
                            {forecast.current.feels_like}&#8451
                        </Text>
                        <Text style={styles.text}>
                            Feel Like
                        </Text>
                    </View>
                    <View style={styles.info}>
                        <Image
                            source={require('../assets/humidity.png')}
                            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}
                        />
                        <Text style={styles.text}>
                            {forecast.current.humidity}%
                        </Text>
                        <Text style={styles.text}>
                            Humidity
                        </Text>
                    </View>
                </View>
                <View >
                    <Text style={styles.subtitle}>
                        Hourly Forecast
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={forecast.hourly.slice(0, 24)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(hour) => {
                        const weather = hour.item.weather;
                        var dt = new Date(hour.item.dt * 1000);
                        return (
                            <View style={styles.hour}>
                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {dt.toLocaleTimeString().replace(/:\d+ /, '')}
                                </Text>
                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {Math.round.apply(hour.item.temp)}&#8451
                                </Text>
                                <Image
                                    style={styles.smallIcon}
                                    source={{
                                        uri: `http://openweatheramp.org/img/wn/${weather.icon}@4x.png`,
                                    }}
                                />
                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {weather.description}
                                </Text>
                            </View>
                        )
                    }}
                ></FlatList>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECDBBA'
    },
    loading: {},
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: "#c84B31"
    },
    locationText: {
        alignItems: 'center',
        textAlign: 'center'
    },
    largeIcon: {
        width: 300,
        height: 250,
    },
    current: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    currentTemp: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    currentDescription: {
        width: "100%",
        textAlign: 'center',
        fontWeight: '200',
        fontSize: 24,
        marginBottom: 5,
    },
    info: {
        witdh: Dimensions.get('screen').width / 2.5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        justifyContent: 'center',
    },
    extraInfo: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-beween',
        padding: 10
    },
    text: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        marginVertical: 12,
        marginLeft: 7,
        color: '#c84B31',
        fontWeight: 'bold',
    },
    hour: {
        padding: 6,
        alignItems: 'center'
    },
    smallIcon: {
        width: 100,
        height: 100
    }
})