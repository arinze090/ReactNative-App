import React, { Component } from 'react';
import { ScrollView, View, Text, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './Loading';


const mapStateToProps = state => {
    return {
        promotions: state.promotions,
        leaders: state.leaders,
        dishes: state.dishes
    }
}

function RenderItem(props) {
    const item = props.item;

    if (props.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }
    else {

        if (item != null) {
            return (
                <Card
                    featuredTitle={item.name}
                    featuredSubtitle={item.designation}
                    image={require('../Images/buffet.png')} >
                    <Text style={{ margin: 10 }}>
                        {item.description}
                    </Text>
                </Card>
            )
        }
        else {
            return (<View></View>)
        }
    }

}

class Home extends Component {

    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);

        // this.state = {
        //     dishes: DISHES,
        //     promotions: PROMOTIONS,
        //     leaders: LEADERS
        // }
    }

    static navigationOptions = {
        title: 'Home'
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 8,
                duration: 8000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    render() {
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });

        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });

        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });

        return (
            // <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} >
                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos1 }] }} >
                    <RenderItem
                        item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                        isLoading={this.props.dishes.isLoading}
                        errMess={this.props.dishes.errMess} />
                </Animated.View>
                
                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos2 }] }} >
                    <RenderItem
                        item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                        isLoading={this.props.promotions.isLoading}
                        errMess={this.props.promotions.errMess} />
                </Animated.View>

                <Animated.View style={{ width: '100%', transform: [{ translateX: xpos3 }] }} >
                    <RenderItem
                        item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                        isLoading={this.props.leaders.isLoading}
                        errMess={this.props.leaders.errMess} />
                </Animated.View>

            </View>
            // </ScrollView>
        )
    }
}

export default connect(mapStateToProps)(Home);