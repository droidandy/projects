# benrevo-ui-automation
Contains scripts for UI automation: 

- Blue Ocean https://cicd.benrevo.com/blue/organizations/jenkins/BenRevo%2Fbenrevo-ui-automation/branches/
- Jenkinks https://cicd.benrevo.com/job/BenRevo/job/benrevo-ui-automation/job/develop/

For UI test we use this library - `TestCafe` http://devexpress.github.io/testcafe/documentation/getting-started/
- Runs on Windows, MacOS, and Linux
- Set up `npm install -g testcafe`
- Free and open source


### Tests caces:

https://github.com/BenRevo/benrevo-ui-automation/tree/develop/src/tests/smoke
- `login.test.js`
- `rfp.anthem.test.js`
- `rfp.uhc.test.js`

### How to run 

Run command in root directory: (by default run smoke tests on chrome, configure in `package.json` file)

`npm test`

### Resources files for tests: 

- https://github.com/BenRevo/benrevo-ui-automation/tree/develop/src/resources

### Page Model Pattern

-  https://github.com/BenRevo/benrevo-ui-automation/tree/develop/src/pages

##### Without page model:
```javascript
import { Selector } from 'testcafe';

fixture `Login`
    `.page `https://devexpress.github.io/testcafe/example/`;
test('Text typing basics', async t => {
    await t
        .typeText('#login', 'fake_name')
        .typeText('#login', 'Nme', { replace: true })
        .typeText('#login', 'a', { caretPos: 1 })
        .expect(Selector('#developer-name').value).eql('Name');
});
```
##### With page model:
###### page
```javascript 
import { Selector } from 'testcafe';

export default class Page {
    constructor () {
        this.nameInput = Selector('#login');
    }
}

```
###### tests
``` javascript
import Page from './page-model';

const page = new Page();

fixture `My fixture`
    .page `https://devexpress.github.io/testcafe/example/`;

test('Text typing basics', async t => {
    await t
        .typeText(page.nameInput, 'fake_name')
        .typeText(page.nameInput, 'Nme', { replace: true })
        .typeText(page.nameInput, 'a', { caretPos: 1 })
        .expect(page.nameInput.value).eql('Name');
});
```



### Utils clases

 - https://github.com/BenRevo/benrevo-ui-automation/tree/develop/src/utils
