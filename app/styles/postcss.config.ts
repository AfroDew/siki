import autoprefixer from "npm:autoprefixer";
// import csso from "npm:postcss-csso";
import customMediaPlugin from "npm:postcss-custom-media";
import postcssPresetEnv from "npm:postcss-preset-env";

export const config = {
  plugins: [
    customMediaPlugin(),
    postcssPresetEnv({
      stage: 3,
      features: {
        "all-property": true,
      },
    }),
    autoprefixer(),
    // csso({
    //   comments: "all",
    // }),
  ],
};
