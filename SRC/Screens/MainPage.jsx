/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Portal, Modal, FAB, PaperProvider } from 'react-native-paper';
import CardUser from '../Components/CardUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';


const MainPage = (props) => {

  const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [name, onChangeName] = useState('');
  const [mobileNu, onChangeMobile] = useState('');
  const [emailAdd, onChangeEmail] = useState('');
  const [edit, setEdit] = useState(false);
  const [prevemail, setPrevmail] = useState('');

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;


  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setEdit(false);
    setVisible(false);
  };

  const [filteredUsers, setfilteredUsers] = useState([]);
  const addUser = async()=>{
    try {
      const data = {
        name: name,
        emailA: emailAdd,
        phoneN: mobileNu,
        addedtimestamp: Date.now(),
        edittimestamp:  Date.now(),
      };
      console.log(data);
      addtoAPI(data);
      const updatedFilteredUsers = [...filteredUsers, data];
      setfilteredUsers(updatedFilteredUsers);
      await saveDataToLocal(updatedFilteredUsers);
      Toast.show('New user added', Toast.LONG);
    } catch (error){
      console.log(error);
    }
  };


  const addtoAPI = async(data)=>{
    if (isConnected){
      await axios
        .post(`http://192.168.29.190:3000/Crud/addUser/${props.route.params}`, data)
        .then((response) => {
          console.log("Created new user in api")
          Toast.show('Added to API new user', Toast.LONG);
        })
        .catch((error) => {
          console.log("error creating post", error.response.data);
        });
    }
    else {
      Toast.show('No network but stored locally', Toast.SHORT);
    }
  };

  
  const handleDelete = async (emailId) => {
    try {
      console.log('Delete pressed here in main page');
      setfilteredUsers(filteredUsers.filter((user) => user.emailA !== emailId));
      Toast.show('User deleted', Toast.LONG);
      deleteInAPI(emailId);
    } catch (error){
      console.log(error);
    }
};

  const deleteInAPI = async(emailId)=>{
    if (isConnected){
      await axios
        .post(`http://192.168.29.190:3000/Crud/deleteUser/${props.route.params}`, emailId)
        .then((response) => {
          console.log("Deleted in API also")
          Toast.show('Deleted in API', Toast.LONG);
        })
        .catch((error) => {
          console.log("error deleting from API", error.response.data);
        });
    }
    else {
      Toast.show('No network but deleted locally', Toast.SHORT);
    }
  };



  const handleEdit = (emailId) => {
    console.log('Edit user with ID:', emailId);
    setPrevmail(emailId);
    setEdit(true);
    const user = filteredUsers.find((users) => users.emailA === emailId);
    onChangeName(user.name);
    onChangeEmail(user.emailA);
    onChangeMobile(user.phoneN);
    showModal();

  };

  const editData = async()=>{
    try {
      const timestamp = Date.now();
      const updatedFilteredUsers = filteredUsers.map((user) => {
        if (user.emailA === prevemail) {
          return {
            ...user,
            name: name,
            phoneN: mobileNu,
            emailA: emailAdd,
            addedtimestamp: user.addedtimestamp,
            edittimestamp: timestamp,
          };
        }
        return user;
      });
      setfilteredUsers(updatedFilteredUsers);
      await saveDataToLocal(updatedFilteredUsers);
      editInAPI(timestamp);
      Toast.show('User is edited', Toast.LONG);
    }
    catch (error){
      console.log(error);
    }
  };


  const editInAPI = async(timestamp) =>{
    if (isConnected){
      const sendData = {
        name: name,
        phoneN: mobileNu,
        emailA: emailAdd,
        edittimestamp: timestamp,
        prevemail: prevemail,
      };
      await axios
        .post(`http://192.168.29.190:3000/Crud/editUser/${props.route.params}`, sendData)
        .then((response) => {
          console.log("Edited in API also")
          Toast.show('Edited to API', Toast.LONG);
        })
        .catch((error) => {
          console.log("error deleting from API", error.response.data);
        });
    }
    else {
      Toast.show('No network but edited locally', Toast.SHORT);
    }
  };

  const loadAPI = async()=>{
    await axios
        .get(`http://192.168.29.190:3000/Crud/get-all-users/${props.route.params}`)
        .then((response) => {
          console.log(response.data);
          setfilteredUsers(response.data);
          Toast.show('Edited to API', Toast.LONG);
        })
        .catch((error) => {
          console.log("error deleting from API", error.response.data);
        });
  }


  useEffect(() => {

    return () => {
      console.log(props.route.params);
    };
  }, [filteredUsers]);

  useEffect(() => {
    // if(isConnected)
    // loadAPI();
    // else
    loadDataFromLocal();
  }, []);



  const categories = [
    'Last inserted',
    'A-Z',
    'Z-A',
    'Last modified',
  ];

  const [catNow, setCatNow] = useState('');


  useEffect(() => {
    if (catNow === 'Last inserted'){
      const sortedData = [...filteredUsers].sort((a, b) => b.addedtimestamp - a.addedtimestamp);
      setfilteredUsers(sortedData);
    }
    else if (catNow === 'Last modified'){
      const sortedData = [...filteredUsers].sort((a, b) => b.edittimestamp - a.edittimestamp);
      setfilteredUsers(sortedData);
    }
    else if (catNow === 'A-Z'){
      const sortedData = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
      setfilteredUsers(sortedData);
    }
    else if (catNow === 'Z-A'){
      const sortedData = [...filteredUsers].sort((a, b) => b.name.localeCompare(a.name));
      setfilteredUsers(sortedData);
    }
  }, [catNow]);



  const saveDataToLocal = async (data) => {
    try {
      await AsyncStorage.setItem(`${props.route.params}filteredUsers`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };

  const loadDataFromLocal = async () => {
    try {
      const storedData = await AsyncStorage.getItem(`${props.route.params}filteredUsers`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Loaded data from local storage:', parsedData);
        setfilteredUsers(parsedData);
      } else {
        console.log('No data found in local storage.');
        loadAPI();
      }
    } catch (error) {
      console.error('Error loading data from local storage:', error);
    }
  };

  

  const [searchInput, setSearchInput] = useState('');
  const [searchfilteredUsers, setsearchfilteredUsers] = useState([]);

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filteredData = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.phoneN.includes(searchTerm) ||
        user.emailA.toLowerCase().includes(searchTerm)
    );
    setsearchfilteredUsers(filteredData);
  };



  return (


      <PaperProvider>

        <View style={styles.info2}>
          <TextInput
            placeholder="Search by Name, Mobile, or Email"
            placeholderTextColor="#767476"
            onChangeText={(text) => setSearchInput(text)}
            style={[styles.textInput, styles.searchTextInput, { flex: 1 }]}
            value={searchInput}
            onBlur={handleSearch}
          />
          {searchInput !== '' && (
            <TouchableOpacity onPress={() => {setsearchfilteredUsers([]); setSearchInput('');}} style={{zIndex:30}}>
              <Icon name="times-circle" size={20} color="#fff" style={{ marginRight: 15, zIndex:20, flex:1 , marginTop:12 }} />
            </TouchableOpacity>
          )}
         
        </View>

        <View  style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 3, height: 50 }}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>{
                console.log(category);
                  setCatNow(category);
              }}
              style={[
                styles.categoryButton,
                catNow === category && styles.selectedCategoryButton,
              ]}
              >
            <View>
              <Text
                style={[
                  styles.categoryButtonText,
                  catNow === category && styles.selectedCategoryButtonText,
                ]}
                >
                {category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {searchfilteredUsers.length > 0 ? (
            <FlatList
            data={searchfilteredUsers}
            keyExtractor={(item) => item.emailA}
            renderItem={({ item }) => (
              <CardUser
                key = {item.emailA}
                props = {item}
                onEdit={() => handleEdit(item.emailA)}
                onDelete={() => handleDelete(item.emailA)}
              />
            )}
          />
      ) :

        filteredUsers.length > 0 ? (
            <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.emailA}
            renderItem={({ item }) => (
              <CardUser
                key = {item.emailA}
                props = {item}
                onEdit={() => handleEdit(item.emailA)}
                onDelete={() => handleDelete(item.emailA)}
              />
            )}
          />
      ) : (
        <View style={{alignContent:"center",flex:1, alignSelf:'center'}}>
          <Text style={{color:"#767476"}}>No User Data</Text>
        </View>
      )}

    <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View style={{alignItems:"center"}}>
        <Text style={{fontWeight:"800",color:"white", fontFamily:"sans-serif", marginVertical:20, fontSize:20}}>Add User</Text>
        <View style= {styles.info}>
          <TextInput 
            placeholder={edit ? name : 'Enter Name'}
            placeholderTextColor="#767476"
            onChangeText={text=> onChangeName(text)}
            style = {styles.textInput}
            value={name}
          />
        </View>
        <View style= {styles.info}>
          <TextInput
            placeholder={edit ? mobileNu : 'Enter Mobile Number'}
            placeholderTextColor="#767476"
            //value = {descp}
            onChangeText={text=> onChangeMobile(text)}
            caretHidden={false}
            keyboardType="phone-pad"
            style = {styles.textInput}
            value={mobileNu}
          />
        </View>
        <View style= {styles.info}>
          <TextInput
            placeholder={edit ? emailAdd : 'Enter Email'}
            placeholderTextColor="#767476"
            onChangeText={text=> onChangeEmail(text)}
            style = {styles.textInput}
            value= {emailAdd}
          />
        </View>


        <View style={{ alignItems:"center"}}>
          <TouchableOpacity
            style={styles.startMeetingButton}
            onPress={()=>{
              if (edit && name && mobileNu && emailAdd){
                editData();
              }
              else if (name && mobileNu && emailAdd){
                  addUser();
              }
              hideModal();
            }}
          >
            <Text style={{color:"white", fontWeight: "bold"}}>{edit ? 'Edit' : 'Save'}</Text>

          </TouchableOpacity>
          </View>
          <View style={{ alignItems:"center"}}>
          <TouchableOpacity
            style={styles.startMeetingButton}
            onPress={()=>{
              hideModal();
            }}
          >
            <Text style={{color:"white", fontWeight: "bold"}}>Cancel</Text>

          </TouchableOpacity>
          </View>
          </View>
    </Modal>
  </Portal>

  <FAB.Group
      open={open}
      visible
      icon={open ? 'human-male-male' : 'plus'}
      actions={[
        {
          icon: 'plus',
          label: 'Create new user',
          onPress: () => {
            console.log('Pressed add user');
            onChangeEmail('');
            onChangeName('');
            onChangeMobile('');
            showModal();
          },
        }
      ]}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
      style={{marginBottom:40}}
    />
 </PaperProvider>

  );
};

