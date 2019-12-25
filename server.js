// server.js
// where your node app starts

// init project
const puppeteer = require('puppeteer');
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});


app.get('/api', async (request, response)=>{
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://developers.google.com/web/tools/puppeteer/');
    response.type('png').send(await page.screenshot());
    await browser.close();
  } catch (error) {
    response.status(503).end(error.message);
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
