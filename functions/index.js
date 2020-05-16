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

        for(var i in events){
            events[i]["isJoined"]=0
        }
        /* db.collection('participants').where('userId','==',request.body.userId).get()
         .then(snapshot => {
            for(var i in events){
                snapshot.forEach(doc =>{
                    if(events[i].eventId == doc.data().eventId){
                        events[i].isJoined = 1
                    }else{
                        events[i].isJoined = 0
                    }
                })
            }
            response.json(events);
         })
         .catch(error =>{
            response.json(error);
        })*/
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

 /**
  * Participate in a Event - Stufy Customer
  */
 exports.participateInEvent = functions.https.onRequest((request,response) =>{
     let participantRef=db.collection('participants') 
     let participateid= participantRef.doc().id

     let data = {
         participateId : participateid,
         userId : request.body.userId,
         eventId : request.body.eventId
     }

     participantRef.doc(participateid).set(data)
     .then(ref => {
         response.json("Participated Successfully!")
     })
     .catch(error => {
        response.json(error)
     })
    
 })
 
 /**
  * Get User Data
  */
 exports.getUserData = functions.https.onRequest((request,response) => {
     db.collection('users').doc(request.body.userId).get()
     .then(snapshot =>{
         console.log(snapshot.data())
         response.json(snapshot.data())
     })
     .catch(error => {
         response.json(error)
     })
 })

 /**
  * Get Events By Category
  */
 exports.getEventsByCategory = functions.https.onRequest((request,response) => {
     let events=[]
     db.collection('events').where('eventcategory','==',request.body.eventcategory).get()
     .then(snapshot => {
        snapshot.forEach(doc =>{
            events.push(doc.data())
        })
        response.json(events)
     })
     .catch(error => {
         response.json(error)
     })
 })
 

