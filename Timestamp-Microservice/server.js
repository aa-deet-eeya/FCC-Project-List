const express = require('express') ;

const app = express() ;
const port = process.env.PORT || 3000 ;

//const LINK = `https://localhost:${port}` ;


app.get('/' , (req ,res)=>{
    res.sendFile( __dirname + '/views/index.html') ;
}) ;

app.use(express.static( __dirname +'/public/')) ;


app.get('/api/timestamp/:date_string' , (req ,res)=>{
    //console.log(new Date(parseInt(req.params.date_string))) ;
    date = new Date(parseInt(req.params.date_string)) ; 
        
    
    res.json(isDate(date)) ;
})  ;

let isDate = (date)=> {
    if(!isNaN(date.getTime())) {
        return  {
            "unix" : date.getTime() ,
            "utc" : date.toUTCString() 
        } ;
    } 
    return { "error" : "Invalid Date" } ;

}



app.listen(port, ()=>{
    console.log(`Listening to ${port}`) ;
}) ;