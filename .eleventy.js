module.exports = function (eleventyConfig) {
  // Static assets are copied verbatim — they need no templating.
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/concept.js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Asterlogos now lives on its own domain (asterlogos.com); `_redirects`
  // forwards the retired `/projects/asterlogos/*` and `/prototypes/*` paths
  // there. Cloudflare Pages reads this file from the output root.
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // Content pages are authored as plain HTML bodies. Disabling the HTML
  // template engine means their markup (inline scripts, `{` in JS, etc.) is
  // passed through untouched — only the .njk layout that wraps them runs
  // through Nunjucks. The home page (index.njk) opts back into templating.
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
  };
};
