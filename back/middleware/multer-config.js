const multer = require ('multer');

//Dictionnaire des images
const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};

const storage = multer.diskStorage({ //indique où enregistrer les images
    destination: (req, file, callback) =>{
        callback(null, 'images');
    },
    filename:(req, file, callback) =>{
        const name = file.originalname.split('.')[0].split(' ').join('_');  //Permet de remplacer les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];
        //null pour dire qu'il n'y a pas d'erreur
        callback(null, name + Date.now()+'.' + extension);
    }
});

module.exports = multer({storage}).single('image');