import {
    method,
    prop,
    SmartContract,
    PubKey,
    Sig,
    hash256,
    assert,
    ByteString,
    SigHash,
} from 'scrypt-ts'

export class PersonalInterest extends SmartContract {

    @prop()
    pubKey: PubKey;

    @prop()
    topic: ByteString;

    constructor(pubKey: PubKey, topic: ByteString) {
        super(...arguments)
        this.pubKey = pubKey
        this.topic = topic
    }

    @method()
    public unlock(sig: Sig) {

      assert(this.checkSig(sig, this.pubKey), 'signature invalid')

    }
}
