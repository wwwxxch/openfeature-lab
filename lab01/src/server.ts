import fastify from 'fastify' // fastify: kind of node js API server
import { OpenFeature } from '@openfeature/server-sdk'
import { FlagdProvider } from '@openfeature/flagd-provider'

type AppConfig = {
  port: number
  host: string
}

export const startServer = async (appConfig: AppConfig) => {
  // Create an instance of Fastify
  const server = fastify()

  // Initialize OpenFeature
  // Need to setup the where the flag service is
  OpenFeature.setProvider(
    new FlagdProvider({
      host: 'localhost',
      port: 8013
    })
  )
  const client = OpenFeature.getClient()

  // Declare a route
  server.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  server.get('/ping', async (request, reply) => {
    // Evaluate the feature flag 'feature-a'
    // Here put the flag name we expect to get & default value 
    const enableFeatureA = await client.getBooleanValue('feature-a', false)
    if (enableFeatureA) {
      return { message: 'pong!pong!pong!' }
    } else {
      return { message: 'pong!' }
    }
  })

  // Run the server!
  await server.listen({ port: appConfig.port, host: appConfig.host })
}
