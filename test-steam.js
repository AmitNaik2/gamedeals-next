const cheerio = require('cheerio');

async function testSteam() {
  try {
    const res = await fetch('https://store.steampowered.com/search/results?specials=1&filter=topsellers');
    const html = await res.text();
    const $ = cheerio.load(html);
    const count = $('#search_resultsRows a').length;
    console.log('Found:', count);
    if (count === 0) {
      console.log(html.substring(0, 500));
    }
  } catch (err) {
    console.error(err);
  }
}

testSteam();
