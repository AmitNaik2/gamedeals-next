await fetch("http://localhost:3000/api/giveaways-feed").then(r => r.json()).then(console.log).catch(console.error);
