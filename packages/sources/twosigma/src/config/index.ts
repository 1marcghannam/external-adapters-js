import { AdapterConfig } from '@chainlink/external-adapter-framework/config'

export const config = new AdapterConfig({
  WS_API_ENDPOINT: {
    description: 'The WebSocket API URL',
    type: 'string',
    required: true,
  },
  WS_API_KEY: {
    description: 'The API key used to authenticate requests',
    type: 'string',
    required: true,
    sensitive: true,
  },
})
