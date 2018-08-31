'use strict';

const biznet = 'org.afyachain';
var currentParticipant = getCurrentParticipant();

// const SECRET_PHRASE = "tEsYvQrANMcaoEhJQtGaHHTkxaMXLxMJCJZyfEAUxLobescpwvqRYftMxehonrPSjzaAVXLuWcrNDCRHdeGDXLOHhNXWpjZZtDCZbcaebmNgCaLxpvaDyMECVVeaUFDDVCqTmguvcvHMFCYnWlELrJ";
const SEED = "FbooNFTdVbfAETPHKwwgJFRSu";
let SEQUENCE_NUMBER = 341;

// this is sinful AF but had to be done
function sha1(msg) {
    function rotl(n, s) { return n << s | n >>> 32 - s; };
    function tohex(i) { for (var h = "", s = 28; ; s -= 4) { h += (i >>> s & 0xf).toString(16); if (!s) return h; } };
    var H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0, M = 0x0ffffffff;
    var i, t, W = new Array(80), ml = msg.length, wa = new Array();
    msg += String.fromCharCode(0x80);
    while (msg.length % 4) msg += String.fromCharCode(0);
    for (i = 0; i < msg.length; i += 4) wa.push(msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3));
    while (wa.length % 16 != 14) wa.push(0);
    wa.push(ml >>> 29), wa.push((ml << 3) & M);
    for (var bo = 0; bo < wa.length; bo += 16) {
        for (i = 0; i < 16; i++) W[i] = wa[bo + i];
        for (i = 16; i <= 79; i++) W[i] = rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        var A = H0, B = H1, C = H2, D = H3, E = H4;
        for (i = 0; i <= 19; i++) t = (rotl(A, 5) + (B & C | ~B & D) + E + W[i] + 0x5A827999) & M, E = D, D = C, C = rotl(B, 30), B = A, A = t;
        for (i = 20; i <= 39; i++) t = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & M, E = D, D = C, C = rotl(B, 30), B = A, A = t;
        for (i = 40; i <= 59; i++) t = (rotl(A, 5) + (B & C | B & D | C & D) + E + W[i] + 0x8F1BBCDC) & M, E = D, D = C, C = rotl(B, 30), B = A, A = t;
        for (i = 60; i <= 79; i++) t = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & M, E = D, D = C, C = rotl(B, 30), B = A, A = t;
        H0 = H0 + A & M; H1 = H1 + B & M; H2 = H2 + C & M; H3 = H3 + D & M; H4 = H4 + E & M;
    }
    return tohex(H0) + tohex(H1) + tohex(H2) + tohex(H3) + tohex(H4);
}

// add python style {}.format to strings
String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a
}

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
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Creates a chain participant (sign up flow)
* @param {org.afyachain.createChainParticipant} tx An instance of createChainParticipant transaction
* @transaction
*/
async function createChainParticipant(tx) {
    let factory = getFactory();
    let hashedPassword = sha1(tx.password);
    let newGuy = factory.newResource('org.afyachain', 'ChainParticipant', tx.email);
    newGuy.type = tx.type;
    newGuy.name = tx.name;
    newGuy.phoneNumber = tx.phoneNumber;
    newGuy.password = hashedPassword;
    newGuy.created = tx.created;
    newGuy.updated = tx.updated;

    let participantRegistry = await getParticipantRegistry('org.afyachain.ChainParticipant');
    await participantRegistry.add(newGuy);
    return newGuy
}


/**
* Authenticate a chain participant (sign in flow)
* @param {org.afyachain.logIn} tx An instance of logIn transaction
* @transaction
*/
async function logIn(tx) {
    let email = tx.email;
    let hashedPassword = sha1(tx.password);

    let participantRegistry = await getParticipantRegistry(biznet + '.ChainParticipant');
    let participant = await participantRegistry.get(email);

    if (participant.password == hashedPassword){
        return participant;
    } else {
        throw new Error('The email or password is incorrect');
    }
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
    token.createdBy = batchTx.user;
    token.updatedBy = batchTx.user;
    
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
    batch.createdBy = batchTx.user;
    batch.updatedBy = batchTx.user;
    
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
        unitToken.createdBy = batchTx.user;
        unitToken.updatedBy = batchTx.user;
        
        await tokenAssetRegistry.add(unitToken);
        
        // create units
        let unit = factory.newResource('org.afyachain', 'Unit', String(unitToken.code));
        unit.batch = batch;
        unit.token = unitToken;
        unit.owner = batchTx.owner;
        unit.created = batchTx.created;
        unit.updated = batchTx.created;
        unit.createdBy = batchTx.user;
        unit.updatedBy = batchTx.user;
        
        unitsToCreate.push(unit);
    }
    
    // update batch with unit
    // update token with unit
    await unitAssetRegistry.addAll(unitsToCreate);
    // update batch with unit
    
    // update token with unit
    
    return batch;
}


/**
 * Creates a batch
* @param {org.afyachain.createBrand} createBrandTx An instance of createBrand transaction
* @transaction
*/
async function createBrand(createBrandTx) {
    let ingredients = createBrandTx.ingredients.split(",");
    let newBrand = {
        brandId: createBrandTx.brandId,
        name: createBrandTx.name,
        mainIngredient: createBrandTx.mainIngredient,
        ingredients: ingredients,
        created: createBrandTx.created,
        updated: createBrandTx.updated,
        createdBy: createBrandTx.user,
        updatedBy: createBrandTx.user,
        owner: createBrandTx.user
    }
    
    let assetRegistry = await getAssetRegistry('org.afyachain.Batch');
    await assetRegistry.add(newBrand);
}


