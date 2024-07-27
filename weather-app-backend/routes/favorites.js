// routes/favorites.js
const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather'); // Ensure this model is correctly defined
const authMiddleware = require('../middleware/authMiddleware');

// @route    GET api/favorites
// @desc     Get favorite weather locations
// @access   Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Request received to fetch favorites for user:', req.user.id);

    const favorites = await Weather.find({ user: req.user.id });

    if (!favorites) {
      return res.status(404).json({ msg: 'Favorites not found' });
    }

    if (favorites.length === 0) {
      return res.status(200).json({ msg: 'No favorites found for this user' });
    }

    console.log('Favorites fetched:', favorites);

    res.json({ msg: 'Favorites fetched successfully', data: favorites });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});


//@route    DELETE api/favorites/:id
//desc      Delete a favorite weather location
//@access   Private
router.delete('/:id', authMiddleware, async(req, res) => {
  try{
    const favorite = await Weather.findById(req.params.id);

    if(!favorite){
      return res.status(404).json({msg:'Favorite not found'});
    }

    if(favorite.user.toString() != req.user.id){
      return res.status(401).json({msg:'User not authorized'});
    }

    await favorite.deleteOne({_id: req.params.id});

    res.json({msg:'Favorite removed'});
  } catch(err){
    console.error('Server error:', err.message)
    res.status(500).send('Server error');
  }
});

module.exports = router;
