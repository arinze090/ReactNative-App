import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem, Tile } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './Loading';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        dishes: state.dishes
    }
}


class Menu extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         dishes: DISHES,
    //     };
    // }

    static navigationOptions = {
        title: 'Menu'
    }


    render() {

        const renderMenuItem = ({ item, index }) => {
            return (
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} >
                    <ListItem
                        key={item}
                        title={item.name}
                        subtitle={item.description}
                        featured
                        onPress={() => navigate('Dishdetail', { dishId: item.id })}
                        leftAvatar={{ source: require('../Images/uthappizza.png') }}
                    />
                </Animatable.View>
            );
        }
        const { navigate } = this.props.navigation;

        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            )
        }
        else if (this.props.dishes.errMess) {
            return (
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            )
        }
        else {
            return (
                <View>
                    <FlatList
                        data={this.props.dishes.dishes}
                        renderItem={renderMenuItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            )
        }
    }
}

export default connect(mapStateToProps)(Menu);