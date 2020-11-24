const models = require('../models')

const getAllTeams = async (request, response) => {
  const teams = await models.teams.findAll()

  return response.send(teams)
}

const getTeamById = async (request, response) => {
  const { id } = request.params

  const foundTeam = await models.teams.findOne({ where: { id } })

  return response.send(foundTeam)
}

const saveNewTeam = async (request, response) => {
  const {
    location, mascot, abbreviation, conference, division
  } = request.body

  if (!location || !mascot || !abbreviation || !conference || !division) {
    return response.status(400).send('All fields required: location, mascot, abbreviation, conference, division')
  }

  const newTeam = await models.teams.create({
    location, mascot, abbreviation, conference, division
  })

  return response.status(201).send(newTeam)
}

module.exports = { getAllTeams, getTeamById, saveNewTeam }
