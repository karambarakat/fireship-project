import puppeteer, {Page} from "puppeteer";

/**
 * Scrapes the USCIS website for the current status of the case
 */
export default async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const numbers = process.env.CASE_RECEIPT_NUMBERS?.split(",") || [];
  const results : (string | object)[]= [];

  for (const number of numbers) {
    const res = await getStatus(page, number);
    results.push(res || {});
  }

  await browser.close();

  return results;
}

/**
 *
 * @param {Page} page
 * @param {string} receiptNumber
 */
async function getStatus(page: Page, receiptNumber: string) {
  await page.goto("https://egov.uscis.gov/");

  await page.type("#receipt_number", receiptNumber);

  await page.click("button[name=\"initCaseSearch\"]");

  const s = ".caseStatusSection #landing-page-header + p";
  await page.waitForSelector(s);

  return await page.evaluate(() => {
    const statusElement = document.querySelector(s);
    return statusElement?.textContent?.trim();
  });
}
