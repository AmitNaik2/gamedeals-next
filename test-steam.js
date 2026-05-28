const cheerio = require('cheerio');
fetch('https://store.steampowered.com/search/results?maxprice=free&specials=1')
  .then(r => r.text())
  .then(html => {
    const $ = cheerio.load(html);
    const results = [];
    $('#search_resultsRows a').each((i, el) => {
      const title = $(el).find('.title').text().trim();
      const url = $(el).attr('href');
      const originalPrice = $(el).find('.discount_original_price').text().trim();
      const salePrice = $(el).find('.discount_final_price').text().trim();
      const thumb = $(el).find('img').attr('src');
      results.push({ title, url, originalPrice, salePrice, thumb });
    });
    console.log(JSON.stringify(results, null, 2));
  });
