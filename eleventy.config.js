import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

// 文字に、言葉の切れ目の目印（<wbr>）を入れる。&amp; などの記号は切らない
const addBreaks = (text) =>
  text.replace(/&[^;\s]+;|[^&]+|&/g, (part) =>
    part.startsWith("&")
      ? part
      : parser
          .parse(part)
          .join("<wbr>")
          // 2026 のような数字も、途中で改行しない
          .replace(/(\d)<wbr>(?=\d)/g, "$1")
          // RV-6 や MS-50G+ などの型番は、途中で改行しない
          .replace(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+\+?/g, '<span class="model">$&</span>')
  );

// 「。」のあとに同じ段落の文が続くときは改行する。「。）」のような閉じかっこの前では切らない
const addSentenceBreaks = (html) =>
  html.replace(
    /。(?:<wbr>)?((?:<\/(?:strong|em|a|span|mark)>)*)(?:<wbr>)?(?=\s*(?:<(?:strong|em|a|span|mark)\b[^>]*>)*[^<\s）」』)])/g,
    "。$1<br>"
  );

export default function (eleventyConfig) {
  // 記事の本文を、スマホでも言葉の切れ目で改行し、「。」のあとでも改行する
  // 題名の帯と商品リンクのコードには触らない
  eleventyConfig.addTransform("phraseBreaks", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(/<article>[\s\S]*<\/article>/, (article) =>
      article
        .split(/(<header[\s\S]*?<\/header>|<script[\s\S]*?<\/script>|<!--[\s\S]*?-->)/)
        .map((chunk, i) =>
          i % 2 === 1
            ? chunk
            : addSentenceBreaks(
                chunk
                  .split(/(<[^>]+>)/)
                  .map((part, j) => (j % 2 === 0 && part.trim() ? addBreaks(part) : part))
                  .join("")
              )
        )
        .join("")
    );
  });

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
