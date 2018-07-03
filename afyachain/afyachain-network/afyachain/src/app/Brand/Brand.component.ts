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
import { BrandService } from './Brand.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-brand',
  templateUrl: './Brand.component.html',
  styleUrls: ['./Brand.component.css'],
  providers: [BrandService]
})
export class BrandComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  brandId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  mainIngredient = new FormControl('', Validators.required);
  ingredients = new FormControl('', Validators.required);
  batches = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  created = new FormControl('', Validators.required);
  updated = new FormControl('', Validators.required);

  constructor(private serviceBrand: BrandService, fb: FormBuilder) {
    this.myForm = fb.group({
      brandId: this.brandId,
      name: this.name,
      mainIngredient: this.mainIngredient,
      ingredients: this.ingredients,
      batches: this.batches,
      owner: this.owner,
      created: this.created,
      updated: this.updated
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceBrand.getAll()
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
      $class: 'org.afyachain.Brand',
      'brandId': this.brandId.value,
      'name': this.name.value,
      'mainIngredient': this.mainIngredient.value,
      'ingredients': this.ingredients.value,
      'batches': this.batches.value,
      'owner': this.owner.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    this.myForm.setValue({
      'brandId': null,
      'name': null,
      'mainIngredient': null,
      'ingredients': null,
      'batches': null,
      'owner': null,
      'created': null,
      'updated': null
    });

    return this.serviceBrand.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'brandId': null,
        'name': null,
        'mainIngredient': null,
        'ingredients': null,
        'batches': null,
        'owner': null,
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
      $class: 'org.afyachain.Brand',
      'name': this.name.value,
      'mainIngredient': this.mainIngredient.value,
      'ingredients': this.ingredients.value,
      'batches': this.batches.value,
      'owner': this.owner.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    return this.serviceBrand.updateAsset(form.get('brandId').value, this.asset)
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

    return this.serviceBrand.deleteAsset(this.currentId)
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

    return this.serviceBrand.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'brandId': null,
        'name': null,
        'mainIngredient': null,
        'ingredients': null,
        'batches': null,
        'owner': null,
        'created': null,
        'updated': null
      };

      if (result.brandId) {
        formObject.brandId = result.brandId;
      } else {
        formObject.brandId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.mainIngredient) {
        formObject.mainIngredient = result.mainIngredient;
      } else {
        formObject.mainIngredient = null;
      }

      if (result.ingredients) {
        formObject.ingredients = result.ingredients;
      } else {
        formObject.ingredients = null;
      }

      if (result.batches) {
        formObject.batches = result.batches;
      } else {
        formObject.batches = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'brandId': null,
      'name': null,
      'mainIngredient': null,
      'ingredients': null,
      'batches': null,
      'owner': null,
      'created': null,
      'updated': null
      });
  }

}
