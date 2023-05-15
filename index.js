import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is working");
});





























// import express from "express";
// import path from 'path'

// const app = express()

// // Using Middle Ware
// app.use(express.static(path.join(path.resolve(),"public")))

// // Middle Ware for post mathod(to acess data from form page)
// // app.use(express.json())

// app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser())
// //For STATIC Server
// // console.log(path.join(path.resolve(),"./public"))
// // express.static(path.join(path.resolve(),"public"))


// app.set('view engine' , 'ejs' );

// // FOR DYNAMIC DATA
// // app.get("/",(req,res)=>{
// //     res.render("index.ejs",{name:"Umesh"})
// // })


// // -------------------------------------DataBase------------------------------------------------------------------------------//
// import Jwt from "jsonwebtoken";

// import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// mongoose.connect("mongodb://127.0.0.1:27017",{dbName:"backend2"}).then(console.log("Dbconnect Shree Hare Radhe")).catch((e)=>console.log(e));

// const userSchema = new mongoose.Schema({ name:String,email:String , password:String}) 

// const User = mongoose.model("User",userSchema);

// // ---------------------------------MiddleWare Function(for protected route)--------------------------------------------------//

// const isAuthenticated = ( req , res , next )=>{
//     const { umesh } = req.cookies;
//     if(umesh){
//         next()
//     }else{
//         res.redirect("/login")
//     }
// }

// // ------------------------------------------------------------------------------------------------------------------------//


// app.get("/",isAuthenticated,(req,res)=>{
//     // res.render("logout")
//     res.render("logout" , { name:  req.user.name })
// })

// app.get("/login",(req,res)=>{
//     res.render("login" )
// })



// app.get("/register" , (req,res) => {
//     res.render("register")
// })


// app.post("/login"  , async(req,res)=>{
//     const { email , password } = req.body

//     let user = await User.findOne({ email });

//     if(!user) return res.redirect("/register")

//     const isMatch = user.password === password;
    
//     if(!isMatch) return res.render("login" , { email, message: "Incorrect password" } )

//     const token = Jwt.sign({_id:user._id},"abababa");

//     res.cookie("token" , token , {
//         httpOnly:true,
//         expires: new Date(Date.now() + 60 * 1000 ),
//     })
//     res.redirect("/")
// })


// app.post("/register",async(req,res)=>{
//     const { name , email , password } = req.body
  
//     let user = await User.findOne({email});

//     if(user)
//     {
//         return res.redirect("/login")
//     }
  
//        user = await User.create({name , email , password})
  
//     const token = Jwt.sign({ _id: user._id } , "abcdabcd");

//     // res.cookie("umesh" ,  user._id ,{httpOnly:true , expires: new Date(Date.now() + 60 * 1000), } );   //hum user ke id aesa nhe de sakte for safety purpose
//     res.cookie("token" ,  token ,{httpOnly:true , expires: new Date(Date.now() + 60 * 1000), } );  
//     res.redirect("/");
// })


// app.get("/logout",(req,res)=>{
//     res.cookie("token" , null , {httpOnly:true ,  expires: new Date(Date.now())})
//     res.redirect("/")
// })


// app.listen(5000,()=>{console.log("Shree Hare RADHE")})


// // -------------------------------------------------------------------------------------------------------------------------//
// // -------------------------------------------------------------------------------------------------------------------------//

// // app.get("/add",async(req,res)=>{
// //     await Messge.create({name:"Umesh2" , email:"umesh72dixit@gmail.com"})
// //         res.send("Nice")
// // })
