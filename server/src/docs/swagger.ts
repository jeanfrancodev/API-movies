import { Express } from 'express'
import swaggerJsdoc, { Options } from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

export default function setupSwagger(app: Express) {
  const options: Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Api-Movies Documentation ',
        version: '1.0.0'
      },
      components: {
        schemas: {
          MovieInput: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              synopsis: { type: 'string' },
              trailer: { type: 'string' },
              studios: { type: 'string' },
              year: { type: 'string' },
              duration: { type: 'string' },
              genre: { type: 'array', items: { type: 'string' } },
              image: { type: 'string' },
              ageClassification: { type: 'number' }
            },
            required: [
              'title',
              'synopsis',
              'trailer',
              'studios',
              'year',
              'duration',
              'genre',
              'ageClassification'
            ]
          },
          UserInput: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string', format: 'password' },
              avatar: { type: 'string' },
              role: { type: 'string' },
              isActive: { type: 'boolean' }
            },
            required: ['name', 'email', 'password', 'role']
          },
          RateInput: {
            type: 'object',
            properties: {
              stars: { type: 'number' },
              comment: { type: 'string' }
            }
          }
        },
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: {
        bearerAuth: []
      }
    },
    apis: ['./src/**/*.ts']
  }
  const specs = swaggerJsdoc(options)
  app.use('/api-movies', swaggerUI.serve, swaggerUI.setup(specs))
}
