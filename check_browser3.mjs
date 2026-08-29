import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ executablePath: 'C:\\Users\\shash\\.cache\\puppeteer\\chrome\\win64-151.0.7922.71\\chrome-win64\\chrome.exe' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    
    const requests = [];
    page.on('response', response => {
      requests.push({ url: response.url(), status: response.status() });
    });

    console.log('Navigating to http://localhost:5174/world ...');
    await page.goto('http://localhost:5174/world', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Attempt to log in if redirected
    const currentUrl = page.url();
    if (currentUrl.includes('/')) {
        console.log('Redirected to login. Attempting to log in as FIN001 / demo123...');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
        const loginButton = await page.waitForXPath("//button[contains(., 'LOG IN')]");
        await loginButton.click();
        
        await page.waitForSelector('input[type="text"]');
        await page.type('input[type="text"]', 'FIN001');
        await page.type('input[type="password"]', 'demo123');
        
        const submitButton = await page.waitForXPath("//button[contains(., 'Log In')]");
        await submitButton.click();
        
        console.log('Waiting for network requests to finish...');
        await page.waitForTimeout(3000); // Give time for login and redirect to /world
        await page.goto('http://localhost:5174/world', { waitUntil: 'networkidle2' });
    }
    
    console.log('\n--- NETWORK REQUESTS ---');
    requests.filter(r => r.url.includes('localhost') && (r.url.includes('login') || r.url.includes('map_artwork') || r.url.includes('api'))).forEach(r => {
      console.log(`${r.status} - ${r.url}`);
    });
    console.log('------------------------\n');

    console.log('Checking map component in DOM...');
    const domState = await page.evaluate(() => {
        const bgElements = document.querySelectorAll('img, div');
        let mapElementInfo = null;
        for (const el of bgElements) {
            const style = window.getComputedStyle(el);
            if (el.tagName === 'IMG' && el.src && el.src.includes('map_artwork')) {
                 mapElementInfo = { type: 'img', src: el.src, opacity: style.opacity, display: style.display, visibility: style.visibility, zIndex: style.zIndex };
            }
        }
        return mapElementInfo;
    });

    console.log('Map element in DOM:', domState);

    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
  }
})();
