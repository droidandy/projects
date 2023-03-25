export async function recursiveClear(input) {
  await this.clearText(input); // in some cases, you'll need to uncheck Connect Hardware Keyboard for iOS emulator
  try {
    await this.toHaveText(input, '', `${input} was cleared`);
  } catch (e) {
    await this.recursiveClear(input);
  }
}

export async function clearInput(input) {
  await this.waitForClick(input, 5000);
  await this.recursiveClear(input);
}

export async function enterInput(input, value, clickDoneButton = false, typeSlow) {
  await this.clearInput(input);

  await this.setValue(input, value, clickDoneButton, typeSlow);
  await this.toHaveText(input, value, `${input} is correct`);
}
