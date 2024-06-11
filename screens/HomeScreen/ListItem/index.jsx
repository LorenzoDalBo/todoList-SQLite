import React from 'react';
import { List, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Checkbox } from 'react-native-paper/src';

const ListItem = ({ item, index, onPress, onToggleChecked, onDelete, style, darkMode }) => {
    
  
  return (
    <Animatable.View animation="bounceIn" duration={300} style={style}>
      <List.Item
        onPress={onPress}
        titleStyle={{ color: darkMode ? "white" : "black" }}
        key={index.toString()}
        title={item.todoTitle}
        description={item.todoText}
        descriptionStyle={!darkMode ? {color: "black"} : {color: "white"} }
        left={(props) => (
          <Checkbox
            
            color={darkMode ? "white" : "black"}
            uncheckedColor={darkMode ? "white" : "black"}
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => onToggleChecked(index)}
          />
        )}
        right={(props) => (
          <IconButton
            icon="delete"
            iconColor={darkMode ? "white" : "black"}
            size={24}
            onPress={() => onDelete(index)}
          />
        )}
      />
    </Animatable.View>
    );
  };
  
  export default ListItem;