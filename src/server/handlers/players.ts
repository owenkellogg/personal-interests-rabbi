
import { listPlayers } from '../../players'

import { badRequest } from 'boom'

export async function index() {

  try {

    const players = await listPlayers()

    return {

      players
  
    }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}