// TODO: Is expiry date determinable beforehand?

/**
 * Dispatches a batch
 * @param {org.afyachain.DispatchBatch} dispatchBatchTx An instance of dispatchBatch transaction
 * @transaction
 */
async function dispatchBatch(dispatchBatchTx) {
    let batch = dispatchBatchTx.batch;
    let recipient = dispatchBatchTx.recipient;
    let dispatchedOn = dispatchBatchTx.dispatchedOn;
    let user = dispatchBatchTx.user;

    let batchUnits = await query('getUnitsByBatch', { batch: batch.toURI()});

    if (batch.owner.toURI() != user.toURI()) {
        throw new Error('The batch does not belong to the current user')
    }

    let req_state = 'infared'
    let new_state = 'infared'
    if (user.type == 'MANUFACTURER') {
        req_state = 'PRODUCED';
        new_state = 'SUPPLIER_DISPATCHED';
    } else if (user.type == 'SUPPLIER') {
        req_state = 'SUPPLIER_RECEIVED';
        new_state = 'RETAILER_DISPATCHED';
    } else {
        throw new Error('Only a MANUFACTURER or SUPPLIER is allowed to dispatch a batch');
    }
    console.log('@debug req_state', req_state)

    if (batch.status != req_state) {
        throw new Error('The batch has to be in {0} status for it to be dispatched.'.format(req_state));
    }

    if (recipient.type == 'MANUFACTURER') {
        throw new Error('A batch cannot be dispatched to a manufacturer')
    }

    if (batchUnits.length == 0) {
        throw new Error('A batch must have some units in it before it can be dispatched')
    }

    batch.tempOwner = recipient;
    batch.updated = dispatchedOn;
    batch.updatedBy = user;
    batch.status = new_state;
    let assetRegistry = await getAssetRegistry('org.afyachain.Batch');
    await assetRegistry.update(batch);
    
    let unitRegistry = await getAssetRegistry('org.afyachain.Unit');
    for (each of batchUnits) {
        each.status = new_state;
        each.tempOwner = recipient;
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
 * Verifies a batch
 * @param {org.afyachain.VerifyBatch} tx An instance of VerifyBatch transaction
 * @transaction
 */
async function verifyBatch(tx) {
    let code = tx.code;
    // TODO: add batch verifying logic
    let verifiedOn = tx.verifiedOn;
    let assetRegistry = await getAssetRegistry(biznet + '.Batch');
    let batch = await assetRegistry.get(code);

    let req_state = 'infared'
    let new_state = 'infared'
    if (tx.user.type == 'SUPPLIER') {
        req_state = 'SUPPLIER_DISPATCHED';
        new_state = 'SUPPLIER_RECEIVED';
    } else if (tx.user.type == 'RETAILER') {
        req_state = 'RETAILER_DISPATCHED';
        new_state = 'RETAILER_RECEIVED';
    } else {
        throw new Error('Only a RETAILER or SUPPLIER is allowed to receive a batch');
    }

    if (batch.status != req_state) {
        throw new Error('This batch has not been dispatched to this user yet');
    }
    if (batch.expiryDate < tx.verifiedOn) {
        throw new Error('This batch is already expired');
    }

    if (batch.tempOwner.toURI() != tx.user.toURI()) {
        throw new Error('This batch has not been dispatched to this user yet');
    }
    batch.owner = tx.user;
    batch.updated = verifiedOn;
    batch.updatedBy = tx.user;
    batch.tempOwner = null;
    batch.status = new_state;RETAILER_DISPATCHED
    await assetRegistry.update(batch);
        
    }

/**
 * Verifies a batch
 * @param {org.afyachain.VerifyUnit} tx An instance of VerifyUnit transaction
 * @transaction
 */
async function verifyUnit(tx) {
    // TODO alert if there are some unconfirmed units that were dispatched
    let unitCode = tx.code;
    let batchCode = tx.batchCode;
    let verifiedOn = tx.verifiedOn;
    let user = tx.user;

    let batchRegistry = await getAssetRegistry(biznet + '.Batch');
    let batch = await batchRegistry.get(batchCode);

    let assetRegistry = await getAssetRegistry(biznet + '.Unit');
    let unit = await assetRegistry.get(unitCode);
    console.log('@debug tempowner', unit.tempOwner.toURI());
    console.log('@debug user', user.toURI());
    if (unit.batch.toURI() != batch.toURI()) {
        throw new Error('This unit was not dispatched as part of this batch');
    }
    if (unit.tempOwner.toURI() != user.toURI()) {
        throw new Error('This unit has not been dispatched to this user yet');
    }

    let new_state = 'infared';
    if (unit.status == 'RETAILER_DISPATCHED') {
        new_state = 'RETAILER_RECEIVED';
    } else if (unit.status == 'SUPPLIER_DISPATCHED') {
        new_state = 'SUPPLIER_RECEIVED';
    }

    unit.status = new_state;
    unit.owner = user;
    unit.tempOwner = null;

    let unitAssetRegistry = await getAssetRegistry(biznet + '.Unit');
    await unitAssetRegistry.update(unit);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            throw new Error("This batch was not intended for this participant");
        }
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