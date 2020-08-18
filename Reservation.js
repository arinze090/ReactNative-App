import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-datepicker';
import style from 'react-native-datepicker/style';
import { Permissions, Notifications, Calendar } from 'expo';

export class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: '2020-08-03',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table'
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    handleReservation() {
        const { date, guests, smoking } = this.state;
        // console.log(JSON.stringify(this.state));
        // this.toggleModal();
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guest: ' + this.state.guests + '\n' +
            'Smoking? ' + this.state.smoking + '\n' +
            'Date and Time: ' + this.state.date,
            [
                {
                    text: 'cancel',
                    onPress: () => { this.toggleModal(); this.resetForm() },
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => { this.presentLocalNotifications(this.state.date); this.resetForm() },
                }
            ],
            { cancelable: false }
        )
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        })
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS)
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notification');
            }
        }
        return permission;
    }

    async presentLocalNotifications(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: { sound: true },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        })
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to access the calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        await Reservation.obtainCalendarPermission();
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + (3 * 60 * 60 * 1000)); 
        Calendar.createEventAsync(
            Calendar.DEFAULT,
            {
                title: 'Con Fusion Table Reservation',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
                startDate,
                endDate,
                timeZone: 'Africa/West_Africa',
            },
        );
        Alert.alert('Reservation has been added to your calendar');
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    confirmReservation(date) {
        Reservation.presentLocalNotification(date);
        Reservation.addReservationToCalendar(date);
        this.resetForm();
    }


    render() {
        return (
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking ?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({ smoking: value })}
                        >
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{ flex: 2, marginRight: 20 }}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='select date and time'
                            miniDate='2001-07-30'
                            maxDate='2020-08-03'
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button title='Reserve'
                            color='#512DA8'
                            onPress={() => this.handleReservation()}
                            accessbilityLabel='Learn more about this purple button' />
                    </View>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        onDismiss={() => { this.toggleModal(); this.resetForm() }}
                        onRequestClose={() => { this.toggleModal(); this.resetForm() }} >
                        <View style={style.modal}>
                            <Text style={style.modalTitle}>Your Reservation OK?</Text>
                            <Text style={style.modalText}>Number of Guest: {this.state.guests}</Text>
                            <Text style={style.modalText}>Smoking? : {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style={style.modalText}>Date and Time: {this.state.date} </Text>
                            {/* <Button
                            onPress={() => { this.toggleModal(); this.resetForm() }}
                            color='#512DA8'
                            title='CANCEL' />
                          <Button
                            onPress={() => { this.toggleModal(); this.resetForm() }}
                            color='#512DA8'
                            title='OK' /> */}
                        </View>
                    </Modal>
                </Animatable.View>
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
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
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
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;
