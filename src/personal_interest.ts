
const abi = require('../personal-interests-app/artifacts/src/contracts/personalInterest.json')

const exampleTxid = 'f731754a35d83d2f95fd36270a57bda2944dc4edb759a24bc7904cf0d5a143dd'

import { getTransaction } from './whatsonchain'

import { PersonalInterest } from '../personal-interests-app/src/contracts/personalInterest'

import { bsv } from 'scrypt-ts'

import models from './models'

PersonalInterest.loadArtifact(abi)

export async function ingest({ transaction }: { transaction: string }) {

}

export async function fetch({ txid }: { txid: string }): Promise<PersonalInterest[]> {

  const txhex = await getTransaction(txid)

  console.log({ txhex })

  const tx = new bsv.Transaction(txhex)

  const interests = tx.outputs.map((output, index) => {

    console.log({ index })

    try {

      const interest = PersonalInterest.fromTx(tx, index)

      return interest

    } catch(error) {

      console.error(error)

      return

    }

  }).filter(output => !!output)

  console.log({ interests })

  return interests

}

export async function fromTx({ txid, index }: { txid: string, index?: number }): Promise<any[]> {

  let records = await models.PersonalInterest.findAll({
    where: { txid }
  })

  if (records.length > 0) {

    return records

  }

  const interests = await fetch({ txid })

  return Promise.all(interests.map(async (interest, index) => {

  console.log(interest)
  console.log(Object.keys(interest))

    try {

      const record = await models.PersonalInterest.create({
        txid,
        //@ts-ignore
        //txhex: interest.from.tx.serialize(),
        txindex: index,
        topic: Buffer.from(interest.topic, 'hex').toString('utf8'),
        pubKey: interest.pubKey,
        //@ts-ignore
        //value: interest.tx.outputs[index].satoshis
      }) 

      return record

    } catch(error) {

      console.error(error)

    }

  }))

}

interface FindAll {
  limit?: number;
  order?: number;
  offset?: number;
}

export async function findAll({ limit, order, offset }: FindAll) {

  return models.PersonalInterest.findAll()

}

export async function findAllForPlayer({ pubKey }: { pubKey: string }) {

  return models.PersonalInterest.findAll({ where: { pubKey }})

}

interface BuildPersonalInterest {
  pubKey: string;
  topic: string;
  value: number;
}

export async function buildRequest(args: BuildPersonalInterest) {

  const instance = PersonalInterest.build(args.pubKey, args.topic)

  const script = instance.lockingScript.toHex()

  return {
    script
  }

}

