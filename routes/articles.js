const express = require('express');
const router = express.Router();

// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add'
  });
});

router.get('/scan', function(req, res){
  res.render('scan');
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('fullName','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('number','Number is required').notEmpty();
  req.checkBody('appointmentDate','Date is required').notEmpty();
  req.checkBody('appointmentTime','time is required').notEmpty();




  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.fullName = req.body.fullName;
    article.author = req.user._id;
    article.email = req.body.email;
    article.number = req.body.number;
    article.appointmentDate = req.body.appointmentDate;
    article.appointmentTime = req.body.appointmentTime;
    article.occupation = req.body.occupation;
    article.description = req.body.description;
    article.meetingRoom = req.body.meetingRoom;




    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Appointment Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.fullName = req.body.fullName;
  article.author = req.user._id;
  article.email = req.body.email;
  article.number = req.body.number;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Appointment Updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article:article,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
