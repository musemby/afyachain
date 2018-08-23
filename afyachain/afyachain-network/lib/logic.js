/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const biznet = 'org.afyachain';
var currentParticipant = getCurrentParticipant();

// const SECRET_PHRASE = "tEsYvQrANMcaoEhJQtGaHHTkxaMXLxMJCJZyfEAUxLobescpwvqRYftMxehonrPSjzaAVXLuWcrNDCRHdeGDXLOHhNXWpjZZtDCZbcaebmNgCaLxpvaDyMECVVeaUFDDVCqTmguvcvHMFCYnWlELrJ";
const SEED = "FbooNFTdVbfAETPHKwwgJFRSu";
let SEQUENCE_NUMBER = 341;


const stringTOASCII = function(value) {
    return value.split('')
                .map(
                    function (char) {
                       return char.charCodeAt(0);
                 })
                .reduce(
                    function (curr, prev) {
                        return prev + curr;
                 });
}


// TODO: Find a sha1 lib to use here
function _generate_code(data, type) {
    if (type === 'Batch') {
        let brand = data.brand;
        let unitCount = data.unitCount;
        let created = data.created;
        let expiryDate = data.expiryDate;

        let RANDOM_CODE = Math.floor(Math.random() * 1000000000);
        let Q = RANDOM_CODE + brand + unitCount + created + expiryDate;
        let randTwo = String(Math.floor(Math.random() * 10000000));
        // let sha = crypto.createHash('sha1');
        // sha.update(Q)
        // let H64 = sha.digest('base64');

        // for(i=0; i<SEQUENCE_NUMBER; i++) {
        //     let ash = crypto.createHash('sha1');
        //     H64 = ash.update(H64);
        // }

        return (stringTOASCII(Q) * stringTOASCII(SEED)) + stringTOASCII(randTwo);
    } else if(type === 'Unit') {
        let batch = data.batch;
        let created = data.created;
        let RANDOM_CODE = Math.floor(Math.random() * 1000000000);

        let Q = RANDOM_CODE + batch + created;
        let randTwo = String(Math.floor(Math.random() * 10000000));

        return (stringTOASCII(Q) * stringTOASCII(SEED)) + stringTOASCII(randTwo);
    }
}


/**
* Creates a token to be used by a batch or a unit
* @param {org.afyachain.createToken} createTokenTx An instance of createToken transaction
* @transaction
*/
async function createToken(createTokenTx) {
    let factory = getFactory();
    let code = _generate_code();
    let token = factory.newResource('org.afyachain', 'Token', String(code));
    token.created = createTokenTx.created;
    token.updated = createTokenTx.updated;

    let assetRegistry = await getAssetRegistry('org.afyachain.Token');
    await assetRegistry.add(token);
    return token
}


