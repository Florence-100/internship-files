import React, {ReactElement} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/Appstyles';

type taskelement = {
  rank: number;
  title: string;
  active: boolean;
  id: number;
};

type stateobject = {
  count: number;
  data: Array<taskelement>;
  title: string;
  showComplete: boolean;
  showNotComplete: boolean;
  completedata: Array<taskelement>;
  notcompletedata: Array<taskelement>;
};

export default class TodosList extends React.Component<
  Record<string, unknown>,
  stateobject
> {
  getData = async (): Promise<Array<taskelement>> => {
    const defaulttask: Array<taskelement> = [
      {rank: 1, title: 'Task 1', active: false, id: 1},
    ];
    try {
      const jsonValue = await AsyncStorage.getItem('key');
      if (jsonValue) {
        const output: Array<taskelement> = JSON.parse(jsonValue);
        if (output[0] !== undefined) {
          let i = 0;
          const countlist: number[] = [];
          const completeoutput: Array<taskelement> = [];
          const notcompleteoutput: Array<taskelement> = [];
          for (i = 0; i < output.length; i++) {
            countlist.push(output[i].id);
            if (output[i].active) {
              completeoutput.push(output[i]);
            } else {
              notcompleteoutput.push(output[i]);
            }
          }
          countlist.sort(function (a, b) {
            return b - a;
          });
          this.setState((state: stateobject) => ({
            ...state,
            count: countlist[0] + 1,
            data: output,
            completedata: completeoutput,
            notcompletedata: notcompleteoutput,
          }));
          return output;
        } else {
          this.setState((state: stateobject) => ({...state, count: 2}));
          this.setState((state: stateobject) => ({
            ...state,
            data: defaulttask,
            notcompletedata: defaulttask,
          }));
          return defaulttask;
        }
      }
    } catch (e) {
      alert(e);
      this.setState((state: stateobject) => ({...state, count: 2}));
      this.setState((state: stateobject) => ({
        ...state,
        data: defaulttask,
        notcompletedata: defaulttask,
      }));
      return defaulttask;
    }
    return defaulttask;
  };

  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      count: 2,
      data: [],
      title: '',
      showComplete: false,
      showNotComplete: false,
      completedata: [],
      notcompletedata: [],
    };
  }

  componentDidMount = async (): Promise<void> => {
    this.setState({
      data: await this.getData(),
    });
  };

  renderItem = ({item}: {item: taskelement}): ReactElement => {
    return (
      <View style={styles.TaskItem}>
        <TouchableOpacity
          style={styles.TaskEntry}
          onPress={(): void => this.setToggleCheckBox(item)}>
          <Text
            style={{textDecorationLine: item.active ? 'line-through' : 'none'}}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <View>
          <Text>{item.id}</Text>
        </View>
        <View style={styles.CompleteButton}>
          <Text>{item.active ? 'Completed' : 'Not Completed'}</Text>
        </View>
        <TouchableOpacity onPress={(): void => this.deleteTitle(item)}>
          <Image
            style={styles.deleteIcon}
            source={require('./images/delete.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  storeData = async (value: Array<taskelement>): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('key', jsonValue);
    } catch (e) {
      alert('Task not stored');
    }
  };

  saveTitle(this: any): void {
    const newArr: Array<taskelement> = [...this.state.data];
    newArr.push({
      rank: newArr.length + 1,
      title: this.state.title,
      active: false,
      id: this.state.count,
    });
    const newnotcompleteArr: Array<taskelement> = [
      ...this.state.notcompletedata,
    ];
    newnotcompleteArr.push({
      rank: newArr.length + 1,
      title: this.state.title,
      active: false,
      id: this.state.count,
    });
    this.setState((state: stateobject) => ({
      ...state,
      data: newArr,
      notcompletedata: newnotcompleteArr,
    }));
    this.storeData(newArr);
  }

  setToggleCheckBox(this: any, val: taskelement): void {
    const newArr: Array<taskelement> = [...this.state.data]; //for all data
    const newComplete: Array<taskelement> = [...this.state.completedata]; //for all complete data
    const newnotComplete: Array<taskelement> = [...this.state.notcompletedata]; //for all not complete data
    let y = 0;
    for (y = 0; y < newArr.length; y++) {
      if (newArr[y].id === val.id) {
        newArr[y].active = true;
      }
    }
    this.storeData(newArr);
    val.active = true;
    newComplete.push(val);
    this.setState((state: stateobject) => ({
      ...state,
      data: newArr,
      completedata: newComplete,
      notcompletedata: newnotComplete.filter(
        (element: taskelement) => element.id !== val.id,
      ),
    }));
  }

  deleteTitle(this: any, value: taskelement): void {
    const Arr: Array<taskelement> = [...this.state.data];
    const completeArr: Array<taskelement> = [...this.state.completedata];
    const notcompleteArr: Array<taskelement> = [...this.state.notcompletedata];
    this.setState((state: stateobject) => ({
      ...state,
      data: Arr.filter((element) => element.id !== value.id),
      completedata: value.active
        ? completeArr.filter((element) => element.id !== value.id)
        : completeArr,
      notcompletedata: value.active
        ? notcompleteArr
        : notcompleteArr.filter((element) => element.id !== value.id),
    }));
    this.storeData(
      Arr.filter((element: taskelement) => element.id !== value.id),
    );
  }

  Increment(this: any): void {
    this.setState((state: stateobject) => ({...state, count: state.count + 1}));
  }

  setTitle(this: any, input: string): void {
    this.setState((state: stateobject) => ({...state, title: input}));
  }

  render(): ReactElement {
    return (
      <View style={styles.container}>
        <SafeAreaView style={[styles.contentContainer, {flex: 1}]}>
          <Text style={styles.title}>To do list</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter a task'}
            onChangeText={(text: string): void => this.setTitle(text)}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={(): void => {
              this.Increment();
              this.saveTitle();
            }}>
            <Text style={{textAlign: 'center'}}>Add task</Text>
          </TouchableOpacity>
          <FlatList<taskelement>
            data={
              this.state.showComplete
                ? this.state.completedata
                : this.state.showNotComplete
                ? this.state.notcompletedata
                : this.state.data
            }
            renderItem={this.renderItem}
            keyExtractor={(item: taskelement): string => item.id.toString()}
          />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState((state: stateobject) => ({
                  ...state,
                  showComplete: false,
                  showNotComplete: false,
                }));
              }}>
              <Text style={{textAlign: 'center'}}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState((state: stateobject) => ({
                  ...state,
                  showComplete: false,
                  showNotComplete: true,
                }));
              }}>
              <Text style={{textAlign: 'center'}}>Not Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={(): void => {
                this.setState((state: stateobject) => ({
                  ...state,
                  showComplete: true,
                  showNotComplete: false,
                }));
              }}>
              <Text style={{textAlign: 'center'}}>Completed</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
