import { Document } from '../store';

import KeyResolver from 'key-did-resolver';
import { getResolver as getRchainResolver } from "rchain-did-resolver";
import { DID } from 'dids';
import { base64urlToJSON, encodeBase64Url } from 'dids/lib/utils'
import { verifyJWS } from 'did-jwt'
import { encodePayload } from 'dag-jose-utils'

export default async (document: Document, s: string) => {
  const did = new DID({ resolver: { ...await getRchainResolver, ...KeyResolver.getResolver() } })

    const signature = document.signatures[s];
    const kid = base64urlToJSON(signature.protected).kid;

    const res = await did.resolve(kid);
    const doc2 = Object.assign({}, document);
    const included = Object.fromEntries(Object.entries(doc2.signatures).filter(([key, value]) => parseInt(key) < parseInt(s)));
    doc2.signatures = included;

    const { cid } = await encodePayload(doc2);
    const payloadCid = encodeBase64Url(cid.bytes)

    try {
      const signer = verifyJWS( signature.protected + "." + payloadCid + "." + signature.signature, res.publicKey );
      if (signer.id === kid && doc2.scheme && doc2.scheme[s] === signer.id) {
        console.info(s + " Signature valid");
        return true;
      }
    }
    catch(err) {
      console.info(s + " Signature not valid. " + err);
      return false;
    }
    return false;
};