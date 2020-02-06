const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (request, response) => {
	try {
		const {
			url = 'https://chhap.glitch.me',
			type = 'png',
			size,
			device = 'iPhone XR',
			encoding = 'binary'
		} = request.query;

		const urlWithProtocol = url.startsWith('http') ? url : 'https://' + url;
		const browser = await puppeteer.launch({
			args: chrome.args,
			executablePath: await chrome.executablePath,
			headless: chrome.headless
		});

		const deviceProfile = puppeteer.devices[device];

		const page = await browser.newPage();

		if (deviceProfile) {
			await page.emulate(deviceProfile);
		}

		const viewport = {
			...page.viewport()
		};

		let fullPage = true;

		if (size) {
			const [width, height] = size.split(',').map(item => Number(item));
			if (!(isFinite(width) && isFinite(height))) {
				return response
					.status(400)
					.send('Malformed size parameter. Example: ?size=800,600');
			}
			viewport.width = width;
			viewport.height = height;

			fullPage = false;
		}

		await page.setViewport(viewport);
		await page.goto(urlWithProtocol, { waitUntil: 'networkidle0' });

		const options = {
			fullPage: false,
			type,
			encoding
		};
		options.clip = {
			x: 0,
			y: 0,
			width: viewport.width,
			height: viewport.height
		};

		response.statusCode = 200;
		const screenshot = await page.screenshot(options);
		if (encoding === 'base64') {
			console.log('encoding', encoding);
			const data = Buffer.from(screenshot, 'base64');

			response.setHeader('Content-Length', data.length);

			response.send(data);
		} else {
			response.setHeader('Content-Type', `image/${type}`);
			response.send(screenshot);
		}

		await browser.close();
	} catch (error) {
		response.status(503).end(error.message);
	}
};
