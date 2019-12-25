
const puppeteer = require('puppeteer');

module.exports = async (request, response)=> {
  try {
    const {url = 'https://chhap.glitch.me'} = request.query;
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    response.type('png').send(await page.screenshot());
    await browser.close();
  } catch (error) {
    response.status(503).end(error.message);
  }
}