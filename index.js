const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const ejs = require("ejs")
const RegisterModel = require("./models/registeration")
const bodyparser = require("body-parser")
const LocalStorage = require("node-localstorage").LocalStorage
localStorage = new LocalStorage("./scratch")
const cookieparser = require('cookie-parser')
const buspass = require("./models/buspass")
const AdminModel = require("./models/admin")
const DriverModel = require("./models/driver");
const driver = require("./models/driver");

const path = require('path');
const { log } = require("console");
const PUBLISHABLE_KEY = "pk_test_51NFcmVSAENnCKuBnfq64tOcj0zJYsuG6msuggCnIwokaZar1anazRhxRpPlQBJqubIOJn65vfeAMNWf9bcBXCpGb00j63R3Qfg"
const SECRET_KEY = "sk_test_51NFcmVSAENnCKuBnASnN7ChaRFKeYlqv9CmYkTSOSAW9jNgcfLx2uz2wXASF2ckDa02VEp9BNrlxjA5EM53c4Pzc005mMvi14M"

const stripe = require('stripe')(SECRET_KEY)


mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://prempk7172:ggci3jXCQZKcjcBU@cluster0.t3aocj0.mongodb.net/")
    .then((data) => {
        console.log("Database connected")
    })
    .catch((err) => {
        console.log(err)
    })


app = express();
//temporaray for stripe
app.use(bodyparser.json());
app.use(cookieparser());
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    var k = req.cookies.Userstatus;
    var l = 1;
    res.render("home", { main: k, l: l });
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/driverdetails", (req, res) => {
    DriverModel.find({})
    .then((data)=>{
        if(data){
    res.render("dridet",{data:data})
        }
        else{
            res.render("drivererror")
        }
       
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/contact", (req, res) => {
    var k = req.cookies.Userstatus;

    res.render("contact", { main: k })
})

app.get("/team", (req, res) => {
    var k = req.cookies.Userstatus;
    res.render("team",{main:k})
})

app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/logout", (req, res) => {
    var k = req.cookies.Userstatus;
    localStorage.removeItem(k);
    res.clearCookie("User status");
    res.redirect('/')
})
app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/sturegis", (req, res) => {
    res.render("sturegister")
})



app.get("/studentlogin", (req, res) => {
    res.render("stulogin")
})



app.get("/adminlogin", (req, res) => {
    res.render("adminlogin")
})



app.get("/busregister", (req, res) => {
    var q=1;
    res.render("BusRegistration",{q:q})
}
)

// renweal form
app.get("/Renewal", (req, res) => {
    res.render("renewalForm")
})

// alert
app.get("/alert", (req, res) => {
    var k = req.cookies.Userstatus;
    var l = 0;
    res.render("home", { main: k, l: l })
})

app.get("/adminpanel",(req,res)=>{
    var l=0;
    res.render("admindashboard",{l:l})
})

app.get("/addriver",(req,res)=>{
    res.render("newdriver")
})

