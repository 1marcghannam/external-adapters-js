# CRYPTOCOMPARE

![1.2.4](https://img.shields.io/github/package-json/v/smartcontractkit/external-adapters-js?filename=packages/sources/cryptocompare-test/package.json) ![v3](https://img.shields.io/badge/framework%20version-v3-blueviolet)

This document was generated automatically. Please see [README Generator](../../scripts#readme-generator) for more info.

## Environment Variables

| Required? |      Name       |                              Description                              |  Type  | Options |                Default                |
| :-------: | :-------------: | :-------------------------------------------------------------------: | :----: | :-----: | :-----------------------------------: |
|           |  API_ENDPOINT   |                  The HTTP URL to retrieve data from                   | string |         |  `https://min-api.cryptocompare.com`  |
|           | WS_API_ENDPOINT |                   The WS URL to retrieve data from                    | string |         | `wss://streamer.cryptocompare.com/v2` |
|    ✅     |     API_KEY     |                       The CryptoCompare API key                       | string |         |                                       |
|           |   WS_API_KEY    | The websocket API key to authenticate with, if different from API_KEY | string |         |                                       |

---

## Input Parameters

Every EA supports base input parameters from [this list](https://github.com/smartcontractkit/ea-framework-js/blob/main/src/config/index.ts)

| Required? |   Name   |     Description     |  Type  |                                                                                  Options                                                                                   | Default  |
| :-------: | :------: | :-----------------: | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------: |
|           | endpoint | The endpoint to use | string | [crypto-vwap](#vwap-endpoint), [crypto](#crypto-endpoint), [marketcap](#marketcap-endpoint), [price](#crypto-endpoint), [volume](#volume-endpoint), [vwap](#vwap-endpoint) | `crypto` |

## Crypto Endpoint

Supported names for this endpoint are: `crypto`, `price`.

### Input Params

| Required? | Name  |        Aliases         |                  Description                   |  Type  | Options | Default | Depends On | Not Valid With |
| :-------: | :---: | :--------------------: | :--------------------------------------------: | :----: | :-----: | :-----: | :--------: | :------------: |
|    ✅     | base  | `coin`, `from`, `fsym` | The symbol of symbols of the currency to query | string |         |         |            |                |
|    ✅     | quote | `market`, `to`, `tsym` |    The symbol of the currency to convert to    | string |         |         |            |                |

### Example

There are no examples for this endpoint.

---

## Vwap Endpoint

Supported names for this endpoint are: `crypto-vwap`, `vwap`.

### Input Params

| Required? | Name  |        Aliases         |                  Description                   |  Type  | Options | Default | Depends On | Not Valid With |
| :-------: | :---: | :--------------------: | :--------------------------------------------: | :----: | :-----: | :-----: | :--------: | :------------: |
|    ✅     | base  | `coin`, `from`, `fsym` | The symbol of symbols of the currency to query | string |         |         |            |                |
|    ✅     | quote | `market`, `to`, `tsym` |    The symbol of the currency to convert to    | string |         |         |            |                |
|           | hours |                        |        Number of hours to get VWAP for         | number |         |  `24`   |            |                |

### Example

There are no examples for this endpoint.

---

## Volume Endpoint

`volume` is the only supported name for this endpoint.

### Input Params

| Required? | Name  |        Aliases         |                  Description                   |  Type  | Options | Default | Depends On | Not Valid With |
| :-------: | :---: | :--------------------: | :--------------------------------------------: | :----: | :-----: | :-----: | :--------: | :------------: |
|    ✅     | base  | `coin`, `from`, `fsym` | The symbol of symbols of the currency to query | string |         |         |            |                |
|    ✅     | quote | `market`, `to`, `tsym` |    The symbol of the currency to convert to    | string |         |         |            |                |

### Example

There are no examples for this endpoint.

---

## Marketcap Endpoint

`marketcap` is the only supported name for this endpoint.

### Input Params

| Required? | Name  |        Aliases         |                  Description                   |  Type  | Options | Default | Depends On | Not Valid With |
| :-------: | :---: | :--------------------: | :--------------------------------------------: | :----: | :-----: | :-----: | :--------: | :------------: |
|    ✅     | base  | `coin`, `from`, `fsym` | The symbol of symbols of the currency to query | string |         |         |            |                |
|    ✅     | quote | `market`, `to`, `tsym` |    The symbol of the currency to convert to    | string |         |         |            |                |

### Example

There are no examples for this endpoint.

---

MIT License
