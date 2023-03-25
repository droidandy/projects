import { components } from 'testIDs';

const ADDRESS_MODAL = components.AddressModal.container;
const ADDRESS_MODAL_CLOSE = `${ADDRESS_MODAL}/close`;
const ADDRESS_INPUT = components.AddressModal.input;
const ADDRESSES_LIST = components.AddressModal.list;
const FIRST_ADDRESS_IN_LIST = `${ADDRESSES_LIST}[0]`;

export async function selectAddress({ selector, address = {}, skipCheck = false }) {
  await this.expectForVisible(selector);
  await this.click(selector);

  await this.waitForVisible(ADDRESS_MODAL);
  await this.expectForVisible(ADDRESS_MODAL);
  this.t.pass('Address modal was opened');

  await this.clearInput(ADDRESS_INPUT);
  await this[this.getPlatform() === 'ios' ? 'setValue' : 'replaceValue'](ADDRESS_INPUT, address.search, true);

  await this.click(ADDRESS_MODAL);

  this.t.pass('Address was filled');

  await this[this.getPlatform() === 'ios' ? 'expectForVisible' : 'waitForVisible'](ADDRESSES_LIST);
  await this.expectForVisible(FIRST_ADDRESS_IN_LIST);

  this.t.pass('Addresses list was loaded');

  await this.waitForClickText(address.searchLabel);
  this.t.pass('Address was selected');


  if (!skipCheck) {
    await this.expectForVisible(selector);
    await this.expectForVisible(`${selector}/value`);
    await this.toHaveText(`${selector}/value`, address.name, 'Address was set');
  }
}

export async function openModalWithoutEditing({ selector, address = {} }) {
  await this.expectForVisible(selector);
  await this.click(selector);

  await this.waitForVisible(ADDRESS_MODAL);
  await this.expectForVisible(ADDRESS_MODAL);
  this.t.pass('Address modal was opened');

  await this.click(ADDRESS_MODAL_CLOSE);
  await this.waitForVisible(ADDRESS_MODAL, 5000, true);
  await this.expectForVisible(ADDRESS_MODAL, true);

  this.t.pass('Address modal was closed');

  await this.expectForVisible(selector);
  await this.expectForVisible(`${selector}/value`);
  await this.toHaveText(`${selector}/value`, address.name, "Address wasn't updated");
}
