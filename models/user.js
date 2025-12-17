const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User




/* 
Tehtävä 13.8.
Lisää sovellukseen tuki käyttäjille. Käyttäjillä on tunnisteen lisäksi seuraavat kentät:

name (merkkijono, ei saa olla tyhjä)
username (merkkijono, ei saa olla tyhjä)
Toisin kuin materiaalissa älä nyt estä Sequelizea luomasta käyttäjille aikaleimoja created_at ja updated_at

Kaikilla käyttäjillä voi olla sama salasana materiaalin tapaan. Voit myös halutessasi toteuttaa salasanan kunnolla osan 4 tapaan.

Toteuta seuraavat routet

POST api/users (uuden käyttäjän lisäys)
GET api/users (kaikkien käyttäjien listaus)
PUT api/users/:username (käyttäjän nimen muutos, huomaa että parametrina ei ole id vaan käyttäjätunnus)
Varmista, että Sequelizen automaattisesti asettamat aikaleimat created_at ja updated_at toimivat oikein kun luot käyttäjän ja muutat käyttäjän nimeä. */