/**
* Creates a batch
* @param {org.afyachain.createBatch} createBatchTx An instance of createBatch transaction
* @transaction
*/
async function createBatch(batchTx) {
    // get a code from the generator
    let tokenAssetRegistry = await getAssetRegistry('org.afyachain.Token');
    let batchAssetRegistry = await getAssetRegistry('org.afyachain.Batch');
    let unitAssetRegistry = await getAssetRegistry('org.afyachain.Unit');

    let tokenData = {
        brand: batchTx.brand,
        unitCount: batchTx.unitCount,
        created: batchTx.created,
        expiry: batchTx.expiryDate
    }
    let code = _generate_code(tokenData, 'Batch');

    // create a new Batch token and add it to the registry
    let factory = getFactory();
    let token = factory.newResource('org.afyachain', 'Token', String(code));
    token.created = batchTx.created;
    token.updated = batchTx.created;

    await tokenAssetRegistry.add(token);

    // create a batch using the token and code created above
    let batch = factory.newResource('org.afyachain', 'Batch', token.code);
    batch.brand = batchTx.brand;
    batch.unitCount = batchTx.unitCount;
    batch.manufactureDate = batchTx.manufactureDate;
    batch.expiryDate = batchTx.expiryDate;
    batch.token = token;
    batch.owner = batchTx.owner;
    batch.created = batchTx.created;
    batch.updated = batchTx.created;

    await batchAssetRegistry.add(batch);

    // update token  with new batch
    token.batch = batch;
    tokenAssetRegistry.update(token);

        // CREATE UNITS
    // get a code from the generator
    let unitsToCreate = [];
    for(i=0; i<batchTx.unitCount; i++) {
        let unitTokenData = {
        batch: batch,
        created: batchTx.created
        };

        let unitCode = _generate_code(unitTokenData, 'Unit');
        // create a new Unit token and add it to the registry
        let unitToken = factory.newResource('org.afyachain', 'Token', String(unitCode));
        unitToken.created = batchTx.created;
        unitToken.updated = batchTx.created;

        await tokenAssetRegistry.add(unitToken);

        // create units
        let unit = factory.newResource('org.afyachain', 'Unit', String(unitToken.code));
        unit.batch = batch;
        unit.token = unitToken;
        unit.owner = batchTx.owner;
        unit.created = batchTx.created;
        unit.updated = batchTx.created;

        unitsToCreate.push(unit);
        console.log('@debug i=',i, 'unitCount=', batchTx.unitCount, 'array=', unitsToCreate.length);
        }

        // update batch with unit

        // update token with unit
        console.log('@debug outside for loop: ', unitsToCreate.length);
        await unitAssetRegistry.addAll(unitsToCreate);
        // update batch with unit

        // update token with unit

        return batch;
}

async function createBrand(createBrandTx) {
    let ingredients = createBrandTx.ingredients.split(",");

    let newBrand = {
        brandId: createBrandTx.brandId,
        name: createBrandTx.name,
        mainIngredient: createBrandTx.mainIngredient,
        ingredients: ingredients,
        created: createBrandTx.created,
        updated: createBrandTx.updated,
        owner: getCurrentParticipant().getFullyQualifiedIdentifier()
    }

    let assetRegistry = await getAssetRegistry('org.afyachain.Batch');
    await assetRegistry.add(newBrand);
}


async function generateToken(type) {
    let factory = getFactory();
    let code = Math.floor(Math.random() * 1000000000);
    let token = factory.newResource('org.afyachain', 'Token', String(code));
    token.created = new Date();
    token.updated = new Date();

    let assetRegistry = await getAssetRegistry('org.afyachain.Token');
    await assetRegistry.add(token);
    return token
}


// TODO: Is expiry date determinable beforehand?

// TODO: Create batch transaction - check code is same as token.code

async function currentParticipant() {
    return getCurrentParticipant();
}

/**
* Dispatches a batch
* @param {org.afyachain.DispatchBatch} dispatchBatchTx An instance of dispatchBatch transaction
* @transaction
*/
async function dispatchBatch(dispatchBatchTx) {
    let batch = dispatchBatchTx.batch;
    let recipient = dispatchBatchTx.recipient;
    let dispatchedOn = dispatchBatchTx.dispatchedOn;

    // TODO: Validate only an owner of the current
    // TODO: Validate the batch is not empty
    // TODO: Validate that the recipient is not a MANUFACTURER

    // Validate that the batch is in PRODUCED state
    if (batch.status != 'PRODUCED') {
        throw new Error('The batch has to be in PRODUCED status for it to be dispatched.');
    }

    batch.tempOwner = recipient;
    batch.updated = dispatchedOn;
    batch.status = 'SUPPLIER_DISPATCHED';
    let assetRegistry = await getAssetRegistry('org.afyachain.Batch');
    await assetRegistry.update(batch);

    let unitRegistry = await getAssetRegistry('org.afyachain.Unit');
    let batchUnits = await query('getUnitsByBatch', { batch: batch.toURI()});
    console.log('@debug ', batch.toURI());
    console.log('@debug ', batchUnits.length);
    for (each of batchUnits) {
        each.setPropertyValue('status', 'SUPPLIER_DISPATCHED')
    }

    await unitRegistry.updateAll(batchUnits);
    
}

