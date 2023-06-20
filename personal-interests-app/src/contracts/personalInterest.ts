import {
    method,
    prop,
    SmartContract,
    PubKey,
    Sig,
    hash256,
    assert,
    ByteString,
    toByteString,
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

    static build(publicKey: string, topic: string): PersonalInterest {

      const pubKey = PubKey(toByteString(publicKey))

      return new PersonalInterest(pubKey, toByteString(topic, true))

    }
}
