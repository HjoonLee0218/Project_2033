import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import startScene from './events/start.json';

export default function App() {
  const [scene, setScene] = useState(startScene);
  const [inventory, setInventory] = useState([]);

  const handleChoice = (choice) => {
    try {
      const nextScene = require(`./events/${choice.nextScene}.json`);

      // Add items from "store" to inventory
      if (nextScene.store && Array.isArray(nextScene.store)) {
        const newItems = nextScene.store.filter((item) => !inventory.includes(item));
        setInventory([...inventory, ...newItems]);
      }

      setScene(nextScene);
    } catch (error) {
      console.error('Error loading scene:', error);
    }
  };

  // Filter choices by inventory requirement
  const availableChoices = scene.choices?.filter((choice) => {
    if (!choice.required) return true;
    return inventory.includes(choice.required);
  }) || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scene.image && (
        <Image
          source={require(`./assets/${scene.image}`)}
          style={styles.image}
        />
      )}

      <Text style={styles.text}>{scene.text}</Text>

      {availableChoices.map((choice, i) => (
        <View key={i} style={styles.choiceButton}>
          <Button title={choice.text} onPress={() => handleChoice(choice)} />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Inventory:</Text>
      <Text>{inventory.length > 0 ? inventory.join(', ') : 'Empty'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  text: { fontSize: 18, marginBottom: 20 },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
  },
  choiceButton: { marginBottom: 10 },
  sectionTitle: { marginTop: 30, fontWeight: 'bold', fontSize: 16 },
});
