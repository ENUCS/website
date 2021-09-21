/**
 * This is the ENDPOINT:
 * `/events/sendEmail`
 * ~~~~~~~~~~~~
 * For obtaining further information
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
 * and CHECKS for events spaces avaialble, AND updates the FILE
 * DATA for the correct event info;
 * ~~~~~~~~~~~~
 * Returns:
 * response POST 
 *  
 * @param {*} req 
 * @param {*} res 
*/
export async function post(req, res) {
    // get the Attendee Data & Target Event Data;
    const data = req.body;
    // console.log('submitForm.js', req.body);

    let eventInfo = data.eventInfo;
    let eventName = eventInfo.slug;
    let path = 'src/data/events/' + eventName + '.json';

    // if FILE for THIS EVENT exists?,
    if (fs.existsSync(path)) {

        // ~~~~~~~~~~
        // read target EVENT filename and RETRIVE DATA in JSON FORMAT;
        let fileData = await loadFileContents(path)

        // ~~~~~~~~~~
        // ... defining new EVENT ATTENDEE;
        let attendeeFinal = {
            full_name: data.full_name,
            email: data.email,
            tickets: data.tickets,
            mark_opt: data.email_marketing
        }

        // ~~~~~~~~~~
        // [VALIDATION]
        // ... get the TOTAL current EVENT Attendance; 
        var totalAttendance = fileData.reduce((accumulator, attendee) => {
            return accumulator + attendee.tickets;
        }, 0)
        // ... final ATTENDANCE including the ATTENDEE;
        totalAttendance += attendeeFinal.tickets
        // ... has the event Maximum Capacity Been Reached;
        if (totalAttendance > eventInfo.max_capacity) {
            throw new Error('Uh-oh! Maximum capacity has been reached for this event!')
        }

        // ~~~~~~~~~~
        // [VALIDATION]
        // CHECK ATTENDEE EMAIL has been used or NOT;
        let changed = false;
        const updatedData = fileData.map(p => {
            let object = p.email === attendeeFinal.email ? {...p, tickets: p.tickets + attendeeFinal.tickets} : p
            // check if the email for registration has already been used?;
            if (p.email === attendeeFinal.email) {
                changed = true;
                // check if the tickets of THIS email do not exceed the MAX ALLOWED;
                if (object.tickets > eventInfo.max_per_person) {
                    throw new Error('Uh-oh! You appear to have reached maximum ticket allowance');
                }
            }
            return object;
        });

        // ~~~~~~~~~~
        // ... and act acordingly;
        if (changed) {
            // ... Update ATTENDEE INFO IF EMAIL WAS USED or,
            fileData = updatedData;
        } else {
            // ... Add NEW ATTENDEE to EVENT FILE ATTENDANCE DATA if ATTENDEE IS NEW;
            fileData.push(attendeeFinal);
        }
        
        // ~~~~~~~~~~
        // ... update the Event FILE ATTENDANCE SHEET JSON;
        fs.writeFile(path, JSON.stringify(fileData, null, 4), err => {
            // ... checking for errors in the READING file;
            if (err) throw err;
            // ... success, EVENT ATTENDANCE UPDATED;
            console.log("Attendee Event Data Updated Writing")
        });

        // finalizing the response;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({'data': 'SUCCESS!'}))
    }
}