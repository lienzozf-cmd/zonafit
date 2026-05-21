import { getFirestoreDB } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface OrderData {
  orderId: string;
  shippingInfo: any;
  orderItems: any[];
  orderSubtotal: number;
  orderDiscount: number;
  orderShipping: number;
  orderCommission: number;
  orderTotal: number;
  createdAt?: any;
}

export async function saveOrder(orderData: OrderData) {
  try {
    const db = getFirestoreDB();
    const ordersRef = collection(db, 'orders');
    
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function getOrders(): Promise<OrderData[]> {
  try {
    const db = getFirestoreDB();
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders: OrderData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as OrderData);
    });
    
    return orders;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}
