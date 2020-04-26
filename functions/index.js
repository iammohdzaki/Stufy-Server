const functions = require('firebase-functions');
const CONFIG = require('./config/config');
const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

/**
 * Returns All Events Data - Stufy Customer
 */
 exports.getEvents = functions.https.onRequest((request, response) => {

    let events=[]

     db.collection('events')
     .get()
     .then(snapshot =>{
         snapshot.forEach(doc =>{
                events.push(doc.data())
         })
         response.json(events);
     })
     .catch(error =>{
         response.json(error);
     })
 });


 /**
  * Returns Events By User ID - Manager App
  */
 exports.getEventsByUser = functions.https.onRequest((request,response) =>{
     let events=[]

     console.log(request.body.userId)

     db.collection('events').where('userId','==',request.body.userId).get()
     .then(snapshot =>{
         snapshot.forEach(doc =>{
             events.push(doc.data())
         })
         response.json(events)
     })
     .catch(error=> {
        response.json(error)
    })
 })


