module.exports = function (eleventyConfig) {
  // Static assets are copied verbatim — they need no templating.
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/concept.js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Surface the Asterlogos prototypes into the built site so its preview can
  // load `surface` same-origin. The tree lives under `asterlogos/prototypes/`
  // but is served at `/prototypes/` — the whole thing is copied because
  // `surface` pulls in siblings — `_shared/*` assets, the `field` perception,
  // and each book's sculptural instrument — via runtime `/prototypes/` paths.
  // Remapping the output to `/prototypes/` keeps those links resolving
  // unchanged. It's ~450K of plain HTML/CSS/JS, so copying all of it is cheap.
  // (Sanctuaire lives at the repo root, outside this tree, so its Next.js app
  // and node_modules are never swept into the static build.)
  eleventyConfig.addPassthroughCopy({ "asterlogos/prototypes": "prototypes" });

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
