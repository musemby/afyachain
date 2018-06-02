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

const factory = getFactory();
const biznet = 'org.afyachain';

// dispatch a batch from one participant to another
async function dispatchBatch(dispatchBatchTx) {
    let batch = dispatchBatchTx.batch;
    let recipient = dispatchBatchTx.recipient;
    let dispatchedOn = dispatchBatchTx.dispatchedOn;

    // TODO: Add validations

    batch.tempOwner = recipient;
    batch.updated = dispatchedOn
    let assetRegistry = await getAssetRegistry('org.afyachain.Batch');
    await assetRegistry.update(batch);
}

// sell a unit
await function sellUnit(sellUnitTx) {
    let unit = sellUnitTx.unit;
    let soldOn = sellUnitTx.soldOn;

    unit.sold = true;
    let assetRegistry = await getAssetRegistry(biznet + '.Unit');
    await assetRegistry.update(unit)
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