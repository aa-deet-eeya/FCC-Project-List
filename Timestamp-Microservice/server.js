const express = require('express') ;

const app = express() ;
const port = process.env.PORT || 3000 ;

//const LINK = `https://localhost:${port}` ;


app.get('/' , (req ,res)=>{
    res.sendFile( __dirname + '/views/index.html') ;
}) ;

app.use(express.static( __dirname +'/public/')) ;


app.get('/api/timestamp/', (req , res)=> {
    const d = new Date() ;
    res.json({
      "unix" : parseInt(d.getTime()) ,
      "utc" : d.toUTCString() 
    }) ;
  }) ;
  
  
  app.get('/api/timestamp/:date_string' , (req ,res)=>{
      //console.log(new Date(parseInt(req.params.date_string))) ;
    
      const date = new Date((req.params.date_string)) ; 
      const dateString = req.params.date_string ;
      if (/\d{5,}/.test(dateString)) {
      const dateInt = parseInt(dateString);
      
      res.json({ unix: dateString, utc: new Date(dateInt).toUTCString() });
    }    
      
      res.json(isDate(date)) ;
  })  ;
  
  let isDate = (date)=> {
      
      if(!isNaN(date.getTime())) {
          return  {
              "unix" : (date.getTime().valueOf()) ,
              "utc" : date.toUTCString() 
          } ;
      } 
      return { "error" : "Invalid Date" } ;
  
  }
  



app.listen(port, ()=>{
    console.log(`Listening to ${port}`) ;
}) ;