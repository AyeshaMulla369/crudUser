/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CardUser = (props) => {

    return (
        <View style={styles.container}>
            <Card>
                <Card.Content>
                    <Text style={styles.name}>{props.props.name}</Text>
                    <Text style={styles.email}>{props.props.emailA}</Text>
                    <Text style={styles.phone}>{props.props.phoneN}</Text>

                    {/* Edit and Delete Buttons */}
                    <View style={styles.buttonContainer}>
                        <IconButton
                            icon={() => <Icon name="edit" size={24} color="#000" />}
                            onPress={() => {
                                // Handle edit button press
                                console.log('Edit button pressed');
                                props.onEdit();
                            }}
                        />
                        <IconButton
                            icon={() => <Icon name="delete" size={24} color="#000" />}
                            onPress={() => {
                                // Handle delete button press
                                console.log('Delete button pressed');
                                props.onDelete();
                            }}
                        />
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

export default CardUser;

const styles = StyleSheet.create({
    container: {
        color: '#000',
        padding: 16,
    },
    name: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        color: '#000',
        fontSize: 20,
    },
    phone: {
        color: '#000',
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
});
