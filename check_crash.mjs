import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER CONSOLE ERROR:', msg.text());
      } else {
        console.log('BROWSER CONSOLE:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('BROWSER UNCAUGHT ERROR:', error.message);
    });

    console.log('Navigating to http://localhost:5174/ ...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log('Navigating to /security ...');
    await page.goto('http://localhost:5174/security', { waitUntil: 'networkidle0', timeout: 10000 });

    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
    process.exit(1);
  }
})();
