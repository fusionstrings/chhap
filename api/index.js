const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (request, response) => {
    try {
        const { url = 'https://chhap.glitch.me', type="png" } = request.query;

        const urlWithProtocol = url.startsWith('http') ? url : 'https://' + url;
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless
        });

        const page = await browser.newPage();
        await page.goto(urlWithProtocol);
        response.statusCode = 200;

        response.setHeader('Content-Type', `image/${type}`);
        response.send(await page.screenshot({ type }));
        await browser.close();
    } catch (error) {
        response.status(503).end(error.message);
    }
};
