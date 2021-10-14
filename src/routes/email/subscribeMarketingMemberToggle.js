/**
 * Description:
 * ~~~~~~~~~~~~
 * ENDPOINT
 * for obtaining further information
 * on the TARGET event INFO;
*/
var fs = require('fs');

/**
 * Description:
 * ~~~~~~~~~~~~
 * An ASYNC/AWAIT function-method
 * for reading files SEQUENTIALLY;
 * 
 * @param {*} fileName 
 * @returns 
*/
async function loadFileContents(fileName) {
    let data = await fs.promises.readFile(
        fileName, 
        "utf8", 
        function(err, fileData) {
            // check-for-reading-errors
            if (err) {
                throw new Error(err)
            }
            return fileData
    });
    data = JSON.parse(data);
    return data;
}

/**
 * Description:
 * ~~~~~~~~~~~~
 * GET REQUEST FROM EMAIL to CANCEL EVENT for an ATTENDEE;
*/
export async function get(req, res) {
    // console.log('SUBSCRIBE-UNSUBSCRIBE MEMBER FROM MARKET OPT.');

    // get the MEMBER INCOMING INFO REQUEST;
    let data = req.query;
    let memberUID = data.memberUID;
    console.log('data', data);

    let path = 'src/data/email/enucs-members.json';

    // if FILE for THIS EVENT exists?, [ALWAYS EXISTS!]
    if (fs.existsSync(path)) {
        
        // ~~~~~~~~~~
        // ... read target EVENT filename and RETRIVE DATA in JSON FORMAT;
        let fileData = await loadFileContents(path)
        let memberMarkOptState = null;

        //... update the target member info for MARKETING OPT;
        fileData.forEach(member => {
            // remove it from the persistance method,
            //... get the matching member UID;
            if (member.perk_code === memberUID) {
                //... update their marketing preferences;
                member.mark_opt = !member.mark_opt
                memberMarkOptState = member.mark_opt 
            }
        });


        // ~~~~~~~~~~
        //... write back NEW DATA to the MEMBERS LIST FILE;
        fs.writeFile(path, JSON.stringify(fileData, null, 4), err => {
            // ... checking for errors in the READING file;
            if (err) throw err;
            // ... success, EVENT ATTENDANCE UPDATED;
            console.log("Members List INFO has been UPDATED!")
        });

        // ~~~~~~~~~~
        // ... check what sort of MEMBER MARK OPT HAS OCCURED;
        // ... and finalize the response;
        res.setHeader('Content-Type', 'application/json')
        if (memberMarkOptState) {
            res.end(JSON.stringify({'Message': 'SUCCESS! You have successfully subscribed to our email Marketing!'}))
        } else {
            res.end(JSON.stringify({'Message': 'SUCCESS! You have successfully unsubscribed from our email Marketing!'}))
        }
    } else {
        //... do NOTHING;
    }
}