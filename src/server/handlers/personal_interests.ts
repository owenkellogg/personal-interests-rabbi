
import { badRequest } from 'boom'

import { ingest, findOne, findAll, findAllForPlayer, buildRequest } from '../../personal_interest'

export async function create(req) {

  try {

    const personal_interest = await ingest(req.payload)

    return {

      personal_interest

    }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function show(req) {

  try {

    const personal_interests = await findOne(req.params)

    return {

      personal_interests

    }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function index(req) {

  try {

    const personal_interests = await findAll(req.query)

    return {

      personal_interests

    }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function forPlayer(req) {

  try {

    const personal_interests = await findAllForPlayer(req.params)

    return {

      personal_interests

    }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function build(req) {
  // Return BIP270 Payment Request

  try {

    const paymentRequest = await buildRequest(req.params)

    return paymentRequest

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

