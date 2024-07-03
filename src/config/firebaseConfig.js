import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  platform: {
    apiKey: process.env.REACT_APP_PLATFORM_API_KEY,
    authDomain: process.env.REACT_APP_PLATFORM_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PLATFORM_PROJECT_ID,
    storageBucket: process.env.REACT_APP_PLATFORM_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_PLATFORM_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_PLATFORM_APP_ID,
    measurementId: process.env.REACT_APP_PLATFORM_MEASUREMENT_ID,
  },
  cms: {
    apiKey: process.env.REACT_APP_CMS_API_KEY,
    authDomain: process.env.REACT_APP_CMS_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_CMS_PROJECT_ID,
    storageBucket: process.env.REACT_APP_CMS_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_CMS_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_CMS_APP_ID,
    measurementId: process.env.REACT_APP_CMS_MEASUREMENT_ID,
  },
};

const platformFirebase = firebase.initializeApp(firebaseConfig.platform, 'platform');
const cmsFirebase = firebase.initializeApp(firebaseConfig.cms, 'cms');

export { platformFirebase, cmsFirebase };
