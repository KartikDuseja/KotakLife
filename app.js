const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload= require('express-fileupload');
const bodyParser = require('body-parser');
const fs= require('fs')
var sql = require("mssql/msnodesqlv8");
const { check, validationResult } = require('express-validator');
//const client = require('twilio')('ACc578e32e7d73b023a620cc028129318e', '14cb2192542e5516c49c0332943fddd7');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const sqlite3= require('sqlite3').verbose()
// const { Pool, Client } = require('pg')
// var dbConnect = require('./dbConnect');
var qs = require("querystring");
var http = require("http");

const sgMail = require('@sendgrid/mail')

const API_KEY = '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'

sgMail.setApiKey(API_KEY)






const app= express();
const port= process.env.PORT || 5000;



// Test CODE
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE, (err)=>{
if(err)
return console.error(err.message)

console.log('Connection successful')


})


//db.run('CREATE TABLE users (UID, Name, Age, emailotp, mobileotp, image1url, image2url)');

// const sql1 = `INSERT INTO users (UID, Name, Age, emailotp) VALUES (?,?,?,?)`

// db.run(sql1, [1,'Kartik', 20, 1234], (err)=>{
// if(err)
// return console.error(err.message)

// console.log(' A new row has been created ')



// })

const sql2= `SELECT * FROM users`;

db.all(sql2, [], (err,rows)=>{

  if(err)
  return console.error(err.message)

  rows.forEach((row)=>{
    console.log(row);
  })

})


// const sql11= `ALTER TABLE users
// ADD contactno varchar(11)`


// db.run(sql11,  (err)=>{
// if(err)
// return console.error(err.message)

// console.log(' Contact field added  ')



// })





//Database configuration mssql
var dbconfig = 
{
   database:'ZINIKOTAK' ,
   server:'DESKTOP-5QI4JK0' ,
   driver: 'msnodesqlv8',
   port: 1433,
   options:
   {
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


//Static files
app.use(express.static('public'));
app.use(express.static('upload'));

//Templating engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


function generateOTP() {
          
  // Declare a digits variable 
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i <6; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}




// POST REQUEST FOR EMAIL OTP FROM FRONTEND ( GENERATION AND SAVING IN DATABASE)
app.post('/emailotp',urlencodedParser, (req,res)=>{

 
var emaotp = generateOTP()

const message = {

  to : req.body.email,
  from: 'dusejakartik00@gmail.com',
  subject: 'Hello from KotakLife ',
  text: 'OTP for your email verification is ' + emaotp
  // html: '<h1>Hello from Grainpad</h1>'

}

sgMail.send(message)
.then((response) => console.log('Email sent'))


const sql6= `UPDATE users SET emailotp = ? WHERE UID = ?`;

db.run(sql6, [emaotp, req.body.uid], (err)=>{
if(err)
return console.error(err.message)

res.send({
           'success': true
      })

console.log('Email otp stored correctly ')


})


  // var request = new sql.Request();
  // // "insert into ZiniKotak (UID,Name, Age, Gender, Email, contactno) values ('"+req.body.uid+"','"+req.body.name+"' , '"+req.body.ages+"' ,'"+req.body.gen+"', '"+req.body.email+"', '"+req.body.phoneno+"'
  //  // query to the database and get the records
   
   
  //  request.query("update ZiniKotak SET emailotp = '"+emaotp+"' where UID='"+req.body.uid+"'", function (err, recordset) {
       
  //      if (err) console.log(err)

  //      res.send({
  //          'success': true
  //      })
  //      // send records as a response
  //     // console.log(recordset);
       
  //  });

})


// POST REQUEST FOR MOBILE OTP FROM FRONTEND ( GENERATION AND SAVING IN DATABASE)
app.post('/mobileotp', urlencodedParser,(req,res)=>{

    var mobileotp= generateOTP()
   
 //   location.href="chat.html"+"?uuid=" + uuid + "&name=" + naam +"&email=" + email;

    var options = {
      "method": "GET",
      "hostname": "2factor.in",
      "port": null,
      "path": "/API/V1/cd741301-16ca-11e8-a895-0200cd936042/SMS/"+req.body.phoneno+"/"+mobileotp,
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      }
    };

    
    var req1 = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });
    
    req1.write(qs.stringify({}));
    req1.end();
    
    const sql7= `UPDATE users SET mobileotp = ? WHERE UID = ?`;

    db.run(sql7, [mobileotp, req.body.uid], (err)=>{
      if(err)
      return console.error(err.message)
      
      res.send({
                 'success': true
            })
      
      console.log('Mobile otp stored correctly ')
      
      
      })
     // SAVING MOBILE OTP IN DATABASE
    // var request = new sql.Request();
  
    //  // Query to save mobile OTP in database 
    //  request.query("update ZiniKotak SET mobileotp = '"+mobileotp+"' where UID='"+req.body.uid+"'", function (err, recordset) {
         
    //      if (err) console.log(err)
  
    //      res.send({
    //          'success': true
    //      })
    //      // send records as a response
    //     // console.log(recordset);
         
    //  });
  
})



