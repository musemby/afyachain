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
import { ChainParticipantService } from './ChainParticipant.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-chainparticipant',
  templateUrl: './ChainParticipant.component.html',
  styleUrls: ['./ChainParticipant.component.css'],
  providers: [ChainParticipantService]
})
export class ChainParticipantComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  participantId = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  location = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  created = new FormControl('', Validators.required);
  updated = new FormControl('', Validators.required);


  constructor(private serviceChainParticipant: ChainParticipantService, fb: FormBuilder) {
    this.myForm = fb.group({
      participantId: this.participantId,
      type: this.type,
      name: this.name,
      location: this.location,
      phoneNumber: this.phoneNumber,
      email: this.email,
      created: this.created,
      updated: this.updated
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceChainParticipant.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.afyachain.ChainParticipant',
      'participantId': this.participantId.value,
      'type': this.type.value,
      'name': this.name.value,
      'location': this.location.value,
      'phoneNumber': this.phoneNumber.value,
      'email': this.email.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    this.myForm.setValue({
      'participantId': null,
      'type': null,
      'name': null,
      'location': null,
      'phoneNumber': null,
      'email': null,
      'created': null,
      'updated': null
    });

    return this.serviceChainParticipant.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'participantId': null,
        'type': null,
        'name': null,
        'location': null,
        'phoneNumber': null,
        'email': null,
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.afyachain.ChainParticipant',
      'type': this.type.value,
      'name': this.name.value,
      'location': this.location.value,
      'phoneNumber': this.phoneNumber.value,
      'email': this.email.value,
      'created': this.created.value,
      'updated': this.updated.value
    };

    return this.serviceChainParticipant.updateParticipant(form.get('participantId').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceChainParticipant.deleteParticipant(this.currentId)
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

    return this.serviceChainParticipant.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'participantId': null,
        'type': null,
        'name': null,
        'location': null,
        'phoneNumber': null,
        'email': null,
        'created': null,
        'updated': null
      };

      if (result.participantId) {
        formObject.participantId = result.participantId;
      } else {
        formObject.participantId = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.location) {
        formObject.location = result.location;
      } else {
        formObject.location = null;
      }

      if (result.phoneNumber) {
        formObject.phoneNumber = result.phoneNumber;
      } else {
        formObject.phoneNumber = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
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
      'participantId': null,
      'type': null,
      'name': null,
      'location': null,
      'phoneNumber': null,
      'email': null,
      'created': null,
      'updated': null
    });
  }
}
