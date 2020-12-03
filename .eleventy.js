module.exports = function(config) {
  config.addPassthroughCopy("js");
  config.addPassthroughCopy("css");
  config.addWatchTarget("css");

  config.addFilter("json", JSON.stringify);

  return {
    htmlTemplateEngine: "njk"
  };
};
