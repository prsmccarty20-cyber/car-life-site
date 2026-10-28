export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  // CSSを直したとき、古いCSSが残らないようにする目印
  eleventyConfig.addGlobalData("buildTime", Date.now());

  // 記事一覧（新しい順）
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date)
  );

  // 日付を「2026年10月26日」の形にする
  eleventyConfig.addFilter("jpDate", (value) => {
    const d = new Date(value);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  });

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
  };
}
