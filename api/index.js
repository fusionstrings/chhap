const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (request, response) => {
    try {
        const { url = 'https://chhap.glitch.me' } = request.query;

        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless
        });
        const page = await browser.newPage();
        await page.goto(url);
        response.type('png').send(await page.screenshot());
        await browser.close();
    } catch (error) {
        response.status(503).end(error.message);
    }
};
