import {
  InputParameters,
  Requester,
  Validator,
  Logger,
  AdapterResponseInvalidError,
} from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig } from '@chainlink/ea-bootstrap'
import { Config } from '../config'

export const supportedEndpoints = ['birc']

export type TInputParameters = { tenor: string }
export const inputParameters: InputParameters<TInputParameters> = {
  tenor: {
    description: 'The tenor value to pull from the API response',
    type: 'string',
    options: ['SIRB', '1W', '2W', '3W', '1M', '2M', '3M', '4M', '5M'],
    required: true,
  },
}

export interface ResponseSchema {
  serverTime: string
  error: string
  payload: {
    tenors: {
      SIRB: string
      '1W': string
      '2W': string
      '3W': string
      '1M': string
      '2M': string
      '3M': string
      '4M': string
      '5M': string
    }
    time: number
    amendTime: number
    repeatOfPreviousValue: boolean
  }[]
}

// Tenor must be between -1 and 1
export const tenorInRange = (tenor: number): boolean => tenor >= -1 && tenor <= 1
// Check if time of latest update is in the current day in UTC time
export const latestUpdateIsCurrentDay = (utcTimeOfUpdate: number): boolean => {
  try {
    const latestUpdateDate = new Date(utcTimeOfUpdate)
    const currentDay = new Date()
    return (
      latestUpdateDate.getUTCFullYear() === currentDay.getUTCFullYear() &&
      latestUpdateDate.getUTCMonth() === currentDay.getUTCMonth() &&
      latestUpdateDate.getUTCDate() === currentDay.getUTCDate()
    )
  } catch (error) {
    return false
  }
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)
  const jobRunID = validator.validated.id
  const tenor = validator.validated.data.tenor.toUpperCase()

  const reqConfig = { ...config.api, params: { id: 'BIRC' }, url: `/v1/curves` }
  const response = await Requester.request<ResponseSchema>(
    reqConfig,
    undefined,
    config.bircRetry,
    config.bircRetryDelay,
  )

  // Values of '0' are considered to be valid so acceptZeroValue and cast the result to string to ensure the field appears in the JSON response we send
  const result = Requester.validateResultNumber(
    response.data.payload,
    [response.data.payload.length - 1, 'tenors', tenor],
    { acceptZeroValue: true },
  )

  const latestUpdate = response.data.payload[response.data.payload.length - 1]

  if (!latestUpdateIsCurrentDay(latestUpdate.time)) {
    const error = 'Latest update from response is not in current day'
    Logger.error(error, { latestUpdate })
    throw new AdapterResponseInvalidError({ message: error })
  }

  if (!tenorInRange(result)) {
    const error = 'Tenor is out of range (-1 to 1)'
    Logger.error(error, { value: result, tenor })
    throw new AdapterResponseInvalidError({ message: error })
  }

  return Requester.success(
    jobRunID,
    Requester.withResult(response, result.toString()),
    config.verbose,
  )
}
