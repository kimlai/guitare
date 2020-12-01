module.exports = function(config) {
  config.addPassthroughCopy("js");
  config.addPassthroughCopy("css");
  config.addWatchTarget("css");

  return {
    htmlTemplateEngine: "njk"
  };
};