// sell a unit
async function sellUnit(sellUnitTx) {
    // let unit = sellUnitTx.unit;
    let soldOn = sellUnitTx.soldOn;

    unit.sold = true;
    let assetRegistry = await getAssetRegistry(biznet + '.Unit');
    await assetRegistry.update(unit)
};


/**
* Dispatches a batch
* @param {org.afyachain.VerifyBatch} tx An instance of VerifyBatch transaction
* @transaction
*/
async function verifyBatch(tx) {
    let code = tx.code;
    // TODO: add batch verifying logic
    let verifiedOn = tx.verifiedOn;
    let assetRegistry = await getAssetRegistry(biznet + '.Batch');
    let batch = await assetRegistry.get(code);
    if (batch.status != 'SUPPLIER_DISPATCHED') {
        throw new Error('The batch has not been dispatched to this supplier yet');
    }
    if (batch.expiryDate < tx.verifiedOn) {
        throw new Error('The batch entered is already expired');
    }
    // if (batch.tempOwner != currentParticipant.toURI()) {
    //     throw new Error('The batch has not been dispatched to this supplier yet');
    // }
    batch.owner = currentParticipant.toURI();
    console.log("@debug ", batch.owner);
    batch.tempOwner = null;
    batch.status = 'SUPPLIER_RECEIVED';
    await assetRegistry.update(batch);

}

async function receiveBatch(receiveBatchTx) {
    // TODO: Change ownership of the batch and the status

    let batch = receiveBatchTx.batch;
    let receivedOn = receiveBatchTx.receivedOn;

    if (batch.tempOwner.participantId == currentParticipant.participantId) {
        batch.owner = currentParticipant;
        batch.tempOwner = null;

        let assetRegistry = await getAssetRegistry(biznet + '.Batch');
        assetRegistry.update(batch);
    } else {
        throw new Error("The batch was not intended for this participant");
    }
};

async function verifyUnit(verifyUnitTx) {
    let code = verifyUnitTx.code;
    let verifiedOn = verifyUnitTx.verifiedOn;

    let assetRegistry = await getAssetRegistry(biznet + '.Unit');
    await assetRegistry.get(code);
};

async function receiveUnit(receiveUnitTx) {
    let unit = receiveUnitTx.unit;

    if (unit.tempOwner.participantId == currentParticipant.participantId) {
        unit.owner = currentParticipant;
        unit.tempOwner = null;

        let assetRegistry = await getAssetRegistry(biznet + '.Unit');
        assetRegistry.update(unit);
    } else {
        throw "The unit was not intended for this participant";
    }
}

// split a batch
async function splitBatch(splitBatchTx) {
    parentBatch = splitBatchTx.parentBatch;
    quantity = splitBatchTx.quantity;
    let i = 0
    let newUnits = [];
    for(i;i < quantity; i++) {
        let unit = parentBatch.units[i]
        newUnits.push(unit)
    }
    // now
    let now = new Date();
    now = now.toISOString();

    // TODO: auto incrementing strategy for ids
    let factory = getFactory();
    let subBatch = factory.newAsset('org.afyachain', 'Batch', '67');
    subBatch.parentBatch = parentBatch;
    subBatch.brand = parentBatch.brand;
    subBatch.token = parentBatch.token;
    subBatch.expiryDate = parentBatch.expiryDate;
    subBatch.units = newUnits;
    subBatch.created = now;
    subBatch.updated = now;

    let assetRegistry = await getAssetRegistry(biznet + '.Batch');
    await assetRegistry.add(subBatch);
}

async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.afyachain.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.afyachain', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}