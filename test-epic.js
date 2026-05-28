fetch('https://graphql.epicgames.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      query searchStoreQuery {
        Catalog {
          searchStore(category: "games/edition/base", count: 10, sortBy: "price", sortDir: "ASC") {
            elements {
              title
              price(country: "US") {
                totalPrice {
                  discountPrice
                  originalPrice
                  fmtPrice {
                    discountPrice
                    originalPrice
                  }
                }
              }
            }
          }
        }
      }
    `
  })
}).then(r => r.json()).then(console.log).catch(console.error);
