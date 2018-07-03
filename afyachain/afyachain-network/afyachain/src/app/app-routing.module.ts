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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { TokenComponent } from './Token/Token.component';
import { BrandComponent } from './Brand/Brand.component';
import { BatchComponent } from './Batch/Batch.component';
import { UnitComponent } from './Unit/Unit.component';

import { ChainParticipantComponent } from './ChainParticipant/ChainParticipant.component';

import { DispatchBatchComponent } from './DispatchBatch/DispatchBatch.component';
import { SplitBatchComponent } from './SplitBatch/SplitBatch.component';
import { SellUnitComponent } from './SellUnit/SellUnit.component';
import { VerifyBatchComponent } from './VerifyBatch/VerifyBatch.component';
import { ReceiveBatchComponent } from './ReceiveBatch/ReceiveBatch.component';
import { VerifyUnitComponent } from './VerifyUnit/VerifyUnit.component';
import { ReceiveUnitComponent } from './ReceiveUnit/ReceiveUnit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Token', component: TokenComponent },
  { path: 'Brand', component: BrandComponent },
  { path: 'Batch', component: BatchComponent },
  { path: 'Unit', component: UnitComponent },
  { path: 'ChainParticipant', component: ChainParticipantComponent },
  { path: 'DispatchBatch', component: DispatchBatchComponent },
  { path: 'SplitBatch', component: SplitBatchComponent },
  { path: 'SellUnit', component: SellUnitComponent },
  { path: 'VerifyBatch', component: VerifyBatchComponent },
  { path: 'ReceiveBatch', component: ReceiveBatchComponent },
  { path: 'VerifyUnit', component: VerifyUnitComponent },
  { path: 'ReceiveUnit', component: ReceiveUnitComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
