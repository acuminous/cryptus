const { EOL, } = require('os');
const { Harness, Suite, SpecReporter, } = require('zunit');

const suite = new Suite('Rascal').discover();
const harness = new Harness(suite);

const interactive = String(process.env.CI).toLowerCase() !== 'true';
const reporter = new SpecReporter({ colours: interactive, });

harness.run(reporter, { timeout: 20000 }).then((report) => {
  if (report.failed) process.exit(1);
  if (report.incomplete) {
    console.log(`One or more tests were not run!${EOL}`);
    process.exit(2);
  }
});
