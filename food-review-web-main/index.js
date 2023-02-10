import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express()
const saltRounds = 10
app.use(express.json())

app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3000/register","http://localhost:3000/login", "http://localhost:3000/reviews/:restaurant_id", "http://localhost:3000/restaurant/:restaurant_id","http://localhost:3000/userReview/:account_id"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
key: "userId",
secret: "cdev_assignment",
resave: false,
saveUninitialized: false,
cookie: {
expires: 60 * 60 * 60 * 24,
},
}));

const db = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'cdev',
    database: 'cdev_assignment'

});



app.get("/", (req,res)=>{
    const sql1 = "SELECT * FROM cdev_assignment.restaurant ORDER BY RAND() LIMIT 6";
    const sql2 = "SELECT * FROM cdev_assignment.news ORDER BY RAND() LIMIT 3";
    const sql3 = "SELECT * FROM cdev_assignment.trending ORDER BY RAND() LIMIT 2";
    db.query(sql1,(err,data)=>{
        if(err) return res.json(err)
        let restaurantData = data;
        db.query(sql2,(err,newData)=>{
            if(err) return res.json(err)
            db.query(sql3,(err,trendingData)=>{
                if(err) return res.json(err)
                return res.json({restaurantData, newsData:newData, trendingData:trendingData})
            });
        });       
  });
})
  app.get("/restaurant/:restaurant_id", (req, res) => {
    const sql1 = "SELECT * FROM cdev_assignment.restaurant WHERE restaurant_id = (?)";
    const sql2 = "SELECT * FROM cdev_assignment.reviews JOIN cdev_assignment.account ON cdev_assignment.reviews.account_id = cdev_assignment.account.account_id WHERE restaurant_id = (?) ORDER BY review_id DESC";
    const restaurant_id = req.params.restaurant_id;
    db.query(sql1, [restaurant_id], (err, data) => {
        if(err) return res.json(err)
        let restaurantData = data;
        db.query(sql2, [restaurant_id], (err,reviewData) => {
            if(err) return res.json(err)
            return res.json({restaurantData, reviewData:reviewData})
    });
});
})
app.get("/news", (req, res) => {
    const sql1 = "SELECT * FROM cdev_assignment.news ORDER BY news_id DESC";
    db.query(sql1, (err, data) => {
        if(err) return res.json(err)
        let newsData = data;
            return res.json({newsData})
    });
});
app.get("/trending", (req, res) => {
    const sql1 = "SELECT * FROM cdev_assignment.trending ORDER BY trending_id DESC";
    db.query(sql1, (err, data) => {
        if(err) return res.json(err)
        let trendingData = data;
            return res.json({trendingData})
    });
});
app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
  
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
  
      db.query("INSERT INTO cdev_assignment.account (email, password, username) VALUES (?,?,?)",
        [email, hash, username],
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  });
  app.get("/login", (req, res) => {
    if(req.session.user){
      res.send({ loggedIn: true, user: req.session.user});
    } else {
      res.send({ loggedIn: false});
    }
  });
  
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.send({ message: "email and password are required fields" });
      return;
    }
    
    db.query("SELECT * FROM cdev_assignment.account WHERE email = ?",
      email,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
    
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) { 
              req.session.user = result
              res.send({ account_id: result[0].account_id });
            } else {
              res.send({ message: "Wrong email/password combination!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    );
  });
  
  app.get('/account/:account_id', (req, res) => {
    const account_id = req.params.account_id;
    const sql1 = "SELECT * FROM cdev_assignment.account WHERE account_id = (?)"
    const sql2 = "SELECT * FROM cdev_assignment.reviews JOIN cdev_assignment.account ON cdev_assignment.reviews.account_id = cdev_assignment.account.account_id JOIN cdev_assignment.restaurant ON cdev_assignment.restaurant.restaurant_id = cdev_assignment.reviews.restaurant_id WHERE cdev_assignment.reviews.account_id = (?) ORDER BY review_id DESC"
    db.query(sql1, [account_id],(err, data) => {
      if(err) return res.json(err)
      let accountData = data;
      db.query(sql2, [account_id], (err,reviewData) => {
        if(err) return res.json(err)
          return res.json({accountData, reviewData:reviewData})
  });
});
});

app.post('/reviews', (req, res) => {
  const sql = "INSERT INTO cdev_assignment.reviews (restaurant_id, account_id, comments, datePosted, restaurantRating) VALUES (?, ?, ?, ?, ?)"
  const values = [
    req.body.restaurant_id,
    req.body.account_id,
    req.body.comments,
    new Date(),
    req.body.restaurantRating
  ]
  db.query(sql, values, (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  });
})

app.put('/reviewsUpdate/:review_id', (req, res) => {
  const review_id = req.params.review_id
  const { comments, restaurantRating } = req.body
  const sql = "UPDATE reviews SET comments = ?, restaurantRating = ? Where review_id = ?"
  db.query(sql, [comments, restaurantRating, review_id], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
})
})
app.delete('/reviewsDelete/:review_id', (req, res) => {
  const review_id = req.params.review_id
  const sql = "DELETE FROM cdev_assignment.reviews WHERE review_id = ?"
  db.query(sql, review_id, (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
})
})
app.get('/restaurantSearch/:restaurantName',(req, res) => {
  const restaurantName = req.params.restaurantName + '%';
  const sql = "SELECT * FROM cdev_assignment.restaurant WHERE restaurantName LIKE (?)";
  db.query(sql, [restaurantName], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get('/restaurantCategory/:category',(req, res) => {
  const category = req.params.category
  const sql = "SELECT * FROM cdev_assignment.restaurant WHERE category1 = ? OR category2 = ?";
  db.query(sql, [category, category], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get('/restaurantRating/:rating',(req, res) => {
  const rating = req.params.rating
  const sql = "SELECT * FROM cdev_assignment.restaurant WHERE rating >= ?";
  db.query(sql, [rating], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get('/restaurantLocation/:locations',(req, res) => {
  const location = req.params.locations
  const sql = "SELECT * FROM cdev_assignment.restaurant LEFT JOIN cdev_assignment.outlet ON cdev_assignment.outlet.restaurant_id = cdev_assignment.restaurant.restaurant_id WHERE locations = ? Group BY cdev_assignment.restaurant.restaurant_id";
  db.query(sql, [location], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get('/restaurantPrice/:priceRange',(req, res) => {
  const priceRange = req.params.priceRange
  const sql = "SELECT * FROM cdev_assignment.restaurant WHERE priceRange LIKE ?";
  db.query(sql, [priceRange], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get('/restaurants',(req, res) => {
  const sql = "SELECT * FROM cdev_assignment.restaurant ORDER BY restaurant_id DESC";
  db.query(sql, (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.post(`/Liked`,(req, res) => {
  const restaurant_id = req.body.restaurant_id
  const account = req.body.account_id
  const sql = "INSERT INTO cdev_assignment.liked  (restaurant_id, account_id) VALUES (?, ?)"
  db.query(sql,[restaurant_id, account], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.get(`/Liked/:account_id`, (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const account = req.params.account_id
  const sql = "SELECT * FROM cdev_assignment.restaurant JOIN cdev_assignment.Liked ON cdev_assignment.restaurant.restaurant_id = cdev_assignment.Liked.restaurant_id JOIN cdev_assignment.account ON cdev_assignment.Liked.account_id = cdev_assignment.account.account_id";
  db.query(sql,[restaurant_id, account], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.delete(`/Liked/:restaurant_id/:account_id`, (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const account = req.params.account_id
  const sql = "DELETE FROM cdev_assignment.Liked WHERE cdev_assignment.Liked.restaurant_id = ? AND cdev_assignment.Liked.account_id = ?;";
  db.query(sql,[restaurant_id, account], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
  })
})
app.put('/account/:account_id', (req, res) => {
  const account_id = req.params.account_id
  const { username } = req.body
  const sql = "UPDATE cdev_assignment.account SET username= ? Where account_id = ?"
  db.query(sql, [username, account_id], (err, data) => {
    if(err) return res.json(err)
    let restaurantData = data;
    return res.json({restaurantData})
})
})


app.listen(8800, ()=>{
    console.log("Connected to Database!")
})