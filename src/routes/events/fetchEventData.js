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
 * Intercepts the `POST` data from the Server-Middleware
 * and quieries a TARGET file name for further ATTENDEE INFORMATION,
 * ~~~~~~~~~~~~
 * Returns:
 * NaN 
 * @param {*} req 
 * @param {*} res 
*/
export async function post(req, res) {

    // get SINGLE event;
    const data = req.body;
    // console.log('fetchEventData.js', req.body);

    // new data of events (updated);
    let newEventObj = {}

    // set the location of event file;
    let path = 'src/data/events/' + data.slug + '.json'

    // if EVENT file exists,
    if (fs.existsSync(path)) {

        // read the target event-registration-file;
        let fileData = await loadFileContents(path)

        // get number of PLANNED attendees;
        var totalPlannedAttendees = fileData.reduce((accumulator, attendee) => {
            return accumulator + attendee.tickets;
        }, 0);
        
        // ... set wheather there is spaceAvaialable BOOLEAN;
        let spaceAvailable = (totalPlannedAttendees < data.max_capacity)

        // add the new Event Object to the Object Array;
        newEventObj = {
            ...data,
            plannedAttendees: totalPlannedAttendees,
            spaceAvailable: spaceAvailable
        };
    }
    // if EVENT doesn't exist,
    else {
        fs.writeFile(path, JSON.stringify([], null, 4), err => {
            // ... checking for errors in the READING file;
            if (err) throw err;
            // ... success, EVENT ATTENDANCE UPDATED;
            console.log("Addin new file to the system!")
        });
        // set planned attendees to 0;
        newEventObj = {
            ...data,
            plannedAttendees: 0,
            spaceAvailable: true
        };
    }

    // finalizing the response;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(newEventObj))
}