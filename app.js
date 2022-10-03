const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload= require('express-fileupload');
const bodyParser = require('body-parser');
const fs= require('fs')
var sql = require("mssql/msnodesqlv8");
const { check, validationResult } = require('express-validator');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
//const uploadss= multer({dest:'ssuploads/'})

// var dbConnect = require('./dbConnect');




const app= express();
const port= process.env.PORT || 5000;



//Database configuration mssql
var dbconfig = 
{
   database:'ZINIKOTAK' ,
   server:'DESKTOP-5QI4JK0' ,
   driver: 'msnodesqlv8',
   port: 1433,
   options:{
      trustedConnection:true
   }
};


//Code to connect to mssql database
var dbConnect = new sql.connect(dbconfig,
  function(err)
  {
    
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
    request.query('select * from ZiniKotak', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        
        
    });
});






//configuring the body-parser middleware
//app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


const urlencodedParser = bodyParser.urlencoded({extended: false})
//default option
//app.use(fileUpload());

//Static files
app.use(express.static('public'));
app.use(express.static('upload'));

//Templating engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');



//Form Res in Json format Next stop to insert in database ? 
app.post('/register', urlencodedParser,  (req,res)=>{
    // res.json(req.body)
   

   //console.log(req.body.naam)
    //console.log(req.body.email)
    //console.log(req.body.Gender)
    //console.log(req.body.contact)
   
    
    var request = new sql.Request();
   // "insert into ZiniKotak (UID,Name, Age, Gender, Email, contactno) values ('"+req.body.uid+"','"+req.body.name+"' , '"+req.body.ages+"' ,'"+req.body.gen+"', '"+req.body.email+"', '"+req.body.phoneno+"'
    // query to the database and get the records
    request.query("update ZiniKotak SET Name = '"+req.body.name+"', Age= '"+req.body.ages+"', Gender='"+req.body.gen+"', Email= '"+req.body.email+"', contactno = '"+req.body.phoneno+"' where UID='"+req.body.uid+"'", function (err, recordset) {
        
        if (err) console.log(err)

        res.send({
            'success': true
        })
        // send records as a response
       // console.log(recordset);
        
    });

      

  
       
   
});
    

    // Route for Video save 
    // app.post('/ssSave',(req,res)=>{
    //   console.log(req.body)
    //   console.log(req.file)
    //   const outVideo = fs.createWriteStream( "videos/some-video.mp4" ); 
      
    //   // Do whatever and when you have enough data to save, then 
       
    //   outVideo.write( ssimage, "binary" ); 
       
    //   // And when you're finally done 
  
    //   outVideo.end(); 

    // })









  
//Post for aadhar pic
app.post('/aadhar',upload.single('sampleFile'),(req,res)=>{
  
  console.log(req.file)
  console.log(req.body)

  var request = new sql.Request();
       
  // query to the database and get the records
  request.query("insert into ZiniKotak (UID,image1url) values ('"+req.body.uid+"','"+req.file.filename+"' )", function (err, recordset) {
      
      if (err) console.log(err)
  
  
    })
  
  res.send
  ({
    'success': true
})
 
})
  // Post for Pan pic 

  app.post('/pan',upload.single('sampleFile1'),(req,res)=>{
  
    console.log(req.file)
    console.log(req.body)
  
    var request = new sql.Request();
       
  // query to the database and get the records
  request.query("update ZiniKotak SET image2url= '"+req.file.filename+"' WHERE UID ='"+req.body.uid+"'", function (err, recordset) {
      
      if (err) console.log(err)
  
  
    }) 

    res.send({
      'success': true
  })
   
  })
 

  // app.post('/ssSave',uploadss.single('image1'),(req,res)=>{
  
  //   console.log(req.file)
          
  
     
  //   res.send({
  //     'success': true
  // })
   
  // })

app.listen(port,()=>
{
console.log('Listening on port ' + port);
})

