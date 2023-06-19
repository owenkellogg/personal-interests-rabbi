
const exampleTxid = 'f731754a35d83d2f95fd36270a57bda2944dc4edb759a24bc7904cf0d5a143dd'

export async function ingest({ transaction }: { transaction: string }) {

}

export async function findOne({ txid, index }: { txid: string, index?: number }) {

}

interface FindAll {
  limit?: number;
  order?: number;
  offset?: number;
}

export async function findAll({ limit, order, offset }: FindAll) {

}

export async function findAllForPlayer({ address }: { address: string }) {

}

interface BuildPersonalInterest {
  address: string;
  topic: string;
  value: number;
}

export async function buildRequest(args: BuildPersonalInterest) {

}

