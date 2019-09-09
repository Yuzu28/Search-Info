var express = require('express');
var router = express.Router();

const request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  const topAnimeAiring = `https://api.jikan.moe/v3/top/anime/1/airing`;

  //request.get take 2 arguments
  //1. URL to get
  //2. the callback to run when request is fulfilled
  request.get(topAnimeAiring,(error, response, animeData) => {

    const parsedData = JSON.parse(animeData);
  
    console.log(parsedData);
    res.render('index', {parsedData: parsedData.top });

  })

});


// router.get('/register', (req, res, next)=>{
//   res.render('register')

  

// })

// router.get('/login', (req,res, next) =>{
//   res.render('login')

// })


// manga routes
router.post('/search',(req, res, next) => {
  // res.send("sanity check")
  var userSearchTerm = encodeURI(req.body.animeSearch);
  let cat = req.body.cat;

  //Take you to /Manga Route

  if (cat =="manga"){
      var mangaURL = `https://api.jikan.moe/v3/search/${cat}?q=${userSearchTerm}`;
  
      request.get(mangaURL, (error, response, mangaData) =>{
      let parsedData = JSON.parse(mangaData);
    
      res.render('search-manga', {
      parsedData: parsedData.results
    })
  })
  }
   //Take you to /Anime Route 
  else{ 
      var animeURL = `https://api.jikan.moe/v3/search/${cat}?q=${userSearchTerm}`;
  // res.send(animeURL);
  request.get(animeURL, (error, response, animeData) =>{
    let parsedData = JSON.parse(animeData);
  
    res.render('search-anime', {
      parsedData: parsedData.results
    })
  })

  }
})

router.get('/manga/:id', (req,res,next) => {
  const mangaId = req.params.id;
  const mangaUrl = "https://api.jikan.moe/v3/manga/" + mangaId;
  
  // res.send(mangaUrl);
  request.get(mangaUrl, (error, response, mangaData) => {
    const parsedData =JSON.parse(mangaData);
    res.render('single-manga', {
      parsedData
    })
  })
  
})

router.get('/anime/:id', (req,res,next) => {
  const animeId = req.params.id;
  const animeUrl = "https://api.jikan.moe/v3/anime/" + animeId;
  
  request.get(animeUrl, (error, response, animeData) => {
    const parsedData =JSON.parse(animeData);
      
    res.render('single-anime', {
      parsedData
    })
  })
  

})




module.exports = router;
