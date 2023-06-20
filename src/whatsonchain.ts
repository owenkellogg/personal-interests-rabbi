
import axios from 'axios'

type TxHex = string;

export async function getTransaction(txid: string): Promise<TxHex> {

  let url =`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`

  let {data} = await axios.get(url)

  return data

}

