import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Button, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TodosList = () => {

    const getData = async () => {
        try{
            const jsonValue = await AsyncStorage.getItem('key');
            output = JSON.parse(jsonValue);
            if (output[0] != undefined){
                setData(output);
                let count_list = [];
                var i;
                for (i=0; i<output.length; i++){
                    count_list.push(output[i].id);
                }
                count_list.sort(function(a, b){return b - a});
                setCount(count_list[0]+1);
            }
            else {
                setCount(2);
                setData([{rank:1, title: 'Task 1', active:false, id:1}])
            }
        }
        catch (e) {
            alert(e);
        }
    }

    const [count, setCount] = useState(1);
    const [data, setData] = useState(getData);
    const [title, setTitle] = useState('');
    const [showComplete, setshowComplete] = useState(false);
    const [showNotComplete, setshowNotComplete] = useState(false);

    const renderItem = ({item,index}) => {
        if(showComplete) {
            if (item.active) {
                return (
                    eachEntry(item,index)
                );
            }
        }
        else {
            if (showNotComplete){
                if (!item.active) {
                    return (
                        eachEntry(item,index)
                    );
                }
            }
            else {
                return (
                    eachEntry(item,index)
                );
            }
        }
    };

    const storeData = async (value) => {
        try{
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('key', jsonValue);
        } catch (e) {
            alert('Task not stored');
        }
    };

    const saveTitle = () => {
        let newArr = [...data];
        newArr.push({rank:newArr.length+1, title:title, active:false, id:count});
        setData(newArr);      
        storeData(newArr);
    };

    const setToggleCheckBox = (value,index) => {
        let newArr = [...data];
        newArr[index].active = true;
        setData(newArr);
        storeData(newArr);
    };

    const deleteTitle = value => e => {
        setData(data.filter(element => element !== value));
        storeData(data.filter(element => element !== value));
    };

    const Increment = () => {
        setCount(count + 1);
    };

    const eachEntry = (item,index) => {
        return (
            <View style={styles.TaskItem}>
                <CheckBox disabled={false} value={item.active} onValueChange={(newValue) => setToggleCheckBox(newValue,index)}/>             
                <View style={styles.TaskEntry}>
                    <Text style={styles.SubTitle, 
                    {textDecorationLine: item.active ? 'line-through' : 'none'}}>{item.title}</Text>
                </View>
                <View style={styles.Number}>
                    <Text>{item.id}</Text>
                </View>                                    
                <View style={styles.CompleteButton}>
                    <Text>{item.active ? 'Completed' : 'Not Completed'}</Text>
                </View>
                <TouchableOpacity onPress={deleteTitle(item)}>
                    <Image style= {styles.deleteIcon} source={require('./images/delete.png')} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style = {styles.container}>
            <SafeAreaView style={styles.contentContainer, {flex:1}}>
                <Text style = {styles.title}>To do list</Text>
                <TextInput style={styles.textInput} placeholder={'Please enter a task'} onChangeText={(text) => setTitle(text)}/>
                <TouchableOpacity style={styles.addButton} onPress={() => {saveTitle();Increment();}}>
                    <Text style={{textAlign: 'center'}}>Add task</Text>
                </TouchableOpacity>
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => '${item.id}'} />
                <View style={{flexDirection:'row'}}> 
                    <TouchableOpacity style={styles.footerButton} onPress={() => {setshowComplete(false); setshowNotComplete(false);}}>
                        <Text style={{textAlign: 'center'}}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => {setshowComplete(false); setshowNotComplete(true);}}>
                        <Text style={{textAlign: 'center'}}>Not Completed</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.footerButton} onPress={() => {setshowComplete(true); setshowNotComplete(true);}}>
                        <Text style={{textAlign: 'center'}}>Completed</Text>
                    </TouchableOpacity>                                      
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles =  StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
        display: 'flex',
    },

    textInput: {
        padding: 15,
        backgroundColor: 'lightblue',
        fontSize: 20,
        marginTop: 20,
    },

    addButton: {
        backgroundColor: 'lightgreen',
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
    },

    TaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
    },

    TaskEntry: {
        width: 160,
    },

    CompleteButton: {
        marginLeft: 15,
        width: 100,
        backgroundColor: 'khaki',
        alignItems:'center',
    },

    footerButton: {
        backgroundColor:'lightpink', 
        width: 90,
        textAlign: 'center',
        marginLeft: 30,
    },

    deleteIcon: {
        marginLeft: 7,
    },

    number: {
        width: 5,
        marginLeft: 5,
    }
});