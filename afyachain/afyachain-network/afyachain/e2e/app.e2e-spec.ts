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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for afyachain', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be afyachain', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('afyachain');
    })
  });

  it('network-name should be afyachain-network@0.0.1',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('afyachain-network@0.0.1.bna');
    });
  });

  it('navbar-brand should be afyachain',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('afyachain');
    });
  });

  
    it('Token component should be loadable',() => {
      page.navigateTo('/Token');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Token');
      });
    });

    it('Token table should have 4 columns',() => {
      page.navigateTo('/Token');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('Brand component should be loadable',() => {
      page.navigateTo('/Brand');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Brand');
      });
    });

    it('Brand table should have 9 columns',() => {
      page.navigateTo('/Brand');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('Batch component should be loadable',() => {
      page.navigateTo('/Batch');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Batch');
      });
    });

    it('Batch table should have 11 columns',() => {
      page.navigateTo('/Batch');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Unit component should be loadable',() => {
      page.navigateTo('/Unit');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Unit');
      });
    });

    it('Unit table should have 9 columns',() => {
      page.navigateTo('/Unit');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('ChainParticipant component should be loadable',() => {
      page.navigateTo('/ChainParticipant');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ChainParticipant');
      });
    });

    it('ChainParticipant table should have 9 columns',() => {
      page.navigateTo('/ChainParticipant');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('DispatchBatch component should be loadable',() => {
      page.navigateTo('/DispatchBatch');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DispatchBatch');
      });
    });
  
    it('SplitBatch component should be loadable',() => {
      page.navigateTo('/SplitBatch');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SplitBatch');
      });
    });
  
    it('SellUnit component should be loadable',() => {
      page.navigateTo('/SellUnit');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SellUnit');
      });
    });
  
    it('VerifyBatch component should be loadable',() => {
      page.navigateTo('/VerifyBatch');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('VerifyBatch');
      });
    });
  
    it('ReceiveBatch component should be loadable',() => {
      page.navigateTo('/ReceiveBatch');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ReceiveBatch');
      });
    });
  
    it('VerifyUnit component should be loadable',() => {
      page.navigateTo('/VerifyUnit');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('VerifyUnit');
      });
    });
  
    it('ReceiveUnit component should be loadable',() => {
      page.navigateTo('/ReceiveUnit');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ReceiveUnit');
      });
    });
  

});