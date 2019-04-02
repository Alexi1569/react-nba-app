import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCMBv5v_2dDMHAQt8BvkD3InYtloYYKrRk",
  authDomain: "nba-full-11b48.firebaseapp.com",
  databaseURL: "https://nba-full-11b48.firebaseio.com",
  projectId: "nba-full-11b48",
  storageBucket: "nba-full-11b48.appspot.com",
  messagingSenderId: "888286967833"
};

firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseArticles = firebaseDB.ref('articles');
const firebaseTeams = firebaseDB.ref('teams');
const firebaseVideos = firebaseDB.ref('videos');

const firebaseLooper = (snapshot) => {
  const data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key,
    });
  });

  return data;
}

export {
  firebase,
  firebaseDB,
  firebaseArticles,
  firebaseTeams,
  firebaseVideos,
  firebaseLooper
};