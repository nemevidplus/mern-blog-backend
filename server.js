const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables


const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'https://mern-blog-frontend-self.vercel.app', // Correct frontend URL
}));

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const postSchema = mongoose.Schema(
    { title: String,
     description: String}
)

const Post = mongoose.model("Post", postSchema);

mongoose
  .connect(MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req,res) => {
    res.send("Express is here with Évi")
});

app.post("/create", (req, res) => {
    Post.create({
        title: req.body.title,
        description: req.body.description
    })
    .then((doc) => {
        console.log(doc);
        res.status(201).send("Post created");
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error creating post");
    });
});

app.get("/posts", (req,res) => {
   Post.find()
   .then((items) => {
    console.log(items); // Logs the array of documents from the database
    res.json(items);
})
   .catch((err) => console.log(err));
});

app.delete("/delete/:postId", (req,res) => {
    Post.findByIdAndDelete(req.params.postId)
    .then((doc) => 
     console.log(doc))
    .catch((err) => console.log(err));
 });

 app.put("/update/:id", (req, res) => {
    Post.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        description: req.body.description,
      }
    )
      .then((doc) => console.log(doc))
      .catch((err) => console.log(err));
  });
  

app.listen(3001, function(){
    console.log("Server is running")
});