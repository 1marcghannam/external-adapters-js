import {
  CryptoPriceEndpoint,
  PriceEndpointInputParameters,
  PriceEndpointParams,
} from '@chainlink/external-adapter-framework/adapter'
import {
  WebsocketReverseMappingTransport,
  WebsocketTransportGenerics,
} from '@chainlink/external-adapter-framework/transports/websocket'
import { makeLogger, SingleNumberResultResponse } from '@chainlink/external-adapter-framework/util'
import { config } from '../config'

const logger = makeLogger('BlocksizeCapitalWebsocketEndpoint')
interface BaseMessage {
  jsonrpc: string
  id?: string | number | null
}

export interface Message extends BaseMessage {
  method: 'vwap'
  params: {
    updates: {
      ticker: string
      price?: number
      size?: number
      volume?: number
      ts: number
    }[]
  }
}

const inputParameters = {
  base: {
    aliases: ['from', 'coin'],
    type: 'string',
    description: 'The symbol of symbols of the currency to query',
    required: true,
  },
  quote: {
    aliases: ['to', 'market'],
    type: 'string',
    description: 'The symbol of the currency to convert to',
    required: true,
  },
} satisfies PriceEndpointInputParameters

export type EndpointTypes = {
  Request: {
    Params: PriceEndpointParams
  }
  Response: SingleNumberResultResponse
  Settings: typeof config.settings
  Provider: {
    WsMessage: Message
  }
}

export class BlocksizeWebsocketReverseMappingTransport<
  T extends WebsocketTransportGenerics,
  K,
> extends WebsocketReverseMappingTransport<T, K> {
  api_key = ''
}

export const websocketTransport: BlocksizeWebsocketReverseMappingTransport<EndpointTypes, string> =
  new BlocksizeWebsocketReverseMappingTransport<EndpointTypes, string>({
    url: ({ adapterSettings: { WS_API_ENDPOINT, API_KEY } }) => {
      websocketTransport.api_key = API_KEY
      return WS_API_ENDPOINT
    },
    handlers: {
      open: (connection: WebSocket) => {
        return new Promise((resolve, reject) => {
          connection.addEventListener('message', (event: MessageEvent<any>) => {
            const parsed = JSON.parse(event.data.toString())
            if (parsed.result?.user_id) {
              logger.info('Got logged in response, connection is ready')
              resolve()
            } else {
              reject(new Error('Failed to make WS connection'))
            }
          })
          const options = {
            jsonrpc: '2.0',
            method: 'authentication_logon',
            params: { api_key: websocketTransport.api_key },
          }
          connection.send(JSON.stringify(options))
        })
      },
      message: (message) => {
        if (message.method !== 'vwap') return []
        const [updates] = message.params.updates
        const params = websocketTransport.getReverseMapping(updates.ticker)
        if (!params) {
          return []
        }
        if (!updates.price) {
          const errorMessage = `The data provider didn't return any value`
          logger.warn(errorMessage)
          return [
            {
              params,
              response: {
                statusCode: 502,
                errorMessage,
              },
            },
          ]
        }
        return [
          {
            params,
            response: {
              result: updates.price,
              data: {
                result: updates.price,
              },
              timestamps: {
                providerIndicatedTimeUnixMs: updates.ts,
              },
            },
          },
        ]
      },
    },
    builders: {
      subscribeMessage: (params) => {
        const pair = `${params.base}${params.quote}`.toUpperCase()
        websocketTransport.setReverseMapping(pair, params)
        return {
          jsonrpc: '2.0',
          method: 'vwap_subscribe',
          params: { tickers: [pair] },
        }
      },

      unsubscribeMessage: (params) => {
        const pair = `${params.base}${params.quote}`.toUpperCase()
        return {
          jsonrpc: '2.0',
          method: 'vwap_unsubscribe',
          params: { tickers: [pair] },
        }
      },
    },
  })

export const endpoint = new CryptoPriceEndpoint<EndpointTypes>({
  name: 'price',
  aliases: ['crypto'],
  transport: websocketTransport,
  inputParameters,
})
