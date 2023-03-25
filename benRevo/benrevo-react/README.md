<img src="https://github.com/benrevo/benrevo-react/blob/develop/docs/static/officeLogo.png?raw=true" alt="react boilerplate banner" align="center" />

<br />
<br />

<div align="center"><strong>A SIMPLE QUOTING SOLUTION, ALL IN THE CLOUD</strong></div>

<br />

Note:  Badges are currently disabled while I consider sharing this private repo with the dependency checker via GitHub Oauth.
<div align="center">
  <!-- devDependency Status -->
  Development dependency status
  <a href="https://david-dm.org/benrevo/benrevo-react/develop#info=devDependencies">
    <img src="https://david-dm.org/benrevo/benrevo-react/develop/dev-status.svg" alt="devDependency Status" />
  </a>
  <br />

  <!-- Dependency Status -->
  Production dependency status
  <a href="https://david-dm.org/benrevo/benrevo-react/develop">
    <img src="https://david-dm.org/benrevo/benrevo-react/develop.svg" alt="Dependency Status" />
  </a>

  <br />

  <!-- Build Status -->
  Development branch build status
  <a href="https://travis-ci.com/BenRevo/benrevo-react">
    <img src="https://travis-ci.com/BenRevo/benrevo-react.svg?token=n7ddcyS7GRPe1MQPTVpH&branch=develop" alt="Build Status" />
  </a>
  <br />

  Production branch build status
  <a href="https://travis-ci.com/BenRevo/benrevo-react">
    <img src="https://travis-ci.com/BenRevo/benrevo-react.svg?token=n7ddcyS7GRPe1MQPTVpH&branch=master" alt="Build Status" />
  </a>
  <br />

  <!-- Test Coverage -->
  Development branch coverage
  <a href="https://coveralls.io/github/BenRevo/benrevo-react?branch=develop">
    <img src="https://coveralls.io/repos/github/BenRevo/benrevo-react/badge.svg?branch=develop&t=0BqZo2" alt="Build Status" />
  </a>
  <br />

  Production branch coverage
  <a href="https://coveralls.io/github/BenRevo/benrevo-react?branch=master">
    <img src="https://coveralls.io/repos/github/BenRevo/benrevo-react/badge.svg?branch=master&t=0BqZo2" alt="Build Status" />
  </a>
 </div>

<br />

## Features

<dl>
  <dt>Quick scaffolding</dt>
  <dd>Create components, containers, routes, selectors and sagas - and their tests - right from the CLI!</dd>

  <dt>Instant feedback</dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes to the CSS and JS are reflected instantaneously without refreshing the page. Preserve application state even when you update something in the underlying code!</dd>

  <dt>Predictable state management</dt>
  <dd>Unidirectional data flow allows for change logging and time travel debugging.</dd>

  <dt>Next generation JavaScript</dt>
  <dd>Use template strings, object destructuring, arrow functions, JSX syntax and more, today.</dd>

  <dt>Next generation CSS</dt>
  <dd>Write composable CSS that's co-located with your components for complete modularity. Unique generated class names keep the specificity low while eliminating style clashes. Ship only the styles that are on the page for the best performance.</dd>

  <dt>Industry-standard routing</dt>
  <dd>It's natural to want to add pages (e.g. `/about`) to your application, and routing makes this possible.</dd>

  <dt>Industry-standard i18n internationalization support</dt>
  <dd>Scalable apps need to support multiple languages, easily add and support multiple languages with `react-intl`.</dd>

  <dt>Offline-first</dt>
  <dd>The next frontier in performant web apps: availability without a network connection from the instant your users load the app.</dd>

  <dt>SEO</dt>
  <dd>We support SEO (document head tags management) for search engines that support indexing of JavaScript content. (eg. Google)</dd>
</dl>

But wait... there's more!

  - *The best test setup:* Automatically guarantee code quality and non-breaking
    changes. (Seen a react app with 99% test coverage before?)
  - *Native web app:* Your app's new home? The home screen of your users' phones.
  - *The fastest fonts:* Say goodbye to vacant text.
  - *Stay fast*: Profile your app's performance from the comfort of your command
    line!
  - *Catch problems:* AppVeyor and TravisCI setups included by default, so your
    tests get run automatically on Windows and Unix.

There’s also a <a href="https://vimeo.com/168648012">fantastic video</a> on how to structure your React.js apps with scalability in mind. It provides rationale for the majority of this project's design decisions.

## Quick start

1. Clone this repo using `git clone --depth=1 https://github.com/benrevo/benrevo-react.git`
1. Run `npm install` to install dependencies.<br />
   *We auto-detect `yarn` for installing packages by default, if you wish to force `npm` usage do: `USE_YARN=false npm run setup`*<br />
1. Run `npm run bootstrap` to setup css dependencies.<br />
1. Create a .env file for anthem and/or uhc directories in the packages directory
1. Change directory into either directory `cd packages/benrevo-react-anthem` (or `cd packages/benrevo-react-uhc`)
1. Run `npm start` to see the example app at `http://localhost:3010`.
1. If you want to use the remote API server, you'll need to map your local IP address to 'local.benrevo.com' and launch your dev app from there.  (hint:  /etc/hosts)

Now you're ready to rumble!

> Please note that this code is **production-ready and not meant for beginners**! If you're just starting out with react or redux, please refer to https://github.com/petehunt/react-howto instead. This is a solid, battle-tested codebase.

## Documentation

- [**The Hitchhikers Guide to `benrevo-react`**](docs/general/introduction.md): An introduction for newcomers to this project.
- [GitFlow](docs/gitflow): The gitflow branching strategy for this project.  <strong>This is required reading before you commit any code.</strong>
- [Creating an account and test users](docs/accounts): You need to get an account setup before you start developing and testing.
- [Overview](docs/general): A short overview of the included tools
- [**Commands**](docs/general/commands.md): Some specific commands on the CLI
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.
- [BenRevo Wiki](https://github.com/BenRevo/benrevo-document-repo/wiki): Internal wiki containing buisness and product related documentaiton

## Boilerplate starting point.

This project would not be possible without the guys who created [react-boilerplate](http://github.com/react-boilerplate/react-boilerplate).  That's also the first place you should go with issues, PRs, or to merge upstream code.  react-boilerplate has an [MIT license](https://raw.githubusercontent.com/react-boilerplate/react-boilerplate/master/LICENSE.md).
