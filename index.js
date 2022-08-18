const puppeteer = require("puppeteer");
const ScreenshotTester = require("puppeteer-screenshot-tester");
const yargs = require("yargs");
const path = require("path");
const fs = require("fs/promises");

const test = async () => {
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  const tester = await ScreenshotTester(
    0.8,
    false,
    false,
    [],
    {
      transparency: 0.5,
    },
    { compressionLevel: 8 }
  );
  // setting up puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(yargs.argv.path, {
    waitUntil: "networkidle0",
  });
  // await page.('input[title="Search"]', "Hello", { delay: 100 });
  // call our tester with browser page returned by puppeteer browser
  // second parameter is optional it's just a test name if provide that's filename
  const result = await tester(
    page,
    path.join("screenshots", encodeURIComponent(yargs.argv.path)),
    {
      fullPage: true,
    }
  );
  await browser.close();
  console.log(result);
};

test();
