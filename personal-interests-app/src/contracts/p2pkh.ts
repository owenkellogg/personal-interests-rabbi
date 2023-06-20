
import {
    method,
    prop,
    SmartContract,
    PubKeyHash,
    PubKey,
    Sig,
    hash256,
    assert,
    ByteString,
    SigHash,
    hash160
} from 'scrypt-ts'

export default class P2PKH extends SmartContract {


  @prop()
  readonly pubKeyHash: PubKeyHash;

  constructor(pubKeyHash: PubKeyHash) {

    super(...arguments)

    this.pubKeyHash = pubKeyHash

  }

  @method()
  public unlock(sig: Sig, pubkey: PubKey) {

    assert(
      hash160(pubkey) == this.pubKeyHash,
      'public key hashes are not equal'
    )

    assert(this.checkSig(sig, pubkey), 'signature invalid')

  }

}

