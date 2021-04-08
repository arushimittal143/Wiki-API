const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connecting to DataBase
mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser:true, useUnifiedTopology: true });
const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",articleSchema);
// TODO Requests Targeting All Article--------------------------------------------------------------
//*! Get-Fetches all the articles...
// app.get("/articles",function(req,res){
//   Article.find(function(er,foundArticles){
//     //console.log(foundArticles);
//     var err;
//     if(!err){
//     res.send(foundArticles);
//     }
//     else
//     {
//       res.send(err);
//     }
//   });
// });

//*! Post--Update All Articles
// app.post("/articles",function(req,res){
//   // console.log(req.body.title);
//   // console.log(req.body.content);

//   const newArticle=new Article({
//     title:req.body.title,
//     content:req.body.content
//   });

//   newArticle.save(function(err){
//     if(!err){
//       res.send("Successfully added a new article");
//       }
//       else
//       {
//         res.send(err);
//       }
//   });
// });

//*! Delete All Articles
// app.delete("/articles",function(req,res){
// Article.deleteMany(function(err){
//   if(!err){
//     res.send("Successfully deleted all articles");
//     }
//     else
//     {
//       res.send(err);
//     }
// })
// });

//*! Chained Route Handlers
app.route("/articles")

.get(function(req,res){
  Article.find(function(er,foundArticles){
    //*  To display on Terminal 
    //console.log(foundArticles);
    var err;
    if(!err){
    res.send(foundArticles);
    }
    else
    {
      res.send(err);
    }
  });
})

.post(function(req,res){
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
      }
      else
      {
        res.send(err);
      }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
      }
      else
      {
        res.send(err);
      }
  })
  });
// TODO Requests Targeting Specific Article---------------------------------------------------------------
  //*! Get a Specific Article
  app.route("/articles/:articleTitle")

  .get(function(req, res){
  
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  
  .put(function(req, res){
  
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
        else{
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res){

    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){

    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });
  

app.listen(3000, function() {
  console.log("Server started on port 3000");
});