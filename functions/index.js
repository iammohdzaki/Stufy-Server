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


 exports.getEventsByUser = functions.https.onRequest((request,response) =>{
     let events=[]

     let query= db.collection("users").where('userId','==',request.body.userId).get()
     .then(snapshot =>{
         if(snapshot.empty){
            response.json('No Data Found.');
            return;
         }

         snapshot.collection('events').get()
         .then(snapshot =>{
            if(snapshot.empty){
                response.json()
                return;
            }
            snapshot.forEach(doc =>{
                events.push(doc.data())
            })
            response.json(events)
         })
         .catch(error => {
             response.json('Something went wrong!')
         })

     })
     .catch(error=> {
         response.json(error)
     })
 })


