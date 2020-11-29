const models = require('../models')

const getAllTeams = async (request, response) => {
  const teams = await models.teams.findAll()

  return response.send(teams)
}

const getTeamById = async (request, response) => {
  try {
    const { id } = request.params

    const foundTeam = await models.teams.findOne({ where: { id } })

    return foundTeam
      ? response.send(foundTeam)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve team, please try again')
  }
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
