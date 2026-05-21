import fetch from 'node-fetch';

async function trigger() {
  try {
    const urls = [
      "https://www.gamesdealshub.me/",
      "https://www.gamesdealshub.me/archive",
      "https://www.gamesdealshub.me/about",
      "https://www.gamesdealshub.me/privacy-policy",
      "https://www.gamesdealshub.me/terms-of-service",
      "https://www.gamesdealshub.me/contact",
      "https://www.gamesdealshub.me/free-steam-games",
      "https://www.gamesdealshub.me/free-epic-games"
    ];

    const sitemapData = await fetch("https://www.gamerpower.com/api/giveaways?type=game");
    if (sitemapData.ok) {
      const data = await sitemapData.json();
      if (Array.isArray(data)) {
        data.slice(0, 50).forEach((deal: any) => {
          urls.push(`https://www.gamesdealshub.me/game/${deal.id}`);
        });
      }
    }

    const payload = {
      "host": "www.gamesdealshub.me",
      "key": "30d8630d0caa4a32a5d2e1d4670883b0",
      "keyLocation": "https://www.gamesdealshub.me/30d8630d0caa4a32a5d2e1d4670883b0.txt",
      "urlList": urls
    };

    console.log("Triggering IndexNow with", urls.length, "URLs");
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    console.log("IndexNow response status:", response.status);
    const text = await response.text();
    console.log("IndexNow response body:", text);

  } catch (error) {
    console.error("Error triggering IndexNow:", error);
  }
}

trigger();
