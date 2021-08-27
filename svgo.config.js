// https://github.com/svg/svgo
// run `npx svgo -f ./static/assets/svg/svgs-fresh -o ./static/assets/svg/svgs-optimized` in Command Line
const { extendDefaultPlugins } = require('svgo');
module.exports = {
  js2svg: {
    indent: 4,    // string with spaces or number of spaces. 4 by default
    pretty: true, // boolean, false by default
  },
  plugins: extendDefaultPlugins([
    {
      name: 'prefixIds',
      active : true
    },
    {
      name: 'removeViewBox',
      active: false
      // otherwise, the SVG cannot be scaled with CSS,
    },
    {
      name: 'convertStyleToAttrs',
      active: true
      // otherwise, `filter: url()` does not work for the svg,
      // and will not display the `shadows`
    },
    {
      name: 'cleanupIDs',
      active: false
      // otherwise I cannot target specific SVG elements,
      // with unique ID's
    },
    {
      name: 'removeEmptyAttrs',
      active: false
      // otherwise it removes the <a href=""> tags for the website,
    },
    {
      name: 'cleanupAttrs',
      active: false
    },
    {
      name: 'removeUnknownsAndDefaults',
      active: false
    }
  ])
}