module.exports = function (eleventyConfig) {
  // Static assets are copied verbatim — they need no templating.
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/concept.js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Surface the prototypes into the built site so the Asterlogos preview
  // iframe can load `surface` same-origin. The whole tree is copied because
  // `surface` pulls in siblings — `_shared/*` assets, the `field` perception,
  // and each book's sculptural instrument — via relative `/prototypes/` paths.
  // Keeping the `/prototypes/` path segment intact lets those links resolve
  // unchanged. It's ~450K of plain HTML/CSS/JS, so copying all of it is cheap.
  eleventyConfig.addPassthroughCopy({ "prototypes": "prototypes" });

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
