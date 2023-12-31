
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: config.get('host'),
  port: config.get('port'),
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

if (config.get('prometheus_enabled')) {

  log.info('server.metrics.prometheus', { path: '/metrics' })

  const { register: prometheus } = require('./metrics')

  server.route({
    method: 'GET',
    path: '/metrics',
    handler: async (req, h) => {
      return h.response(await prometheus.metrics())
    },
    options: {
      description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
      tags: ['system']
    }
  })

  server.route({
    method: 'GET',
    path: '/api/personal-interests',
    handler: handlers.PersonalInterests.index
  })

  server.route({
    method: 'GET',
    path: '/api/personal-interests/new/{pubKey}/{topic}/{value}',
    handler: handlers.PersonalInterests.build
  })

  server.route({
    method: 'GET',
    path: '/api/personal-interests/{txid}',
    handler: handlers.PersonalInterests.show
  })

  server.route({
    method: 'POST',
    path: '/api/personal-interests',
    handler: handlers.PersonalInterests.create
  })

  server.route({
    method: 'GET',
    path: '/api/players',
    handler: handlers.PersonalInterests.index,
    options: {
      tags: ['api', 'players'],
      validate: {
        query: Joi.object({
          offset: Joi.number().optional(),
          limit: Joi.number().optional()
        }),
        failAction: 'log'
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          players: Joi.array().items(Joi.object({
            pubKey: Joi.string().required(),
            count: Joi.number().required()
          }))
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/api/players/{pubKey}/personal-interests',
    handler: handlers.PersonalInterests.forPlayer,
    options: {
      tags: ['api', 'players'],
      validate: {
        params: Joi.object({
          pubKey: Joi.string().required()
        }),
        failAction: 'log'
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          personal_interests: Joi.array().items(Joi.object({
            txid: Joi.string().required(),
            txhex: Joi.string().required(),
            pubKey: Joi.string().required(),
            topic: Joi.string().required(),
            value: Joi.number().required(),
          }))
        })
      }
    }
  })

}

server.route({
  method: 'GET', path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

var started = false

export async function start() {

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'API Docs',
        version: Pack.version,
        description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
      },
      schemes: ['http', 'https'],
      host: 'localhost:5200',
      documentationPath: '/api',
      grouping: 'tags'
    }

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    const HapiSwagger = require('hapi-swagger');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

    log.info('server.api.documentation.swagger', swaggerOptions)
  }

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
