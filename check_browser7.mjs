import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5174/world', { waitUntil: 'networkidle2' });
    
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl === 'http://localhost:5174/') {
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
        await page.waitForSelector('input[type="text"]');
        await page.type('input[type="text"]', 'FIN001');
        await page.type('input[type="password"]', 'demo123');
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const loginBtn = btns.find(b => b.textContent.includes('Log In'));
            if (loginBtn) loginBtn.click();
        });
        await new Promise(r => setTimeout(r, 3000));
        if (page.url() !== 'http://localhost:5174/world') {
           await page.goto('http://localhost:5174/world', { waitUntil: 'networkidle2' });
        }
    }
    
    console.log('Checking WorldMap and VillageMap container opacities...');
    const domState = await page.evaluate(() => {
        const getStyle = (el) => el ? {
            tag: el.tagName,
            className: el.className,
            opacity: window.getComputedStyle(el).opacity,
            display: window.getComputedStyle(el).display,
            visibility: window.getComputedStyle(el).visibility,
            width: window.getComputedStyle(el).width,
            height: window.getComputedStyle(el).height
        } : null;

        // The WorldMap container (bg-[#55B84A])
        const worldMapEl = document.querySelector('.bg-\\[\\#55B84A\\]');
        // The image itself
        const imgEl = document.querySelector('img[src*="map_artwork"]');
        
        const parentChain = [];
        let cur = imgEl;
        while(cur && cur.tagName !== 'BODY') {
            parentChain.push(getStyle(cur));
            cur = cur.parentElement;
        }

        return {
            worldMap: getStyle(worldMapEl),
            parentChain
        };
    });

    console.log('DOM State:', JSON.stringify(domState, null, 2));
    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
    process.exit(1);
  }
})();