// FORM REGISTER POST REQUEST ( DATA SAVING IN DATABASE + EMAIL AND MOBILE VALIDATION CHECK)

//Form Res in Json format Next stop to insert in database ? 
app.post('/register', urlencodedParser,  (req,res)=>{


let sql9= `SELECT emailotp,mobileotp from users where UID=?`;

db.all(sql9, [req.body.uid], (err,rows)=>{

  if(err)
  return console.log(err.message)

  rows.forEach((row=>{

    if (row.emailotp !== req.body.emailotp || row.mobileotp !== req.body.mobileotp )
     {
             res.send({
                'success': false
            })
            return
     }

     else
     {
         

      const sql10= `UPDATE users SET Name = ?, Age=?, Email=?, contactno=? WHERE UID = ?`;

      db.run(sql10, [req.body.name, req.body.ages, req.body.email, req.body.phoneno, req.body.uid], (err)=>{
        if(err)
          return console.error(err.message)

          res.send({
           'success': true
             })

              console.log('Name and Age stored successfully  ')


})

     }
  }))
})



    // res.json(req.body)
  //   var request = new sql.Request();
      
  //   request.query( "select emailotp,mobileotp from ZiniKotak where UID='"+req.body.uid+"'", function (err, recordset) {
        
  //    console.log(recordset)
    
  //     if (err) console.log(err)
       
  //     if (recordset.recordset[0].emailotp !== req.body.emailotp || recordset.recordset[0].mobileotp !== req.body.mobileotp )
  //    {
  //             res.send({
  //               'success': false
  //             })
  //             return
  //    }

  //    else
  //     {
       
  //       request.query("update ZiniKotak SET Name = '"+req.body.name+"', Age= '"+req.body.ages+"', Gender='"+req.body.gen+"', Email= '"+req.body.email+"', contactno = '"+req.body.phoneno+"' where UID='"+req.body.uid+"'", function (err, recordset) {
        
  //         if (err) console.log(err)
  
  //         res.send({
  //             'success': true
  //         })
  //         // send records as a response
  //        // console.log(recordset);
          
  //     });
  
           
  //    }
     
  //     // send records as a response
  //    // console.log(recordset);
      
  // });


   // "insert into ZiniKotak (UID,Name, Age, Gender, Email, contactno) values ('"+req.body.uid+"','"+req.body.name+"' , '"+req.body.ages+"' ,'"+req.body.gen+"', '"+req.body.email+"', '"+req.body.phoneno+"'
    // query to the database and get the records

    
      

  
       
   
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


const sql4 = `INSERT INTO users (UID, image1url) VALUES (?,?)`

 db.run(sql4, [req.body.uid, req.file.filename], (err)=>{
 if(err)
 return console.error(err.message)

 console.log(' Aadhar details updated via sqlite ')



 })

  // var request = new sql.Request();
       
  // // query to the database and get the records
  // request.query("insert into ZiniKotak (UID,image1url) values ('"+req.body.uid+"','"+req.file.filename+"' )", function (err, recordset) {
      
  //     if (err) console.log(err)
  
  
  //   })
  
res.send
  ({
    'success': true
})
 
})
  // Post for Pan pic 

  app.post('/pan',upload.single('sampleFile1'),(req,res)=>{
  
    console.log(req.file)
    console.log(req.body)


    const sql5= `UPDATE users SET image2url = ? WHERE UID = ?`;

db.run(sql5, [req.file.filename, req.body.uid], (err)=>{
if(err)
return console.error(err.message)

console.log(' Pan details updated via sqlite')


})


  
  //   var request = new sql.Request();
       
  // // query to the database and get the records
  // request.query("update ZiniKotak SET image2url= '"+req.file.filename+"' WHERE UID ='"+req.body.uid+"'", function (err, recordset) {
      
  //     if (err) console.log(err)
  
  
  //   }) 

    res.send({
      'success': true
  })
   
  })
 

 
  
 

app.listen(port,()=>
{
console.log('Listening on port ' + port);
})