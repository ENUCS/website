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
 * GET REQUEST FROM EMAIL to CANCEL EVENT for an ATTENDEE;
*/
export async function get(req, res) {
    // console.log('CANCEL EVENT!');

    // get the ATENDEE INFO;
    let data = req.query;
    let eventTitle = data.eventSlug;
    let attendeeEmail = data.email;
    // console.log('data', data);

    let path = 'src/data/events/' + eventTitle + '.json';

    // if FILE for THIS EVENT exists?,
    if (fs.existsSync(path)) {
        
        // ~~~~~~~~~~
        // read target EVENT filename and RETRIVE DATA in JSON FORMAT;
        let fileData = await loadFileContents(path)

        // remove the attendee from the FILE EVENT;
        let i = 0;
        fileData.forEach(atendee => {
            // remove it from the persistance method,
            if (atendee.email === attendeeEmail) {
                fileData.splice(i, 1);
            }
            i = i + 1;
        });

        // write back NEW DATA to the EVENT FILE;

        // ~~~~~~~~~~
        // ... update the Event FILE ATTENDANCE SHEET JSON;
        fs.writeFile(path, JSON.stringify(fileData, null, 4), err => {
            // ... checking for errors in the READING file;
            if (err) throw err;
            // ... success, EVENT ATTENDANCE UPDATED;
            console.log("Attendee Event INFO Cancelleed!")
        });

        // finalizing the response;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({'Message': 'SUCCESS! You have cancelled your attendance to the event!'}))
    } else {
        // do NOTHING;
    }
}