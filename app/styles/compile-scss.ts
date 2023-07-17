import * as sass from "npm:sass";

// Complie Scss
async function buildFromSCSS() {
  console.log("Building css from SCSS files...");

  const result = sass.compile("styles/scss/index.scss", {
    sourceMap: true,
    sourceMapIncludeSources: true,
    quietDeps: true,
  });

  // Save complied css
  const outputPath = "styles/css/global.css";

  console.log(`Updating styles for ${outputPath}`);
  await Deno.writeTextFile(outputPath, result.css);
  // Save complied css source map

  console.log("Done compiling SCSS files!");
}

// From scss files
buildFromSCSS();
