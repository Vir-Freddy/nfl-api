/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  before, beforeEach, afterEach, describe, it
} = require('mocha')
const { teamList, singleTeam, postedTeam } = require('../mocks/teams')
const { getAllTeams, getTeamById, saveNewTeam } = require('../../controllers/index')


chai.use(sinonChai)
const { expect } = chai

describe('controllers - teams', () => {
  let sandbox
  let stubbedFindOne
  let stubbedFindAll
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusSend
  let stubbedStatus

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.teams, 'findOne')

    stubbedFindAll = sandbox.stub(models.teams, 'findAll')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })
  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })
  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllTeams', () => {
    it('Retrieves a list of teams from the DB and calls response.send() with the list', async () => {
      stubbedFindAll.returns(teamList)

      await getAllTeams({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(teamList)
    })

    it('returns aa 404 when no team is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { id: 'not-found' } }

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 'not-found' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { id: 'throw-error' } }

      await getTeamById(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 'throw-error' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve team, please try again')
    })
  })

  describe('getTeamById', () => {
    it('retrieves the team associated with the provided ID from the DB and calls response.send with it', async () => {
      const request = { params: { id: 1 } }
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      stubbedFindOne.returns(singleTeam)

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



