const Sequelize = require('Sequelize')
const teamsModel = require('./teams')

const connection = new Sequelize('nflTeams', 'Kraft', 'P@55W0rd', {
  host: 'localhost', dialect: 'mysql'
})

const teams = teamsModel(connection, Sequelize)

module.exports = { teams }

