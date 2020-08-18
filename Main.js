import React, { Component } from 'react';
import Menu from './Menu';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Reservation from './Reservation';
import Favorites from './Favorite';
import Login from './Login';
import { DISHES } from '../shared/dishes';
import Dishdetail from './Dishdetail';
import { View, Platform, Image, StyleSheet, ScrollView, Text, NetInfo, ToastAndroid } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import Constants from 'expo-constants';
import { Icon } from 'react-native-elements';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import { connect } from 'react-redux';
// import ExpoConstantStatusBar from 'expo-status-bar/build/ExpoStatusBar';

const mapStataeToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders()),
})

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail }
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerLeft: <Icon name='menu' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />,
        headerTitleStyle: {
            color: '#fff'
        }
    })
});

const HomeNavigator = createStackNavigator({
    Home: { screen: Home },
}, {
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTitleStyle: {
            color: '#fff'
        },
        headerTintColor: '#fff',
        headerLeft: <Icon name='home' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />

    })
});

const AboutNavigator = createStackNavigator({
    About: { screen: About },
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon name='about' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />
    })
});

const ContactNavigator = createStackNavigator({
    Contact: { screen: Contact },
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon name='contact' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />
    })
});

const ReservationNavigator = createStackNavigator({
    Contact: { screen: Reservation },
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon name='menu' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />
    })
});

const FavoritesNavigator = createStackNavigator({
    Favorites: { screen: Favorites },
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon name='menu' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />
    })
});

const LoginNavigator = createStackNavigator({
    Login: { screen: Login },
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        },
        headerLeft: <Icon name='menu' size={24} color='white'
            onPress={() => navigation.toggleDrawer()} />
    })
});

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }} >
            <View style={styles.drawerHeader}>
                <View style={{ flex: 1 }}>
                    <Image source={require('../Images/logo.png')}
                        style={styles.drawerImage} />
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
                </View>
            </View>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
)

const MainNavigator = createDrawerNavigator({
    Login: {
        screen: LoginNavigator,
        navigationOptions: {
            title: 'Login',
            drawerLabel: 'Login',
            drawerIcon: ({ tintColor }) => (
                <Icon name='sign-in' type='font-awesome' size={24} color={tintColor} />
            )
        }
    },
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor }) => (
                <Icon name='home' type='font-awesome' size={24} color={tintColor} />
            )
        }
    },
    Menu: {
        screen: MenuNavigator,
        navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu',
            drawerIcon: ({ tintColor }) => (
                <Icon name='list' type='font-awesome' size={24} color={tintColor} />
            )
        }
    },
    About: {
        screen: AboutNavigator,
        navigationOptions: {
            title: 'About Us',
            drawerLabel: 'About Us',
            drawerIcon: ({ tintColor }) => (
                <Icon name='info-circle' type='font-awesome' size={24} color={tintColor} />
            )
        }
    },
    Contact: {
        screen: ContactNavigator,
        navigationOptions: {
            title: 'Contact Us',
            drawerLabel: 'Contact Us',
            drawerIcon: ({ tintColor }) => (
                <Icon name='address-card' type='font-awesome' size={22} color={tintColor} />
            )
        }
    },
    Favorites: {
        screen: FavoritesNavigator,
        navigationOptions: {
            title: 'My Favorites',
            drawerLabel: 'My Favorites',
            drawerIcon: ({ tintColor }) => (
                <Icon name='heart' type='font-awesome' size={24} color={tintColor} />
            )
        }
    },
    Reservation: {
        screen: ReservationNavigator,
        navigationOptions: {
            title: 'Reserve Table',
            drawerLabel: 'Reserve Table',
            drawerIcon: ({ tintColor }) => (
                <Icon name='cutlery' type='font-awesome' size={24} color={tintColor} />
            )
        }
    }

}, {
    initialRouteName: 'Home',
    drawerBackgroundColor: '#D1C4E9',
    contentComponent: CustomDrawerContentComponent
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            selectedDish: null
        }
    }

    componentDidMount() {
        // this.props.fetchDishes();
        // this.props.fetchLeaders();
        // this.props.fetchPromos();
        // this.props.fetchComments();

        NetInfo.getConnectionInfo()
            .then((connectionInfo) => {
                ToastAndroid.show('Initial Network Connectivity Type: ' + connectionInfo.type +
                    ', effectiveType ' + connectionInfo.effectiveTpe, ToastAndroid.LONG)
            });

        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange)
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange)
    }

    handleConnectivityChange = (connectionInfo) => {
        switch (connectionInfo.type) {
            case 'none':
                ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
                break;
            case 'wifi':
                ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
                break;
            case 'cellular':
                ToastAndroid.show('You are now connected to cellular!', ToastAndroid.LONG);
                break;
            case 'unknown':
                ToastAndroid.show('You now have an unkown connection!', ToastAndroid.LONG);
                break;
            default:
        }
    }

    onDishSelect(dishId) {
        this.setState({ selectedDish: dishId });
    }


    render() {
        return (
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                <MainNavigator />

                {/* <Menu dishes={this.state.dishes}
                onPress={(dishId) => this.onDishSelect(dishId)} />
            <Dishdetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} /> */}
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    drawerHeader: {
        backgroundColor: '#512DA8',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    }
})

export default Main;