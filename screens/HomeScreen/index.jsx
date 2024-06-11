import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  Appbar,
  Button,
  PaperProvider,
  TextInput,
  DefaultTheme,
  Switch,
} from "react-native-paper";
import ListItem from "./ListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
import openDB from "../../db";



const db = openDB();


const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7851A9",
    background: "#ffffff",
    text: "#000000",
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
  },
};

const darkTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7851A9",
    background: "#ffffff",
    text: "white",
  },
  
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
  },
};

export default function HomeScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [newCard, setNewCard] = useState({ todoTitle: "", todoText: "" });
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    (async () => {
      const savedDarkMode = await getDarkMode();
      setDarkMode(savedDarkMode === "true");
    })();
  }, []);

  useEffect(() => {
    const rows = db.getAllSync (" select * from todo_list ", []);
    console.log(JSON.stringify(rows));

    } , []);

  

  const saveDarkMode = async (value) => {
    try {
      await AsyncStorage.setItem("@darkMode", value.toString());
    } catch (e) {
      console.log("Failed to save dark mode state", e);
    }
  };

  const getDarkMode = async () => {
    try {
      const value = await AsyncStorage.getItem("@darkMode");
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log("Failed to fetch dark mode state", e);
    }
    return "false";
  };

  function handleAddCard() {
    if (newCard.todoTitle && newCard.todoText) {

      setTodoList([...todoList, newCard]);
      
      setNewCard({ todoTitle: "", todoText: "" });

      const newCardText = newCard.todoText
      const newCardTitle = newCard.todoTitle

      db.withTransactionSync (() => {
        db.execSync(`INSERT INTO todo_list (todoTitle, todoText) VALUES ('${newCardTitle}', '${newCardText}')`)

        });
    }
  }

  function handleChangeText(key, value) {
    setNewCard({ ...newCard, [key]: value });
  }

  function toggleChecked(index, listType) {
    if (listType === "todo") {
      setTodoList((prevList) => {
        const updatedList = [...prevList];
        const item = updatedList[index];
        item.checked = !item.checked;

        if (item.checked) {
          setCheckedList((prevCheckedList) => [...prevCheckedList, item]);
          updatedList.splice(index, 1);
        } else {
          setCheckedList((prevCheckedList) =>
            prevCheckedList.filter((_, i) => i !== index)
          );
        }

        return updatedList;
      });
    } else if (listType === "checked") {
      setCheckedList((prevCheckedList) => {
        const updatedCheckedList = [...prevCheckedList];
        const item = updatedCheckedList[index];
        item.checked = !item.checked;

        if (!item.checked) {
          setTodoList((prevList) => [...prevList, item]);
          updatedCheckedList.splice(index, 1);
        }

        return updatedCheckedList;
      });
    }
  }

  function handleDelete(index, listType) {
    if (listType === "todo") {
      setTodoList((prevList) => prevList.filter((_, i) => i !== index));
    } else if (listType === "checked") {
      setCheckedList((prevCheckedList) =>
        prevCheckedList.filter((_, i) => i !== index)
      );
    }
  }
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveDarkMode(newDarkMode.toString());
  };


  return (
    <PaperProvider theme={darkMode ? darkTheme : lightTheme}>
      <Appbar.Header
        style={!darkMode ? { backgroundColor: "#5D3FD3", borderBottomColor: "#202020" } : {backgroundColor: "#7851A9"} }
      >
        <Appbar.Content
          titleStyle={darkMode ? styles.darkTitle : styles.title}
          title="Persistencia - HOME"
        />
      </Appbar.Header>
      <View style={ !darkMode ? styles.appContainer : styles.darkAppContainer }>
      <View style={styles.containerSwitch}>
          <Text style={{ color: darkMode ? "#ffffff" : "#000000" }}>Dark Mode    </Text>
          <Switch value={darkMode} onValueChange={handleToggleDarkMode} />
        </View>
        <View style={styles.addContainer}>
          <TextInput
            label={<Text style={styles.labelStyle}>Title: </Text>}
            value={newCard.todoTitle}
            onChangeText={(text) => handleChangeText("todoTitle", text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={<Text style={styles.labelStyle}>Text: </Text>}
            value={newCard.todoText}
            onChangeText={(text) => handleChangeText("todoText", text)}
            mode="outlined"
            style={styles.input}
          />

          <Button
            style={darkMode ? styles.darkAddButton :  styles.addButton}
            mode="contained"
            onPress={handleAddCard}
          >
            <Text style={styles.buttonText}> Add Todo Card + </Text>
          </Button>
        </View>

        <View style={styles.taskListContainer}>
          <Text style={darkMode ? styles.darkTitle : styles.listTitle}>All Tasks : </Text>
          <FlatList
            style={styles.containerList}
            data={todoList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ListItem
              darkMode={darkMode}
                style={styles.listItemStyle}
                item={item}
                index={index}
                onPress={() =>
                  navigation.navigate("CardScreen", { item, index })
                }
                onToggleChecked={() => toggleChecked(index, "todo")}
                onDelete={() => handleDelete(index, "todo")}
              />
            )}
          />
        </View>
        <Text style={darkMode ? styles.darkTitle : styles.listTitle}>Checked Tasks : </Text>
        <FlatList
          style={styles.containerList}
          data={checkedList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ListItem
              darkMode={darkMode}
              item={item}
              index={index}
              onPress={() => navigation.navigate("CardScreen", { item, index })}
              onToggleChecked={() => toggleChecked(index, "checked")}
              onDelete={() => handleDelete(index, "checked")}
            />
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  addContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  addButton: {
    backgroundColor: "#5D3FD3",
    textAlign: "center",
  },

  darkAddButton: {
    backgroundColor: "#7851A9",
    textAlign: "center",
},

  containerSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  containerList: {
    height: 124,
  },
  appContainer: {
    padding: 16,
    gap: 16,
    flex: 1,
  },
  darkAppContainer: {
    padding: 16,
    gap: 16,
    flex: 1,
    backgroundColor: "#404040"
  },
  input: {
    fontSize: 20,
    fontWeight: "600",
  },
  labelStyle: {
    fontWeight: "600",
  },

  buttonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontWeight: "600",
    color: "white",
    fontSize: 28,       
  },
  listTitle: {
    fontWeight: "600",
    color: "black",
    fontSize: 28,
  },
  darkTitle: {
    fontWeight: "600",
    color: "white",
    fontSize: 28,  
  },
  taskListContainer: {
    height: 248,
  },
  listItemStyle: {

  },
  darkListItem: {
    color: "white"
  }
});
