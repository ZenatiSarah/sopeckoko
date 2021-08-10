const bcrypt = require('bcrypt'); //Sécurisation des données
const userSchema = require('../models/auth');
const token = require('jsonwebtoken');
const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const cryptojs = require('crypto-js');
const User = mongoose.model('User', userSchema);

const schemaValidator = new passwordValidator();

schemaValidator
    .is().min(8)
    .is().max(50)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

exports.signup = async (req, res, next) => {
    const encryptedEmail = cryptojs.HmacSHA256(req.body.email, "email encrypté").toString();

    if (schemaValidator.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: encryptedEmail,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else if (!schemaValidator.validate(req.body.password)) {
        res.status(401).json({ message: "Mot de passe faible. Veuillez entrer 8 caractères, 2 chiffres et des majuscules" });

    }
};

exports.login = (req, res, next) => {
    //trouver le user dans la base de donnée
    const encryptedEmail = cryptojs.HmacSHA256(req.body.email, "email encrypté").toString();
    User.findOne({ email: encryptedEmail })

        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: token.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};
