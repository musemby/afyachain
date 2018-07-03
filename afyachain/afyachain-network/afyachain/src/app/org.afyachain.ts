import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.afyachain{
   export enum participantType {
      MANUFACTURER,
      SUPPLIER,
      RETAILER,
   }
   export class ChainParticipant extends Participant {
      participantId: string;
      type: participantType;
      name: string;
      location: string;
      phoneNumber: string;
      email: string;
      created: Date;
      updated: Date;
   }
   export class Token extends Asset {
      code: string;
      created: Date;
      updated: Date;
   }
   export class Brand extends Asset {
      brandId: string;
      name: string;
      mainIngredient: string;
      ingredients: string[];
      batches: Batch[];
      owner: ChainParticipant;
      created: Date;
      updated: Date;
   }
   export class Batch extends Asset {
      code: string;
      brand: Brand;
      token: Token;
      expiryDate: Date;
      units: Unit[];
      owner: ChainParticipant;
      tempOwner: ChainParticipant;
      parentBatch: Batch;
      created: Date;
      updated: Date;
   }
   export class Unit extends Asset {
      code: string;
      ownerIds: string[];
      sold: boolean;
      batch: Batch;
      tempOwner: ChainParticipant;
      owner: ChainParticipant;
      created: Date;
      updated: Date;
   }
   export class DispatchBatch extends Transaction {
      batch: Batch;
      recipient: ChainParticipant;
      dispatchedOn: Date;
   }
   export class SplitBatch extends Transaction {
      parentBatch: Batch;
      quantity: number;
   }
   export class SellUnit extends Transaction {
      unit: Unit;
      soldOn: Date;
   }
   export class VerifyBatch extends Transaction {
      code: string;
      verifiedOn: Date;
   }
   export class ReceiveBatch extends Transaction {
      batch: Batch;
      receivedOn: Date;
   }
   export class VerifyUnit extends Transaction {
      code: string;
      verifiedOn: Date;
   }
   export class ReceiveUnit extends Transaction {
      unit: Unit;
      receivedOn: Date;
   }
// }
