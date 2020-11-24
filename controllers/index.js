const teams = require('../teams')
const models = require('../models')

const getAllTeams = async (request, response) => {
  const teams = await models.teams.findAll()

  return response.send(teams)
}

const getTeamById = (request, response) => {
  const { id } = request.params

  const foundTeam = teams.filter((team) => team.id === parseInt(id))

  return response.send(foundTeam)
}
const saveNewTeam = (request, response) => {
  const {
    id, location, mascot, abbreviation, conference, division
  } = request.body

  if (!location || !mascot || !abbreviation || !conference || !division) {
    return response.status(400).send('All fields required: location, mascot, abbreviation, conference, division')
  }
  const newTeam = {
    id, location, mascot, abbreviation, conference, division
  }

  newTeam.id = teams.length + 1

  teams.push(newTeam)

  return response.status(201).send(newTeam)
}

module.exports = { getAllTeams, getTeamById, saveNewTeam }
