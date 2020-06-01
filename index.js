const url = require("url");
const bent = require("bent");
const cheerio = require("cheerio");

const top = url.parse("https://markezine.jp/");

bent(top.href)("/article/")
  .then((stream) => {
    console.log([stream.status, stream.statusCode]);
    return stream.text();
  })
  .then((str) => {
    const $ = cheerio.load(str);
    const out = $('ul[class="catTopList result cf"]')
      .children()
      .map((i, el) => {
        return {
          id: el.attribs.id,
          title: $("h2 a", el).text(),
          // url: new URL($('h2 a', el).attr('href'), top).href,
          url: (() => {
            top.pathname = $("h2 a", el).attr("href");
            return url.format(top);
          })(),
          abstract: $("p", el).text(),
          date: $('span[class="day"]', el).text(),
          eyecatch: (() => {
            const u = url.parse($("img", el).attr("src"));
            u.protocol = top.protocol;
            return url.format(u);
          })(),
        };
      })
      .get();
    console.log(out);
  });
