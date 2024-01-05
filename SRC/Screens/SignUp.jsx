/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView , NestableScrollContainer} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { RadioButton, Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
DropDownPicker.setListMode("SCROLLVIEW");

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [emailA, setEmail] = useState('');
  const [phoneN, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const [checkedItems, setCheckedItems] = useState({
    LinkedIn: false,
    Friends: false,
    JobPortals: false,
    Others: false,
  });

  const handleCheckboxToggle = (itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]);

  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [stateValues, setStateValues] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignup = async () => {
    // console.log(name, emailA, phoneN, selectedGender, value, value1);
    const checkedItemsArray = Object.keys(checkedItems).filter((itemName) => checkedItems[itemName]);
    console.log('Checked Items:', checkedItemsArray);
    if (isConnected){
      const dataSending = {
        name: name,
        email: emailA,
        phone: phoneN,
        password: password,
        gender: selectedGender,
        heardFrom: checkedItemsArray,
        city: value,
        state: value1,
      };
      console.log(dataSending);
      await axios
        .post("http://192.168.29.190:3000/User/createUser", dataSending)
        .then((response) => {
          console.log("Created new user with signUp ")
          Toast.show('User Signed In', Toast.LONG);
        })
        .catch((error) => {
          console.log("error creating post", error.response.data);
        });
        await saveDataToLocal(dataSending);

    } else {
      Toast.show('No network', Toast.LONG);

    }
  };

  const saveDataToLocal = async(data)=>{
    try {
      const toStore = {
        email: data.email,
        password: data.password,
      }
      await AsyncStorage.setItem('User', JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };

  return (
    <View style={styles.containerFull}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.goback}>
          <AntDesign name="arrowleft" size={30} color="gray" />
          <Text style={{ color: 'gray', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Signup</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Enter name"
            placeholderTextColor="#767476"
            style={styles.textInput}
            onChangeText={(text) => setName(text)}
          />

          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#767476"
            style={styles.textInput}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#767476"
            style={styles.textInput}
            keyboardType="phone-pad"
            onChangeText={(text) => setPhone(text)}
          />

          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#767476"
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
          />

          <Text style={styles.label}>Gender:</Text>
          <RadioButton.Group onValueChange={(newValue) => setSelectedGender(newValue)} value={selectedGender}>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item label="Male" value="male" />
              <RadioButton.Item label="Female" value="female" />
              <RadioButton.Item label="Other" value="other" />
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>How did you hear about this?</Text>
          {Object.keys(checkedItems).map((itemName) => (
            <Checkbox.Item
              key={itemName}
              label={`${itemName}`}
              status={checkedItems[itemName] ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle(itemName)}
            />
          ))}

          <Text style={styles.label}>City</Text>
            <View style={{marginBottom:80}}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
            </View>

          <Text style={styles.label}>Search</Text>
            <DropDownPicker
              searchable={true}
              searchPlaceholder="Search State"
              open={open1}
              value={value1}
              items={stateValues}
              setOpen={setOpen1}
              setValue={setValue1}
              setItems={setStateValues}
            />

          <TouchableOpacity style={styles.formbtn} onPress={() => handleSignup()}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goback: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  title: {
    color: '#1c1c1c',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 30,
    alignSelf: 'center',
  },
  formContainer: {
    margin: 10,
    marginLeft: 20,
  },
  textInput: {
    color: '#000',
    fontSize: 18,
    borderRadius: 20,
    backgroundColor: '#aeb0af',
    height: 65,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#484648',
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 17,
    color: '#000',
    marginTop: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formbtn: {
    width: 350,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    color: '#ffffff',
    alignItems: 'center',
    backgroundColor: '#0470DC',
    height: 50,
    borderRadius: 15,
  },
});

export default SignUp;
