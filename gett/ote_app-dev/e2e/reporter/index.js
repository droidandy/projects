const chalk = require('chalk');
const figures = require('figures');
const Duplexer = require('duplexer');
const Through = require('through2');
const Parser = require('tap-parser');
const moment = require('moment-timezone');

const INDENT = '  ';
const FIG_TICK = figures.tick;
const FIG_CROSS = figures.cross;

module.exports = function createReporter(callback) {
  const output = Through.obj();
  const p = new Parser();
  const stream = Duplexer(p, output);

  const startedAt = Date.now();
  let currentPlan = -1;
  let currentAssertion = -1;
  let tests = [];
  let plan = null;
  const startTime = Date.now();
  let currentTime = Date.now();
  let statusTests = true;

  const println = (input = '', indentLevel = 0) => {
    let indent = '';

    for (let i = 0; i < indentLevel; i += 1) {
      indent += INDENT;
    }

    input.split('\n').forEach((line) => {
      output.push(`${indent}${line}`);
      output.push('\n');
    });
  };

  const printTime = (time, type) => {
    if (type === 'passed') {
      println(chalk.green(`${time} - (${type})`), 1);
    } else {
      println(chalk.red(`${time} - (${type})`), 1);
    }
  };

  const handleTest = (name) => {
    println();
    println(chalk.blue(name), 1);
  };

  const handleAssertSuccess = ({ name }) => {
    println(`${chalk.green(FIG_TICK)}  ${chalk.dim(name)}`, 2);
  };

  const handleAssertFailure = ({ name, diag }) => {
    const printMessage = diag.stack ? diag.stack.split('Hierarchy:')[0] : name;
    println(`${chalk.red(FIG_CROSS)}  ${chalk.red(printMessage)}`, 2);
    printTime(moment(Date.now() - currentTime).format('mm:ss'), 'failed');
  };

  const handleComplete = function handleComplete(result) {
    const report = result;
    report.time = Date.now() - startTime;
    const finishedAt = Date.now();

    // last passed test
    if (result.ok) {
      printTime(moment(finishedAt - currentTime).format('mm:ss'), 'passed');
    }

    println();
    println(chalk.green(`passed: ${result.pass}  `) +
      chalk.red(`failed: ${result.fail || 0}  `) +
      chalk.white(`of ${result.count} tests  `) +
      chalk.dim(moment(finishedAt - startedAt).format('mm:ss')));
    println();

    if (result.ok) {
      println(chalk.green(`All of ${result.count} tests passed!`));
    }

    println();

    plan = -1;

    // combine and clean up tests
    for (let i = 0; i < tests.length; i += 1) {
      // trims the name from having any extra new line breaks
      tests[i].name = tests[i].name.trim();

      // This is a top level plan
      if (tests[i].assertions.length === 0) {
        // move on with the tests
        plan = i;
        tests[plan].tests = [];
        delete tests[i].assertions;
      } else if (plan === -1) {
        // this is flat plan that has no parent do nothing
      } else {
        // We know this is part of the currentPlan
        if (!tests[plan]) {
          tests[plan] = {
            tests: []
          };
        } else {
          tests[plan].tests = tests[plan].tests || [];
        }

        tests[plan].tests.push(tests[i]);
        delete tests[i];
      }
    }

    tests = tests.filter(d => d > '');

    const calculateTime = (test) => {
      if (test.end) {
        return test;
      }

      const { end } = test.assertions[test.assertions.length - 1];

      const assertions = test.assertions.map(assertion => ({
        ...assertion,
        start: test.start
      }));

      return {
        ...test,
        assertions,
        end
      };
    };

    report.tests = tests.map((test) => {
      if (test.tests && test.tests.length === 0) {
        // this is an empty test
        return {
          ...test,
          end: test.start
        };
      }

      if (test.tests && test.tests.length > 0) {
        const multipleTests = test.tests.map(calculateTime);

        return {
          ...test,
          tests: multipleTests,
          end: multipleTests[multipleTests.length - 1].end
        };
      }

      return calculateTime(test);
    });

    callback(report);
  };

  p.on('plan', (result) => {
    plan = result;
  });

  p.on('comment', (result) => {
    if (!plan) {
      tests.push({
        type: 'test',
        name: result,
        start: Date.now(),
        assertions: []
      });
    }

    currentPlan += 1;
    currentAssertion = -1;

    const trimmed = result.replace('# ', '').trim();

    if (/^tests\s+[0-9]+$/.test(trimmed)) {
      return;
    }

    if (/^pass\s+[0-9]+$/.test(trimmed)) {
      return;
    }

    if (/^fail\s+[0-9]+$/.test(trimmed)) {
      return;
    }

    if (/^ok$/.test(trimmed)) {
      return;
    }

    if (statusTests) {
      if (tests.length > 1) {
        printTime(moment(Date.now() - currentTime).format('mm:ss'), 'passed');
      }

      handleTest(trimmed);
    }

    currentTime = Date.now();
  });

  p.on('assert', (result) => {
    tests[currentPlan].assertions.push({
      type: 'assert',
      number: result.id,
      name: result.name,
      ok: result.ok,
      diag: result.diag,
      console: '',
      end: Date.now()
    });
    currentAssertion += 1;

    if (result.ok && statusTests) {
      handleAssertSuccess(result);
    } else {
      if (statusTests) {
        handleAssertFailure(result);
      }
      statusTests = false;
    }
  });

  p.on('complete', handleComplete);

  p.on('extra', (result) => {
    println(chalk.yellow((`${result}`).replace(/\n$/, '')), 4);

    if (tests && currentPlan > 0 && currentAssertion > 0) {
      tests[currentPlan].assertions[currentAssertion].console += `${result}\n`;
    }
  });

  return stream;
};