export default MainPage;

const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: "#373538",
  },
  containerStyle:{
    
  },
  profile:{
    // backgroundColor: "#1c1c1c",
  },
  line:{
    backgroundColor:"#1c1c1c",
    width:"100%",
    height: 0.35,
  },
  flexCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 30,
    marginLeft:-15,
  },
  button: {
    zIndex:30,
  },
  info:{
    alignContent:"center",
    width: "95%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    borderRadius:20,
    backgroundColor: "#373538",
    height: 70,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#484648",
    padding: 12,
    marginBottom:12,
  },
  info2:{
    alignContent:"center",
    alignSelf:'center',
    flexDirection:'row',
    width: "95%",
    borderRadius:20,
    backgroundColor: "#aeb0af",
    height: 60,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#484648",
    padding: 4,
    paddingLeft:16,
    paddingBottom:1,
    marginVertical:12,
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
    borderRadius: 15
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    marginBottom: 50,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom:6,
  },
  categoryButton: {
    paddingVertical: 10,
    marginVertical:2,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0470DC",
  },
  selectedCategoryButton: {
    backgroundColor: "#0470DC",
  },
  categoryButtonText: {
    color: "#0470DC",
  },
  selectedCategoryButtonText: {
    color: "white",
  },
  searchTextInput: {
    marginBottom: 10,
  },
});
