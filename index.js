let express = require("express")
let app = express()
let bordyParser = require("body-parser")
const session = require("express-session")
const EventEmitter = require('events');
const path = require("path")
const mysqlConnection = require("./connections")
/*GOOGGLE DRIVE VARIABLES*/
const {google} = require("googleapis")
const fs = require("fs");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const CLIENT_ID = "613550817223-dkh8f93k6snortp4i2298c9vptfoi1l4.apps.googleusercontent.com"
const CLIENT_SECRET = "u2bKm4gVrVqKQ9dN7xwB1dt5"
const REDIRECT_URL = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04Gu2L70r0qqcCgYIARAAGAQSNwF-L9Ir2Od4Z935perY-XjSjJKQuI9O1puE3ak4hXVhpzSdVcfhw-cN6sV9yKOk9wk8gK3NUBA"
const oath2Client = new google.auth.OAuth2(
CLIENT_ID,
CLIENT_SECRET,
REDIRECT_URL
)
// Use functions
app.use(express.static('static')); 
app.use("/css",express.static(__dirname+"static/css"))
app.use("/js",express.static(__dirname+"static/js"))
app.use("/img",express.static(__dirname+"static/img"))
app.use("/fonts",express.static(__dirname+"static/fonts"))
app.use(session({
    secret: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
    cookie: {maxAge:6000},
    resave: false,
    saveUninitialized:false
}))
const urlenCoded = bordyParser.urlencoded({extended: true})
app.use(bordyParser.json());

//Set html view engine
app.set("views", path.join(__dirname, "pages"));
app.set('view engine', 'ejs');
app.set('view options',{layout :false});
//::::: end view code ::::::::::

// Listen on port 
const port = process.env.PORT || 4000
app.listen(port, () => console.log('listening at  http://localhost:4000'));

/*HANDLE DB_CONNECTIONS*/
function handle_connection(func){
  mysqlConnection.getConnection((err)=>{
    if (err){
      console.log(err)
    }
    else{
      console.log("DB_CONNECTION SUCCESSFULL")
      func()
    }
  })
}

oath2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const file_path = path.join(__dirname, "pic.jpg")
const drive = google.drive({
  version:'v3',
  auth:oath2Client
})
async function upload(){
  try{
    const response = await drive.files.create({
      requestBody:{
        name:"Beautiful-Batman2.jpg"
        ,mimeType:"image/jpg",
      },
      media:{
      mimeType:"image/jpg",
      body:fs.createReadStream(file_path)
      }
    })
    console.log(response)
  }
  catch(eror){
    console.log(eror)
  }
}
//upload();
async function get_files(){
  const response = await drive.files.list({
  })
  .then(function(response) {
    // Handle the results here (response.result has the parsed body).
    var files = response.data.files;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.log(file.id+"'>"+file.name );
            }
          } else {
            console.log("No Folders found")
          }
  },
  function(err) { console.error("Execute error", err); });
}
//get_files() 
app.get("/sign/in/staff", urlenCoded,(req,res)=>{
  let staff_id = req.body.staff_id;
  let staff_password = req.body.staff_password;
  let validation = ()=>{
    let query = "SELECT * FROM staff_tb WHERE `staff_id_num` = "+staff_id+";"
    mysqlConnection.query(query,(err,rows,fields)=>{
      if (rows.length > 0)
      res.render("stff-page")
      else{
        console.log("Freak Out!")
      }
    })
  }
})

app.get("/",(req, res)=>{
  res.render("index")
})