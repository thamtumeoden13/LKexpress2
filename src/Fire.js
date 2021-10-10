// import firebase from 'firebase'

// class Fire {
//     constructor() {
//         this.init()
//         this.checkAuth()
//     }
//     init = () => {
//         if (!firebase.apps.length) {
//             firebase.initializeApp({
//                 apiKey: "AIzaSyDmbDakL-e3D9jykt1155QvGFnxR5DhXfk",
//                 authDomain: "video-call-lk-express.firebaseapp.com",
//                 databaseURL: "https://video-call-lk-express-default-rtdb.firebaseio.com",
//                 projectId: "video-call-lk-express",
//                 storageBucket: "video-call-lk-express.appspot.com",
//                 messagingSenderId: "1089649462423",
//                 appId: "1:1089649462423:web:c3309a52a19c3c406eedd2"
//             })
//         }
//     }
//     checkAuth = () => {
//         firebase.auth().onAuthStateChanged(user => {
//             if (!user) {
//                 firebase.auth().signInAnonymously();
//             }
//         })
//     }

//     parse = message => {
//         const { user, text, timestamp } = message.val()
//         const { key: _id } = message
//         const createdAt = new Date(timestamp)

//         return {
//             _id,
//             createdAt,
//             text,
//             user
//         }
//     }

//     get = callback => {
//         this.db.on('child_added', snapshot => callback(this.parse(snapshot)))
//     }

//     off = () => {
//         this.db.off()
//     }

//     send = messages => {
//         messages.forEach(element => {
//             const message = {
//                 text: element.text,
//                 timestamp: firebase.database.ServerValue.TIMESTAMP,
//                 user: element.user
//             };
//             this.db.push(message)
//         });
//     }

//     get db() {
//         return firebase.database().ref('messages')
//     }
    
//     get uid (){
//         return(firebase.auth().currentUser ||{}).uid
//     }
// }

// export default new Fire()