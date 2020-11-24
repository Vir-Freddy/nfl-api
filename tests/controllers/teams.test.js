/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { describe, it } = require('mocha')
const { teamList, singleTeam, postedTeam } = require('../mocks/teams')
const { getAllTeams, getTeamById, saveNewTeam } = require('../../controllers/index')


chai.use(sinonChai)
const { expect } = chai

describe('controllers - teams', () => {
  describe('getAllTeams', () => {
    it('Retrieves a list of teams from the DB and calls response.send() with the list', async () => {
      const stubbedFindAll = sinon.stub(models.teams, 'findAll').returns(teamList)
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      await getAllTeams({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(teamList)
    })
  })

  describe('getTeamById', () => {
    it('retrieves the team associated with the provided ID from the DB and calls response.send with it', async () => {
      const request = { params: { id: 1 } }
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }
      const stubbedFindOne = sinon.stub(models.teams, 'findOne').returns(singleTeam)

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 1 } })
      expect(stubbedSend).to.have.been.calledWith(singleTeam)
    })
  })

  describe('saveNewTeam', () => {
    it('accepts new team details and saves it as a new team, returning the saved record with a 201 status', async () => {
      const request = { body: postedTeam }
      const stubbedSend = sinon.stub()
      const stubbedStatus = sinon.stub().returns({ send: stubbedSend })
      const response = { status: stubbedStatus }
      const stubbedCreate = sinon.stub(models.teams, 'create').returns(postedTeam)

      await saveNewTeam(request, response)

      expect(stubbedCreate).to.have.been.calledWith(postedTeam)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedSend).to.have.been.calledWith(postedTeam)
    })
  })
})



