import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
 apiKey: "AIzaSyBSIJEP_4J0X80PCWJmj_9dkxmeVV61Db4",
 authDomain: "inventory-management-app-a5fdb.firebaseapp.com",
 projectId: "inventory-management-app-a5fdb",
 storageBucket: "inventory-management-app-a5fdb.appspot.com",
 messagingSenderId: "1032419802428",
 appId: "1:1032419802428:web:2f469f101c2ca803d13239"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };