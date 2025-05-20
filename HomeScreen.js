// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { supabase } from './supabase'; 

// Import your background image file here
import backgroundImage from './assets/bg.jpg'; // Make sure this path is correct!


export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
      setFilteredProducts(data);
      // The problematic line 'fungicideData);' was here. It has been removed.
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      const updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.image_url }} style={styles.image} />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.item}>{item.name}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ffa500' }]}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.buttonText}> +</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.image_url }} style={styles.image} />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.item}>{item.name}</Text>
        <Text>Qty: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.removeBtn]}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>🍽️ Menu</Text>

        <TextInput
          placeholder="🔍 Search for food..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
        />

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: '#e08d3c' }]}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.buttonText}>➕ Add New Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: '#cc5500', marginTop: 10 }]}
          onPress={() => navigation.navigate('Checkout', { cart, setCart })}
        >
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { marginTop: 20 }]}>Your Cart</Text>
        {cart.length === 0 ? (
          <Text style={{ color: '#666' }}>Your cart is empty.</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => `c${item.id}`}
            renderItem={renderCartItem}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10, // Optional: Rounded corners for the content area
    margin: 5, // Optional: Add some margin around the content area
  },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 6 },
  item: { fontSize: 16, fontWeight: '600' },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  removeBtn: { backgroundColor: '#dc3545', padding: 6, borderRadius: 6 },
  removeText: { color: 'white', fontWeight: 'bold' },
  navButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});