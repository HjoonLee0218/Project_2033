import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { scenes } from './eventMap';
import { supabase } from './supabase';
import { imageMap } from './imageMap';

export default function App() {
  const [scene, setScene] = useState(scenes.start);
  const [inventory, setInventory] = useState([]);

  const handleChoice = async (choice) => {
    const nextScene = scenes[choice.nextScene];

    if (!nextScene) {
      console.error('Scene not found:', choice.nextScene);
      return;
    }

    // Add items to inventory
    if (nextScene.store && Array.isArray(nextScene.store)) {
      const newItems = nextScene.store.filter(
        (item) => !inventory.includes(item)
      );
      setInventory([...inventory, ...newItems]);
    }

    // Save score if it's an ending
    if (nextScene.isEnding) {
      const score = inventory.length * 10;
      const { error } = await supabase.from('scores').insert([
        {
          player_name: 'Anonymous',
          score: score,
          ending: nextScene.text,
        },
      ]);
      if (error) {
        console.error('Failed to save score:', error);
      } else {
        console.log('Score saved!');
      }
    }

    setScene(nextScene);
  };

  // Show only choices that pass inventory requirements
  const availableChoices =
    scene.choices?.filter((choice) => {
      if (!choice.required) return true;
      return inventory.includes(choice.required);
    }) || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scene.image && imageMap[scene.image] && (
        <Image
          source={imageMap[scene.image]}
          style={styles.image}
        />
      )}

      <Text style={styles.text}>{scene.text}</Text>

      {availableChoices.map((choice, i) => (
        <View key={i} style={styles.choiceButton}>
          <Button title={choice.text} onPress={() => handleChoice(choice)} />
        </View>
      ))}

      {scene.isEnding && (
        <Text style={styles.ending}>🎉 THE END 🎉</Text>
      )}

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
  ending: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});
