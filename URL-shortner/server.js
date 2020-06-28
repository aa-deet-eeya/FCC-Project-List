'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


mongoose.connect( process.env.MONGO_URI , {
  useNewUrlParser  : true ,
  useUnifiedTopology : true ,
  serverSelectionTimeoutMS : 10000
  
} ) ;

const connection = mongoose.connection ;
connection.on('error' , ()=>{console.log("error")}) ;
connection.once('open' , ()=>{
  console.log("DB connection established") ;
}) ;

const Schema = mongoose.Schema ;
const urlSchema = new Schema({
  original_url : String ,
  short_url : String
  
}) ;

const URL = mongoose.model("URL" , urlSchema) ;

const dns = require('dns') ;
let checkURL = (url, done)=>{
  dns.lookup(url, (err)=>{
    return done(err) ;
  } )
};  


//let findOne = (url)=> {
//  return URL.findOne({ original_url : url }) ;
//}
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


const crypto = require('crypto') ;
app.post('/api/shorturl/new' , (req ,res)=>{
  
  const url = req.body.url_input ;
  const shortid = crypto.createHash('md5').update(url).digest('hex').slice(0,4) ;
  
  checkURL(url, (err)=>{
    if(!err) {
      res.json({
        error : "invalid URL"
      }) ;
    } else {
      //findOne( url, (err , data)=>{
      //if(err) res.json({error : "DB error"}) ;
      //res.json({})
      //} ) ;
      async ()=>{
        try{
        let data = await URL.findOne({ original_url : url }) ;
        if(data) {
          res.json({
            original_url : data.original_url ,
            short_url : data.short_url
          }) ;
          
        } else {
          
          data = new URL({
            original_url : url ,
            short_url : shortid
          }) 
          
        }
      } catch(err) {
        console.log(err) ;
        res.json({error : "server error"}) ;
      }} ;
      
    }
    
  
      
  }) ;
  
}) ;


app.get('/api/shorturl/:short_url?', async(req ,res)=>{
  try {
    
    const url = await URL.findOne({short_url : req.params.short_url}) ;
    
    if(url) {
      return res.redirect(url.original_url) ;
    } else {
      return res.json("No URL found") ;
    }
    
    
  } catch(err){
    console.log(err) ;
    res.send({error : 'Server Error'}) ;
  }
}) ;


app.listen(port, function () {
  console.log('Node.js listening ...');
});