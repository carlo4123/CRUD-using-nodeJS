const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mysql = require('mysql')


const app =express();

//Select * From Crud
const selectAll = []

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
   database:"nodeCRUD"
  });


  //==========================================="SHOW DATABASES===START===================================================
//   const db =[]                                                                                       
// con.query("SHOW DATABASES", (err,Databases)=>{                                                         
//   if(err){
//       console.log("err "+ err)
//   }else{
      
//       Databases.forEach((database)=> {
//     db.push(database)
//       })
//   }
// })
// console.log(db)
 //============================================="SHOW DATABASES==END===================================================


  //==========================================="CREATE DATABASE===START===================================================
   // con.query("CREATE DATABASE nodeCRUD", function (err, result) {
    //   if (err) throw err;
    //   console.log("Database created");
    // });

  //=======================Checking connection in Database===========================================
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


  //===============================================show Tables=========================================================
  con.query("SHOW TABLES",(err,tables)=>{
    if(err) throw err
  if(tables ==""){
      //==========Creating Tables=====
     const creatTable = "CREATE TABLE CRUD (" +
                        "id int NOT NULL AUTO_INCREMENT," +
                        "FName VARCHAR(255) NOT NULL," +
                        "LName VARCHAR(255) NOT NULL," +
                        "email VARCHAR(255) NOT NULL," +
                        "age int(11) NOT NULL," +
                        "address VARCHAR(255) NOT NULL," +
                        "PRIMARY KEY(id)"+
                        ");"
     con.query(creatTable, function (err, result) {
       if (err) throw err;
       console.log("Table created");
     });
  }else{
      console.log(tables)
  }
 })


 
  app.get('/insert', (err,res)=>{
 
      res.render('create')
  })
  //===============================================Insert Data in Tables=========================================================
  app.post('/insert', (req,res)=>{
   
    console.log(req.body)
    const FName = req.body.FName;
    const LName = req.body.LName;
    const email = req.body.email;
    const age = req.body.age;
    const address = req.body.address;
if(FName ==="" || LName ==="" || FName ==="" || email ==="" || age ==="" || address ===""){
  console.log("dont leave a empty fields")
  res.redirect('/')
}else{
  const insert ="INSERT INTO crud(FName,LName,email,age,address) VALUES " +
  `('${FName}', '${LName}', '${email}', ${age}, '${address}')`
    con.query(insert,(err,res)=> {
        if(err) throw err
        console.log("Insert Successful")
     
    })
    res.redirect('/')
}
   
  })
//============================================================================================================================================================
const show = "SELECT * FROM crud"
con.query(show,(err,results)=>{

  results.forEach((result)=>{
    
    selectAll.push(result)
  })
})
console.log(selectAll)


app.get('/',(req,res)=>{
 
    res.render('retrieve',{shows:selectAll})
})


//Select Single rows
app.get('/edit/:id', (req,res)=>{
  const id = req.params.id
  const update = `SELECT * FROM crud WHERE id = ${id}`
 con.query(update,(err,result) => {
  res.render('update',{updates: result[0]})
 })

})

app.post('/update/:id',(req,res)=>{
const id = req.params.id
const FName = req.body.FName;
const LName = req.body.LName;
const email = req.body.email;
const age = req.body.age;
const address = req.body.address;
const update = `UPDATE crud SET FName = '${FName}',LName = '${LName}',email = '${email}',age = ${age},address = '${address}' WHERE id = ${id}`
con.query(update,(err,res)=>{
  if(err) throw err
 console.log("updated...")
})
res.redirect('/')
})

app.get('/delete/:id',(req,res)=>{
  const id = req.params.id
  const del = `DELETE FROM crud WHERE id = ${id}`
  con.query(del,(err,res)=>{
    if(err) throw err
  })
  res.redirect('/')
})

const port = 3000
  app.listen(port, (err)=>{
      if(!err){
          console.log(`you are connected in port ${port}`)
      }
  })