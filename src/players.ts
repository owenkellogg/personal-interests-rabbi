
import models from './models'

export async function listPlayers(): Promise<{pubKey: string}[]> {

  const players = await models.PersonalInterest.findAll({
    attributes: [
      'pubKey',
      [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"],
    ],
    group: 'pubKey'
  })

  return players

}

