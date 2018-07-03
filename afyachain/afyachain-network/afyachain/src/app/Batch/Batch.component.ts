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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BatchService } from './Batch.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-batch',
  templateUrl: './Batch.component.html',
  styleUrls: ['./Batch.component.css'],
  providers: [BatchService]
})
export class BatchComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  code = new FormControl('', Validators.required);
  brand = new FormControl('', Validators.required);
  token = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  units = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  tempOwner = new FormControl('', Validators.required);
  parentBatch = new FormControl('', Validators.required);
  created = new FormControl('', Validators.required);
  updated = new FormControl('', Validators.required);

  constructor(private serviceBatch: BatchService, fb: FormBuilder) {
    this.myForm = fb.group({
      code: this.code,
      brand: this.brand,
      token: this.token,
      expiryDate: this.expiryDate,
      units: this.units,
      owner: this.owner,
      tempOwner: this.tempOwner,
      parentBatch: this.parentBatch,
      created: this.created,
      updated: this.updated
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceBatch.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.afyachain.Batch',
      'code': this.code.value,
      'brand': this.brand.value,
      'token': this.token.value,
      'expiryDate': this.expiryDate.value,
      'units': this.units.value,
      'owner': this.owner.value,
      'tempOwner': this.tempOwner.value,
      'parentBatch': this.parentBatch.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    this.myForm.setValue({
      'code': null,
      'brand': null,
      'token': null,
      'expiryDate': null,
      'units': null,
      'owner': null,
      'tempOwner': null,
      'parentBatch': null,
      'created': null,
      'updated': null
    });

    return this.serviceBatch.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'code': null,
        'brand': null,
        'token': null,
        'expiryDate': null,
        'units': null,
        'owner': null,
        'tempOwner': null,
        'parentBatch': null,
        'created': null,
        'updated': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.afyachain.Batch',
      'brand': this.brand.value,
      'token': this.token.value,
      'expiryDate': this.expiryDate.value,
      'units': this.units.value,
      'owner': this.owner.value,
      'tempOwner': this.tempOwner.value,
      'parentBatch': this.parentBatch.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    return this.serviceBatch.updateAsset(form.get('code').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceBatch.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceBatch.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'code': null,
        'brand': null,
        'token': null,
        'expiryDate': null,
        'units': null,
        'owner': null,
        'tempOwner': null,
        'parentBatch': null,
        'created': null,
        'updated': null
      };

      if (result.code) {
        formObject.code = result.code;
      } else {
        formObject.code = null;
      }

      if (result.brand) {
        formObject.brand = result.brand;
      } else {
        formObject.brand = null;
      }

      if (result.token) {
        formObject.token = result.token;
      } else {
        formObject.token = null;
      }

      if (result.expiryDate) {
        formObject.expiryDate = result.expiryDate;
      } else {
        formObject.expiryDate = null;
      }

      if (result.units) {
        formObject.units = result.units;
      } else {
        formObject.units = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.tempOwner) {
        formObject.tempOwner = result.tempOwner;
      } else {
        formObject.tempOwner = null;
      }

      if (result.parentBatch) {
        formObject.parentBatch = result.parentBatch;
      } else {
        formObject.parentBatch = null;
      }

      if (result.created) {
        formObject.created = result.created;
      } else {
        formObject.created = null;
      }

      if (result.updated) {
        formObject.updated = result.updated;
      } else {
        formObject.updated = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'code': null,
      'brand': null,
      'token': null,
      'expiryDate': null,
      'units': null,
      'owner': null,
      'tempOwner': null,
      'parentBatch': null,
      'created': null,
      'updated': null
      });
  }

}
