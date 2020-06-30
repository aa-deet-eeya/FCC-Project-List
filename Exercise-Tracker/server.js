const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

////////////////////////////////////////////
//                Start                   //
//                                        //
////////////////////////////////////////////


app.get('/api/hello' , (req, res)=>{
  res.json({msg : 'Hello world'}) ;
}) ;

/* const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost/exercise-track",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Schema = mongoose.Schema;

const exercises = new Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  username: String,
  userId: {
    type: String,
    ref: "Users",
    index: true
  }
});

const users = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
}); 

const userA = mongoose.model('Users' , users) ;
//const users = require('./mongoose.js') ;
//const exercises = require('./mongoose.js') ;
*/

const users = [] ;
const exe = [] ;

const findUser = userId=> users.find(u=> u._id === userId).username ;

////////////////////////////////
//        1st Procers         //
//                            //
////////////////////////////////

const shortid = require('shortid') ;

app.post("/api/exercise/new-user", (req, res) => {
  
  //res.json(users(req.body)) ;
/*  const userB = new userA(req.body);
  
  userB.save((err, data) => {    
    if (err)  res.json(err);    
    res.json({ 
      username: data.username,
      _id: data._id
    });
  }); */
  
  
  const { username } = req.body ;
  
  const newUser = {
    username ,
    _id : shortid.generate()
  } ;
  
  users.push(newUser) ;
  res.json(newUser) ;
  
  
  
  
});


////////////////////////////////
//     Searching Process      //
//                            //
////////////////////////////////


app.get("/api/exercise/users", (req, res) => {
//  users.find({}, (err, data) => {
//    res.json(data)
//  })
    
  return res.json(users) ;
});

app.post("/api/exercise/add" , (req ,res)=>{
  
  const {userId , duration, description, date } = req.body ;
  const formattDate = date=== '' ? new Date().toString() : new Date(date).toString() ;
  
  
  const newExe = {
    _id : userId ,
    
    description : description ,
    duration: +duration,
    date : formattDate.slice(0,15) ,
    username : findUser(userId) 
  } ;
  
  exe.push(newExe) ;
  res.json(newExe) ;
}) ;


const findExe = userId=> exe.filter(e => e._id === userId) ;



app.get("/api/exercise/log", (req, res) => {
  const { userId, from, to, limit } = req.query;
  let log = findExe(userId);
  
  if (from) {
    const fromDate = new Date(from);
    log = log.filter( e => new Date(e.date) >= fromDate);
  }
  
  if (to) {
    const toDate = new Date(to);
    log = log.filter( e => new Date(e.date) <= toDate);
  }
  
  if (limit) {
    log = log.slice(0, +limit);
  }
  
  res.json({
    userId,
    username: findUser(userId),
    count: log.length,
    log
  });
});

 






// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware

app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
