/**
 * Description:
 * ===
 * Check and retirve the correct file names 
 * and locations for the client to view the correct images
 * of the products.
 * ~~~~~~~~~~~~~~~~~~~
 * Dependencies:
 * +> https://www.npmjs.com/package/string-similarity
 * +> 
*/
const path = require('path');
const fs = require('fs');
var stringSimilarity = require("string-similarity");

import { printful_img_views } from '../../data/printful-img-views'

/**
 * Function / Method;
 * Desc: 
 * Intercepts the `POST` data from the Server-Middleware
 * and creates OR appends to existing .CSV file for user data storing,
 * ----
 * Returns:
 * NaN 
 * @param {*} req 
 * @param {*} res 
 */
export function post(req, res) {
    const data = req.body;

    // get the SKU TERMINATION for the Apparel Item; (sku + color-code)
    const sku = data.sku
    // console.log('sku', sku)

    // read all of the files inside the target printful directory;
    let path_to_files = 'static/assets/img/printful'
    var files = fs.readdirSync(path_to_files);

    let target_asset_files = []

    // check ITERATIVELY for the filenames with the closest matches;
    for (let file of files) {

        // get only the filename, without extension;
        let filename_only = path.parse(file).name
        // match the SKU to the filenames that share the same name;
        let similarity_val = stringSimilarity.compareTwoStrings(filename_only, sku);
        // if similarity ratio is `> 0.8` (80%);
        if (similarity_val > 0.8) {
            // identify the position/view of the preview image;
            for (let viewPos of printful_img_views) {
                if (filename_only.includes(viewPos)) {
                    // add this taget file preview image to the selected array w/ its respective position
                    target_asset_files.push([viewPos, file])
                }
            }
        }
    }

    let response = target_asset_files

    // finalizing the response;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
}