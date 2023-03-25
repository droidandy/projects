import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';

const SCREENSHOT_DIR = `${__dirname}/../screenshots/`;

const SCREENSHOT_OPTIONS = {
  timeout: 5000,
  killSignal: 'SIGKILL'
};

function writeScreenshot(platform, index) {
  const currentDir = `${SCREENSHOT_DIR}${platform}`;
  const screenshotFilename = `${currentDir}/screenshot-${index}.png`;

  if (platform === 'android') {
    const emulatorPath = `/sdcard/screenshot-${index}.png`;
    execSync(`adb shell screencap ${emulatorPath} && adb pull ${emulatorPath} ${currentDir}`);
  } else {
    execSync(`xcrun simctl io booted screenshot ${screenshotFilename}`, SCREENSHOT_OPTIONS);
  }
}

export function takeScreenshot(platform) {
  if (!existsSync(SCREENSHOT_DIR)) {
    mkdirSync(SCREENSHOT_DIR);
    mkdirSync(`${SCREENSHOT_DIR}/android`);
    mkdirSync(`${SCREENSHOT_DIR}/ios`);

    writeScreenshot(platform, 1);
  } else {
    const files = readdirSync(`${SCREENSHOT_DIR}/${platform}`);
    const screenshotIndex = files.length;

    writeScreenshot(platform, screenshotIndex + 1);
  }
}

function clearFilesIn(path) {
  const files = readdirSync(path);

  files.forEach(file => unlinkSync(`${path}/${file}`));
}

export function clearScreenshots() {
  clearFilesIn(`${SCREENSHOT_DIR}/android`);
  clearFilesIn(`${SCREENSHOT_DIR}/ios`);
}
