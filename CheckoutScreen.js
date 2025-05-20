import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ImageBackground,
  Modal,
  Animated,
  Easing,
} from 'react-native';

import backgroundImage from './assets/bg.jpg'; // Ensure this path is correct

// --- Receipt Modal Component ---
const ReceiptModal = ({ visible, onClose, orderItems, totalAmount }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible, scaleValue]);

  const modalScale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.receiptModalContent, { transform: [{ scale: modalScale }] }]}>
          <Text style={styles.receiptTitle}>Order Receipt</Text>
          <View style={styles.receiptHeaderLine} />

          <FlatList
            data={orderItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.receiptItem}>
                <Text style={styles.receiptItemName}>{item.name}</Text>
                <Text style={styles.receiptItemDetails}>
                  {item.quantity} x ${item.price.toFixed(2)} = <Text style={styles.receiptItemSubtotal}>${ (item.quantity * item.price).toFixed(2) }</Text>
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyReceiptText}>No items found in this order.</Text>}
            style={styles.receiptList}
          />
          <View style={styles.receiptTotalLine} />
          <Text style={styles.receiptGrandTotal}>Grand Total: <Text style={styles.receiptGrandTotalValue}>${totalAmount.toFixed(2)}</Text></Text>
          <Text style={styles.receiptThankYou}>Thank you for choosing Rapid Kitchen!</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
// --- End Receipt Modal Component ---