app.get("/viewdriverdetails",(req,res)=>{
     DriverModel.find({})
    .then((data)=>{
        if(data){
            
            
        res.render("admindriverview",{data:data})
        }
        else{
            res.write("<div style='margin:auto; align-items:center;margin-top:50px;width:24%;height:15%;padding:10px;'><h1 style='margin-top:4px'>Driver Details not Found<br><a href='/adminpanel'>Back to Dashboard</a></h1></div>")
        }
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

app.get("/viewprofile",(req,res)=>{
    res.render("userprofile")
})


app.post("/studentreg", async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPsw = await bcrypt.hash(password, 12);
    const student = new RegisterModel({
        username: username,
        email: email,
        password: hashedPsw
    });
    RegisterModel.findOne({ email: email })
        .then((data) => {
            try {
                if (data) {
                    res.redirect("/studentlogin")
                }
                else {
                    student.save()
                    res.redirect("/studentlogin")
                }
            }
            catch {
                console.log(err);
            }
        })

})

app.post("/studentlog", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const student = await RegisterModel.findOne({ email: email })

    if (!student) {
        res.redirect("/sturegis")
    } else {
        const isMatch = await bcrypt.compare(password, student.password)
        if (!isMatch) {
            res.render("notfound")
        }
        else {
            res.cookie("Userstatus", email)
            localStorage.setItem(email, JSON.stringify(student))
            res.redirect("/")
        }
    }
})

app.post("/registersucess", async (req, res) => {

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const year = req.body.year;
    const branch = req.body.branch;
    const rollno = req.body.rollno;
    const busno = req.body.busno;
    const phno = req.body.phno;
    const address = req.body.address;
    const date = req.body.date;
    const route = req.body.route;




    const student = new buspass({
        fname: fname,
        lname: lname,
        year: year,
        branch: branch,
        email: email,
        route: route,
        rollno: rollno,
        busno: busno,
        phno: phno,
        address: address,
        datevalid: date
    });


    buspass.findOne({ rollno: rollno }).then((data) => {

        if (data) {
            res.redirect("/renewal")
        }
        else {
            student.save()
            res.redirect("paymentForm")
        }
    })

})


app.post("/passrenewal", async (req, res) => {
    const rollno = req.body.rollno;
    buspass.findOne({ rollno: rollno }).then((data) => {
        if (data) {
            var q = data.datevalid;
            
            q=q.toString();
            var w = q.substring(4,8);
            w=Number(w)+1
            w=w.toString();
            
            var r = q.substring(0,4) + w
            res.render("renewalPass", { data: data ,q:r})
        }
        else {
            res.redirect("/busregister")
        }
    })
})

app.post("/renewal/:rollno", async (req, res) => {

    const rollno = req.params.rollno;

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const year = req.body.year;
    const branch = req.body.branch;

    const busno = req.body.busno;
    const phno = req.body.phno;
    const address = req.body.address;
    const date = req.body.date;
    const route = req.body.route;

    const student = await buspass.findOne({ rollno: rollno })
    student.fname = fname;
    student.lname = lname;
    student.email = email;
    student.year = year;
    student.branch = branch;
    student.busno = busno;
    student.phno = phno;
    student.address = address;
    student.route = route;
    student.datevalid = date;

    student.save();
    res.redirect("/paymentForm")

})

app.post("/administratorData",(req,res)=>{
    const {mail,password} = req.body;
    AdminModel.findOne({mail:mail,password:password})
    .then((data)=>{
        if(data){
        return res.redirect("/adminpanel")
        }
        else{
            return res.render("adminnotfound")
        }
    })
   
app.post("/createdriver",(req,res)=>{
    const {id,photo,name,phone,busno,route}=req.body;
    DriverModel.findOne({busno:busno})
    .then((data)=>{
        if(data){
            res.write("data exists")
        }
        else{
            
            const driver = new DriverModel({
                id:id,
                photo:photo,
                name:name,
                phone:phone,
                busno:busno,
                route:route
            });

            driver.save()
            var l=1
            res.render("admindashboard",{l:l})
        }
    })
    .catch((err)=>{
        console.log(err)
    })
})
   
   
})

app.post("/deldriver/:driverId",async(req,res)=>{
    try{
       const deleted = await DriverModel.findByIdAndRemove(req.params.driverId);
        res.redirect("/viewdriverdetails")
    }
    catch(err){
        res.json({ message: err });
    
    }
})

app.post("/updriver/:driverId",async(req,res)=>{
    try{
       const driver = await DriverModel.findById(req.params.driverId);
       res.render("upformdriver",{data:driver})

    }catch(err){
        res.json({ message: err });
    }
})

app.post("/upnextdriver/:driverId",async(req,res)=>{
    const {id,photo,name,phone,busno,route} = req.body;
    try{
   const driver = await DriverModel.findByIdAndUpdate(req.params.driverId,{
    id,
    photo,
    name,
    phone,
    busno,
    route
   });
   if(!driver){
    res.write("Data Not Found")
   }
   
   driver= await driver.save();
   res.redirect("/viewdriverdetails")
}catch(err){
    res.redirect("/viewdriverdetails")
}
   

})


app.get("/drivernot",(req,res)=>{
    return res.render("drivererror")
})


// payments

app.get("/paymentForm",(req,res)=>{
    res.render("payment",{key:PUBLISHABLE_KEY})
})

app.post("/payment",(req,res)=>{
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'E-Bus',
        address:{
            line1:'TC 9/4 Old MES colony',
            postal_code:'452331',
            city:'Indore',
            state:'Madhya Pradesh',
            country:'India',
        }
    }).then
    ((customer)=>stripe.charges.create({
        amount:1800000,
        description:'E-Bus Pass',
        currency:'inr',
        customer:customer.id
    })).then((charge)=>res.send("success"))
    .catch((err)=>{
        
        res.render("PaymentSucess")
    })
})


app.get("/viewRegistrations",(req,res)=>{
    
    buspass.find()
    .then((data)=>{
        console.log(data)
        res.render("viewRegistrations",{data:data})
    })
})

// bus pass
app.get("/pass",(req,res)=>{
    res.render("BusPass")
})

// downloading Bus Pass
app.post("/downloadPass",(req,res)=>{

    var rollno = req.body.rollno;
    buspass.findOne({rollno:rollno})
    
    .then((data)=>{
        console.log(data);
        if(!data){
            var q=0;
            return res.render("BusRegistration",{q:q})
           
        }
        if(data.isAvailable==false || data.isAvailable == null){
            return res.send("<html><body><p>Your Bus Pass is not verified by Admin / Management!!!</p><a href='/'>Back to Home</a></body></html>")
        }

        res.render("BusPass",{data:data})
    })
})

///admin panel

// accept and reject Bus Passes
app.post("/accept/:rollno",async(req,res)=>{
    buspass.findByIdAndUpdate(req.params.rollno,{
        isAvailable:true
    })
    .then((data)=>{
        res.redirect("/viewRegistrations")
    })
    
})

app.post("/reject/:rollno",async(req,res)=>{
   
    buspass.findByIdAndRemove(req.params.rollno)
    .then((data)=>{
        res.redirect("/viewRegistrations")
    })
})

app.listen(5000, () => {
    console.log("Listening on 5000");
}
);