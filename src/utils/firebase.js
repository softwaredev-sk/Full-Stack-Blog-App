import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: 'blogapp-b5d41.firebaseapp.com',
  projectId: 'blogapp-b5d41',
  storageBucket: 'blogapp-b5d41.appspot.com',
  messagingSenderId: '558864194232',
  appId: '1:558864194232:web:ca033e215d326dc04a724d',
};

export const app = initializeApp(firebaseConfig);

// authDomain: process.env.AUTHDOMAIN,
// projectId: process.env.PROJECTID,
// storageBucket: process.env.STORAGEBUCKET,
// messagingSenderId: process.env.MESSAGINGSENDERID,
// appId: process.env.APPID,