const ThankYouModal = ({ visible, onClose, onViewReceipt }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible, scaleValue]);

  const modalScale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }] }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.checkmark}>🎉</Text> {/* Changed checkmark to party popper for more celebration */}
          </View>
          <Text style={styles.modalTitle}>Order Placed!</Text>
          <Text style={styles.modalText}>Your delicious meal is being prepared and will be delivered soon.</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.viewReceiptButton]} onPress={onViewReceipt}>
            <Text style={styles.modalButtonText}>View Receipt</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function CheckoutScreen({ route, navigation }) {
  const { cart, setCart } = route.params;
  const [localCart, setLocalCart] = useState(cart);
  const [isThankYouVisible, setIsThankYouVisible] = useState(false);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);

  // Effect to update localCart if cart from route params changes
  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const removeItem = (id) => {
    const updatedCart = localCart.filter(item => item.id !== id);
    setLocalCart(updatedCart);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      const updatedCart = localCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setLocalCart(updatedCart);
    }
  };

  const confirmOrder = () => {
    if (localCart.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart before placing an order.');
      return;
    }
    // Store a copy of the cart items before clearing the cart for the receipt
    setOrderedItems([...localCart]);
    setIsThankYouVisible(true);
    setCart([]); // Clear the main cart state (passed from Home)
    // localCart will also be cleared by the useEffect when setCart triggers it.
  };

  const handleThankYouModalClose = () => {
    setIsThankYouVisible(false);
    navigation.navigate('Home');
  };

  const handleViewReceipt = () => {
    setIsThankYouVisible(false);
    setIsReceiptVisible(true);
  };

  const handleReceiptModalClose = () => {
    setIsReceiptVisible(false);
    navigation.navigate('Home');
  };

  const cancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel your order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setCart([]);
            // localCart will also be cleared by the useEffect.
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAmount = localCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const receiptTotalAmount = orderedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Cart</Text>

        {localCart.length === 0 && !isThankYouVisible && !isReceiptVisible ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is currently empty. Add some delicious meals from the menu!</Text>
            <TouchableOpacity
              style={[styles.button, styles.goToMenuButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={localCart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={styles.cartList}
            contentContainerStyle={styles.cartListContent}
          />
        )}
       
        {localCart.length > 0 && ( // Only show total and buttons if cart is not empty
          <>
            <View style={styles.summaryContainer}>
              <Text style={styles.totalLabel}>Order Total:</Text>
              <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.placeOrderButton]}
              onPress={confirmOrder}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelOrderButton]}
              onPress={cancelOrder}
            >
              <Text style={styles.buttonText}>Cancel Order</Text>
            </TouchableOpacity>
          </>
        )}

        <ThankYouModal
          visible={isThankYouVisible}
          onClose={handleThankYouModalClose}
          onViewReceipt={handleViewReceipt}
        />

        <ReceiptModal
          visible={isReceiptVisible}
          onClose={handleReceiptModalClose}
          orderItems={orderedItems}
          totalAmount={receiptTotalAmount}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // --- General Layout & Background ---
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#f8f8f8', // Very light gray for subtle contrast
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Almost opaque white for content area
    borderRadius: 20, // More pronounced rounded corners
    margin: 15, // Increased margin from screen edges
    shadowColor: '#000', // Stronger shadow for the main content block
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },

  // --- Header Title ---
  title: {
    fontSize: 32, // Larger, more impactful title
    fontWeight: '800', // Extra bold
    marginBottom: 25, // More space below title
    color: '#2c3e50', // Darker, professional text color
    textAlign: 'center',
    letterSpacing: 0.5, // Slightly spaced out letters for elegance
  },

  // --- Cart List & Items ---
  cartList: {
    flexGrow: 1,
    marginBottom: 20, // More space before total summary
  },
  cartListContent: {
    paddingBottom: 10, // Padding at the bottom of the scrollable list
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12, // Rounded corners for individual items
    padding: 15, // More padding inside item rows
    marginBottom: 15, // More space between items
    shadowColor: '#000', // Subtle shadow for each item card
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 80, // Larger image
    height: 80, // Larger image
    borderRadius: 10, // Rounded image corners
    marginRight: 20,
    resizeMode: 'cover', // Ensures image covers the area well
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 19, // Larger item name
    fontWeight: '700',
    color: '#34495e', // Darker item name
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#7f8c8d', // Softer gray for price
    marginBottom: 3,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  itemActions: {
    alignItems: 'flex-end', // Align price and button to the right
  },
  itemSubtotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60', // Green for item subtotal
    marginBottom: 10,
  },
  removeBtn: {
    backgroundColor: '#e74c3c', // Modern red for remove
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  removeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },

  // --- Summary & Buttons ---
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecf0f1', // Light gray background for total summary
    padding: 18,
    borderRadius: 15,
    marginBottom: 25, // More space before buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1, // Subtle border
    borderColor: '#bdc3c7',
  },
  totalLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34495e',
  },
  totalValue: {
    fontSize: 26, // Larger total value
    fontWeight: 'bold',
    color: '#27ae60', // Stronger green for total amount
  },
  button: {
    paddingVertical: 18, // More vertical padding for a larger touch area
    borderRadius: 12, // More rounded buttons
    alignItems: 'center',
    marginVertical: 10, // More space between buttons
    shadowColor: '#000', // Consistent shadow for all buttons
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700', // Bolder button text
    fontSize: 19, // Larger button text
    letterSpacing: 0.5,
  },
  placeOrderButton: {
    backgroundColor: '#2ecc71', // Vibrant green
  },
  cancelOrderButton: {
    backgroundColor: '#e74c3c', // Modern red
  },
  goToMenuButton: { // Style for empty cart button
    backgroundColor: '#3498db', // A friendly blue
    marginTop: 25,
    width: '80%', // Make it a bit narrower
    alignSelf: 'center', // Center it
  },

  // --- Empty Cart State ---
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fdfdff', // Very light background
    borderRadius: 15,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 19,
    color: '#7f8c8d',
    marginBottom: 30,
    lineHeight: 28,
    fontWeight: '500',
  },

  // --- Modal Overlays & Common Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker, more immersive overlay
  },
  modalButton: {
    backgroundColor: '#27ae60', // Consistent green for modal buttons
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
  },

  // --- Thank You Modal Specifics ---
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 30, // Extremely rounded for a friendly look
    alignItems: 'center',
    elevation: 25, // Very strong shadow
    width: '90%', // Wider modal
  },
  iconContainer: {
    backgroundColor: '#2ecc71', // Vibrant green for checkmark background
    borderRadius: 70, // Larger perfect circle
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
  checkmark: {
    fontSize: 65, // Larger checkmark/emoji
  },
  modalTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: '#555',
    lineHeight: 26,
    fontWeight: '400',
  },
  viewReceiptButton: {
    backgroundColor: '#3498db', // Distinct blue for "View Receipt"
  },

  // --- Receipt Modal Specifics ---
  receiptModalContent: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    width: '95%', // Almost full width for receipt
    maxHeight: '80%', // Allow more height for content
    alignItems: 'center',
    elevation: 18,
    borderWidth: 1, // Subtle border for receipt
    borderColor: '#ecf0f1',
  },
  receiptTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  receiptHeaderLine: {
    borderBottomColor: '#dfe6e9', // Very light gray for subtle line
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 20,
  },
  receiptList: {
    width: '100%',
    marginBottom: 25,
    flexGrow: 0,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#f1f2f6', // Even lighter separator
    borderBottomWidth: 1,
  },
  receiptItemName: {
    fontSize: 17,
    color: '#34495e',
    flex: 2,
    fontWeight: '500',
  },
  receiptItemDetails: {
    fontSize: 17,
    color: '#7f8c8d',
    textAlign: 'right',
    flex: 1,
  },
  receiptItemSubtotal: { // Specific style for subtotal within receipt item
    fontWeight: 'bold',
    color: '#27ae60',
  },
  receiptTotalLine: {
    borderTopColor: '#34495e', // Darker line for emphasis on total
    borderTopWidth: 2,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  receiptGrandTotal: {
    fontSize: 25,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'right',
    width: '100%',
    paddingRight: 5,
  },
  receiptGrandTotalValue: {
    fontWeight: 'bold',
    color: '#27ae60', // Highlight total in green
  },
  receiptThankYou: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyReceiptText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#95a5a6',
    paddingVertical: 20,
  },
});