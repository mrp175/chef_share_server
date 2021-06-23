const User = require("../models/user");

const deleteRecipe = async (req, res) => {
  const userId = req.body._id;
  const recipeId = req.body.id;

  try {
    await User.findByIdAndUpdate(userId,
      {$pull: {'recipeStore': {id: recipeId}}}
    );
    res.status(200).send('successfully deleted');

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

const addFromFriend = async (req, res) => {
  const userId = req.body._id;
  const recipe = req.body.recipe;

  try {
    await User.findByIdAndUpdate(userId,
      {$push: {'recipeStore': recipe }}
    );
    res.status(204).send('success');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

}


const editRecipe = async(req, res) => {
  const userId = req.body._id;
  const recipeId = req.body.id
  const editAction = req.params.editAction;

  let options = {
    'nameChange': {$set: {'recipeStore.$.name': req.body.payload}},
    'addNote': {$push: {'recipeStore.$.notes': req.body.payload}},
    'deleteNote':{$pull: {'recipeStore.$.notes': {id: req.body.payload}}},
  }

  try {
    await User.findOneAndUpdate(
      {_id: userId, recipeStore: {$elemMatch: {id: recipeId}}},
      options[editAction],
      {'new': true, 'safe': true}
    );
    res.status(200).send('successfully updated');

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}


module.exports = { deleteRecipe, addFromFriend, editRecipe};