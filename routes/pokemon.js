const express = require('express');
const router = express.Router();
let db = require('../models')
// Allowing the API to be called
const axios = require('axios'); 

// GET /pokemon - return a page with favorited Pokemon
router.get('/favorites', (req, res) => {
  db.pokemon.findAll()
  .then(pokemons => {
    res.render('../views/favorites', { pokemons })
  })
  .catch((err) => {
    console.log('Err', err)
    res.send('404')
  })
});

router.get('/favorites/:id', (req, res) => {
  db.pokemon.findByPk(req.params.id)
  .then(pokemon => {
    let pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
    axios.get((pokemonUrl)+pokemon.name)
    .then((apiResponse)=> {
      // console.log(apiResponse)
      let pokeData = apiResponse.data
      console.log(pokeData)
      console.log(pokemon.name)
      res.render('../views/show', {
        pokemonName: pokemon.name, 
        pokeData: pokeData})
    })
  })
  .catch((err) => {
    console.log('Err', err)
    res.send('404')
  })
})

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/favorites', (req, res) =>{
  db.pokemon.create(req.body)
  .then(newPokemon => {
    console.log('Created: ', req.body.name)
  })
  .then(res.redirect('/favorites'))
});

module.exports = router;
