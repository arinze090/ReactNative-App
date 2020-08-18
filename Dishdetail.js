import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(comment))
})

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref = this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add to Favorites',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites'
                    [
                    {
                        text: 'cancel',
                        onPress: () => console.log('Cancel pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => props.favorites ? console.log('Already favorite') : props.onPress()
                    }
                    ],
                    { cancelable: false }
                )
            }
            else if (recognizeComment(gestureState)) {
                props.toggleModal()
            }
            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + '' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        })
    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef} {...panResponder.panHandlers} >
                <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }} >
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorites ? console.log('Already favorite') : props.onPress}
                        />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#512DA8'
                            style={styles.cardItem}
                            onPress={() => props.toggleModal()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    type="star"
                    fractions={0}
                    size={12}
                    color='#ffd700'
                    startingValue={item.rating}
                    style={{ alignItems: 'flex-start' }} />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item}</Text>
            </View>
        );
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000} >
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            comment: ''
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 3,
            author: '',
            comment: ''
        });
    }

    ratingCompleted(rating) {
        this.setState({
            rating: rating,
        });
    }

    onChangeAuthor(text) {
        this.setState({
            author: text,
        });
    }

    onChangeComment(text) {
        this.setState({
            comment: text,
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '')
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm() }}
                    onRequestClose={() => { this.toggleModal(); this.resetForm() }}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            onFinishRating={(rating) => this.ratingCompleted(rating)}
                            style={{ paddingVertical: 10 }}
                        />
                        <View style={styles.formRowInput}>

                            <Icon
                                outline
                                name={'user-o'}
                                type='font-awesome'
                            />
                            <TextInput
                                onChangeText={(text) => this.onChangeAuthor(text)}
                                placeholder={'Author'}
                                value={this.state.author}
                                style={{ width: 400, paddingLeft: 10 }}
                            />
                        </View>
                        <View style={styles.formRowInput}>
                            <Icon
                                outline
                                name={'comment-o'}
                                type='font-awesome'
                            />
                            <TextInput
                                onChangeText={(text) => this.onChangeComment(text)}
                                placeholder={'Comment'}
                                value={this.state.comment}
                                style={{ width: 400, paddingLeft: 10 }}
                            />
                        </View>
                        <View style={styles.formRow}>
                            <Button
                                onPress={() => { this.submitForm(+dishId) }}
                                color='#512DA8'
                                title='Submit'
                            />
                        </View>
                        <View style={styles.formRow}>

                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm() }}
                                color='512DA8'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 40,
    },
    formRowInput: {
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
    },
    formLabel: {
        fontSize: 18,
        flex: 2,
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        margin: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);




