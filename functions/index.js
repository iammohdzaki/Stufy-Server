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

     console.log(request.body.userId)
     db.collection("users").doc(request.body.userId).get()
     .then(snapshot =>{
         if(!snapshot.exists){
            response.json(CONFIG.defaultErrorJSON);
            return;
         }else{
            db.collection('users').doc(request.body.userId).collection('events').get()
            .then(snapshot =>{
               if(snapshot.empty){
                   response.json({
                       statusCode: 400,
                       message: "No data Found!"
                    })
                   return;
               }
               snapshot.forEach(doc =>{
                   events.push(doc.data())
               })
               response.json(events)
            })
            .catch(error => {
                response.json(CONFIG.defaultErrorJSON)
            })
         }

     })
     .catch(error=> {
         response.json(error)
     })
 })


