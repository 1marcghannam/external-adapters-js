import * as Amberdata from '@chainlink/amberdata-adapter'
import * as CFBenchmarks from '@chainlink/cfbenchmarks-adapter'
import * as CoinApi from '@chainlink/coinapi-adapter'
import * as CoinGecko from '@chainlink/coingecko-adapter'
import { adapter as CoinMarketCap } from '@chainlink/coinmarketcap-adapter'
import { adapter as CoinMetrics } from '@chainlink/coinmetrics-adapter'
import * as CoinPaprika from '@chainlink/coinpaprika-adapter'
import * as CoinRanking from '@chainlink/coinranking-adapter'
import * as CryptoCompare from '@chainlink/cryptocompare-adapter'
import {
  AdapterImplementation as v2AdapterImplementation,
  DefaultConfig,
  Requester,
  util,
} from '@chainlink/ea-bootstrap'
import { PriceAdapter } from '@chainlink/external-adapter-framework/adapter'
import * as Finage from '@chainlink/finage-adapter'
import * as Kaiko from '@chainlink/kaiko-adapter'
import { adapter as NCFX } from '@chainlink/ncfx-adapter'
import * as Nomics from '@chainlink/nomics-adapter'
import * as Tiingo from '@chainlink/tiingo-adapter'
import { Config, SourceRequestOptions } from '../types'

// List of v2 adapters
export const adaptersV2: v2AdapterImplementation[] = [
  Amberdata as unknown as v2AdapterImplementation,
  CFBenchmarks as unknown as v2AdapterImplementation,
  CoinApi as unknown as v2AdapterImplementation,
  CoinGecko as unknown as v2AdapterImplementation,
  CoinPaprika as unknown as v2AdapterImplementation,
  CoinRanking as unknown as v2AdapterImplementation,
  CryptoCompare as unknown as v2AdapterImplementation,
  Finage as unknown as v2AdapterImplementation,
  Kaiko as unknown as v2AdapterImplementation,
  Nomics as unknown as v2AdapterImplementation,
  Tiingo as unknown as v2AdapterImplementation,
]

// List of v3 adapters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptersV3: PriceAdapter<any>[] = [NCFX, CoinMarketCap, CoinMetrics]

export const DEFAULT_TOKEN_DECIMALS = 18
export const DEFAULT_TOKEN_BALANCE = 1

export const NAME = 'TOKEN_ALLOCATION'

export const makeConfig = (prefix = ''): Config => {
  const sources: SourceRequestOptions = {}

  for (const a of adaptersV2) {
    const name = a.NAME
    const url = util.getURL(name.toUpperCase())
    if (url) {
      const defaultConfig = Requester.getDefaultConfig(prefix)
      defaultConfig.api.baseURL = url
      defaultConfig.api.method = 'post'
      sources[name.toLowerCase()] = defaultConfig
    }
  }

  for (const a of adaptersV3) {
    const name = a.name
    const url = util.getURL(name.toUpperCase())
    if (url) {
      const defaultConfig = {
        api: {
          baseURL: url,
          method: 'post',
        },
      } as DefaultConfig
      sources[name.toLowerCase()] = defaultConfig
    }
  }

  return {
    sources,
    defaultMethod: util.getEnv('DEFAULT_METHOD', prefix) || 'price',
    defaultQuote: util.getEnv('DEFAULT_QUOTE') || 'USD',
    defaultSource: util.getEnv('DEFAULT_SOURCE'),
  }
}

export const makeOptions = ({
  sources,
}: Config): {
  source: string[]
} => {
  const sourceOptions = Object.keys(sources).map((s) => s.toLowerCase())
  return {
    source: sourceOptions,
  }
}
