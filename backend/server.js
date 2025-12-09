const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const salt = 10;

const app = express();

// Middleware
app.use(express.json());
app.use(cors(
    {
        origin: ['http://localhost:5173'],  // Your Vite frontend
        methods: ['GET','POST'],
        credentials: true
    }
));
app.use(cookieParser());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vamshi3405$",   // your password
  database: "signup"
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

db.on('error', (err) => {
  console.error('Database error:', err.message);
});

// Simple test route
//app.get('/test', (req, res) => {
  //console.log('✅ /test route hit');
  //res.json({ message: 'Backend is working' });
//});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not valid" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
});


// REGISTER ROUTE
app.post('/register', (req, res) => {
  console.log('Register route called with body:', req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ Error: "Name, email, and password are required" });
  }

  const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?, ?, ?)";

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ Error: "Error hashing password" });
    }

    // ⚠ IMPORTANT: pass [name, email, hash], NOT [values]
    db.query(sql, [name, email, hash], (err, result) => {
      if (err) {
        console.error("MySQL insert error:", err);
        return res.status(500).json({ Error: "Inserting data error in server" });
      }

      console.log("✅ User inserted with id:", result.insertId);
      return res.json({ Status: "User Registered Successfully" });
    });
  });
});

// LOGIN ROUTE
app.post('/login',(req,res) =>{
    const sql ='SELECT * FROM login WHERE email=?';
    db.query(sql,[req.body.email],(err,data) =>{
        if(err) return res.json({Error:"Login error in server"});
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString(),data[0].password,(err,response) =>{
                if(err) return res.json({Error:"Password compare error"});
                if(response){

                    const name =data[0].name;
                    const token=jwt.sign({name},"jwt-secret-key",{expiresIn:'1h'});
                    res.cookie('token',token);
                    
                    return res.json({Status:"Login Successful"});

                } else{
                    return res.json({Error:"Incorrect password"});  
                }
            })
        } else{
             return res.json({Error: "no emial existed"});
        }
        
    })
})

app.get('/logout',(req,res) =>{
    res.clearCookie('token');
    return res.json({Status:"Successfully logged out"});
});


// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
