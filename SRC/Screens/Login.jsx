/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = () => {
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleLogin = async() =>{
        if (isConnected){
          try {
            const response = await axios.get(`http://192.168.29.190:3000/User/checkLogin/${email}`, {
              params: { password: password },
            });

            if (response.status === 200) {
              navigation.navigate('MainPage', email);
            } else {
              console.error('Login failed:', response.data.message);
              Toast.show(`Login Failed : ${response.data.message}`, Toast.LONG);
            }
          } catch (error) {
            console.error('Login failed:', error.message);
          }

        } else {
            try {
                // Retrieve the user data from AsyncStorage
                const storedData = await AsyncStorage.getItem('User');

                if (storedData) {
                  const userData = JSON.parse(storedData);

                  if (email === userData.email) {
                    if (password === userData.password) {
                      navigation.navigate('MainPage', email);
                    } else {
                      Toast.show('Incorrect password', Toast.LONG);
                    }
                  } else {
                    Toast.show('Email not found', Toast.LONG);
                  }
                } else {
                  Toast.show('No user data found', Toast.LONG);
                }
              } catch (error) {
                console.error('Error reading data from AsyncStorage:', error);
              }
        }
    };



    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);





  return (
    <View style={styles.containerFull}>
        <Text style={{fontWeight:"800", fontFamily:"sans-serif", marginBottom:30, fontSize:30}}>Login</Text>
        <View style= {styles.info}>
            <TextInput
                placeholder="Enter Email"
                placeholderTextColor="#767476"
                //value = {room}
                onChangeText={text=> setMail(text)}
                style = {styles.textInput}

            />
        </View>
        <View style= {styles.info}>
            <TextInput
                placeholder="Enter Password"
                placeholderTextColor="#767476"
                //value = {descp}
                onChangeText={text=> setPassword(text)}
                caretHidden={false}
                style = {styles.textInput}
                secureTextEntry
            />
        </View>

        <View style={{ alignItems:"center"}}>
            <TouchableOpacity
                style={styles.startMeetingButton}
                onPress={()=>{
                if (email && password){
                    handleLogin();
                }
                else {
                    Toast.show('Fill all fields ', Toast.LONG);
                }
                }}
            >
                <Text style={{color:"white", fontWeight: "bold"}}>Login</Text>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text>Not a user? SignUp</Text>
            </TouchableOpacity>

        </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
    containerFull: {
        width: "100%",
        height: "100%",
        color: "#767476",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    
      },
      info:{
        alignContent:"center",
        width: "95%",
        borderRadius:20,
        backgroundColor: "#aeb0af",
        height: 70,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#484648",
        padding: 12,
        marginBottom:12,
        justifyContent: "center"
      },
      textInput:{
        color: "white",
        fontSize: 18,
        borderRadius:50,
      },
      startMeetingButton:{
        width: 350,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0470DC",
        height: 50,
        borderRadius: 15,
      },
});
