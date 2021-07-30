const fs = require('fs');
const mongoose = require('mongoose');
const saucesSchema = require('../models/sauces');
const xss = require('xss')

const Sauce = mongoose.model('Sauces', saucesSchema);

//Logique des routes
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        name: xss(sauceObject.name),
        manufacturer: xss(sauceObject.manufacturer),
        description: xss(sauceObject.description),
        mainPepper: xss(sauceObject.mainPepper),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: '0',
        dislikes: '0'
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'objet enregistré !' }))
    .catch(error => res.status(400).json({ error}));
};

exports.createSauceLike = (req, res, next) =>{
    const userId = req.body.userId
    const like = req.body.like

switch (like) {
    case 0:
    Sauce.findOne({_id:req.params.id})
    .then( (sauce) => {
            // UserId se trouve où ?
            const liked = sauce.usersLiked.find(element => element == userId);
            const disliked = sauce.usersDisliked.find(element => element == userId);
            if (liked) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                    .then(() => res.status(200).json({ message: 'Votre like a été supprimé' }))
                    .catch((error) => res.status(400).json({ error: error }))
            }else if (disliked) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                    .then(() => res.status(200).json({ message: 'Votre dislike a été supprimé' }))
                    .catch((error) => res.status(400).json({ error: error }))
            }
    })
    .catch((error) => {res.status(404).json({error: error})});
        break;
    case 1:
            //Vérifier si le user n'a pas déjà liké ou disliké
            Sauce.updateOne({ _id: req.params.id },{$push : {usersLiked: userId}, $inc: {likes : 1}})
            .then(() => res.status(200).json("User liked"))
            .catch((error) => res.status(400).json({error}));
        break;

    case -1:
            Sauce.updateOne({_id:req.params.id},{$push : {usersDisliked: userId}, $inc: {dislikes : 1}})
            .then(() => res.status(200).json("User disliked"))
            .catch((error) => res.status(400).json({error}));
         break;
        }
};

exports.modifySauce = (req, res, next) =>{
    const saucesObject = req.file ?
    
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : { ...req.body };
    Sauce.findOne({_id:req.params.id})
    .then(sauce=>{
        console.log(req.file)
        if (req.file) {
            const filename = sauce.imageUrl.split('/images/')[1];
            console.log(filename);
            fs.unlink(`images/${filename}`, () =>{
                Sauce.updateOne({_id:req.params.id},{...saucesObject,_id:req.params.id})
                .then(() => res.status(200).json({message:"Objet modifié !"}))
                .catch(error => res.status(400).json({ error }));
            });
        }else{
            Sauce.updateOne({_id:req.params.id},{...saucesObject,_id:req.params.id})
            .then(() => res.status(200).json({message:"Objet modifié !"}))
            .catch(error => res.status(404).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) =>{
    //Delete images when the user removes their sauce
    Sauce.findOne({_id:req.params.id})
        .then(sauce =>{
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () =>{
                sauce.deleteOne({_id:req.params.id})
                .then(() => res.status(200).json({message: "Objet supprimé !"}))
                .catch(error => res.status(404).json({ error }));
            });
        })
        .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) =>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}