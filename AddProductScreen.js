import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
// Removed logo import as it's not used in this screen's content


export default function AddProductScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  async function saveProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Please enter product name and price.');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    try {
      const { data, error } = await supabase.from('products').insert([
        {
          name: name.trim(),
          price: priceNum,
          image_url: imageUrl.trim() || null,
        },
      ]);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Product added successfully!');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={styles.container}>
      {/* --- Added Header Text Here --- */}
      <Text style={styles.screenHeader}>🍴 Add a new Meal</Text>
      {/* ---------------------------- */}

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter image URL (optional)"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={saveProduct}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0', // Added a light background color for consistency
  },
  // --- Added style for the screen header text ---
  screenHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Space below the header
    color: '#333', // Dark color for the text
  },
  // --------------------------------------------
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    color: '#555', // Slightly darker label color
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
    backgroundColor: '#fff', // White background for inputs
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // Center text vertically
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
