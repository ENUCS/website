/**
 * This is the ENDPOINT:
 * `/events/sendEmail`
 * ~~~~~~~~~~~~
 * This endpoint is a POST Endpoint,
 * which will SEND out an email to an ATTENDEE,
 * confirming their attendance to the EVENT; 
*/

// ~~~~~~~~~~~~
// ... LIBRARY & API DEPNDENCIES,
const nodemailer = require('nodemailer');
const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');

import { emailAppPassword, email } from '../../config/tokens'

// ~~~~~~~~~~~~
// ... EMAIL CONFIG,
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',          // ... ZOHO HOST;
    port: 465,                      // ... ZOHO PORT;
    secure: true,                   // ... use SSL;
    auth: {                         // ... email & pass (AUTH.);
        user: email,
        pass: emailAppPassword
    }
});

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

// ... open template file, (Using Handlebars.JS);
var email_template = fs.readFileSync(path.join('static/email/', 'email_MembersWelcome.hbs'), 'utf8');
// ... create email generator template with Handlebars, to populate email template;
var template = Handlebars.compile(email_template);

/**
 * Description:
 * ~~~~~~~~~~~~
 * EMAIL GET METHOD,
 * 
 * Recieves Data from the front-end
 * and send out an email to the Registered Atendee
 * with the Event INFO and ability to cancel their
 * attendence through the email;
 * 
 * @param {*} req 
 * @param {*} res 
*/
export async function get(req, res) {
    // ... varify that this is an ADMIN making the action;
    // let data = req.query; // ... future addition;

    // ~~~~~~~~~~
    // ... declare VARs;
    let from = 'Computing Society <info@enucs.org.uk>'
    let subject = 'Welcome To ENUCS! 😎🥳'

    // ~~~~~~~~~~
    // ... attachments of the email;
    var attachments = [
        // ~~~~~~~~~~
        // ... ENUCS LOGO ICONS FOOTER
        {
            filename: 'enucs_logo.png',
            path: 'static/assets/img/enucs-brand/main-logo-512x512.png',
            cid: 'enucsLogoImg'     // same cid value as in the html img src
        },
        // ~~~~~~~~~~
        // ... MEMBER PERKS IMAGES
        {
            filename: 'become-member-enucs-discrod-frame.png',
            path: 'static/assets/img/email-member-welcome/become-member-enucs-discrod-frame.png',
            cid: 'become-member-enucs-discrod-frame'     // same cid value as in the html img src
        },
        {
            filename: 'become-member-freebies-frame.png',
            path: 'static/assets/img/email-member-welcome/become-member-freebies-frame.png',
            cid: 'become-member-freebies-frame'     // same cid value as in the html img src
        },
        {
            filename: 'become-member-job-opportunities-frame.png',
            path: 'static/assets/img/email-member-welcome/become-member-job-opportunities-frame.png',
            cid: 'become-member-job-opportunities-frame'     // same cid value as in the html img src
        },
        {
            filename: 'become-member-revolution-discount-frame.png',
            path: 'static/assets/img/email-member-welcome/become-member-revolution-discount-frame.png',
            cid: 'become-member-revolution-discount-frame'     // same cid value as in the html img src
        },
        // ~~~~~~~~~~
        // ... COMMITEE IMAGE
        {
            filename: 'committee-image-white.png',
            path: 'static/assets/img/email-member-welcome/committee-image-white.png',
            cid: 'committee-team-member'     // same cid value as in the html img src
        },
        // ~~~~~~~~~~
        // ... SOCIAL ICONS FOOTER
        {
            filename: 'twitter_Logo.png',
            path: 'static/assets/img/icons/twitter-icon.png',
            cid: 'twitterIcon'     // same cid value as in the html img src
        },
        {
            filename: 'facebook_Logo.png',
            path: 'static/assets/img/icons/facebook-icon.png',
            cid: 'facebookIcon'     // same cid value as in the html img src
        },
        {
            filename: 'discord_Logo.png',
            path: 'static/assets/img/icons/discord-icon.png',
            cid: 'discordIcon'     // same cid value as in the html img src
        },
        {
            filename: 'instagram_Logo.png',
            path: 'static/assets/img/icons/instagram-icon.png',
            cid: 'instagramIcon'     // same cid value as in the html img src
        },
        // ~~~~~~~~~~
        // ... NAPIER LOGO BRAND FOOTER
        {
            filename: 'napierUniLogo.png',
            path: 'static/assets/img/edinburgh-napier-brand-img.png',
            cid: 'napierUniLogo'     // same cid value as in the html img src
        }
    ]

    // ~~~~~~~~~~
    // read target MEMBERS LIST filename and RETRIVE THE MEMBERS LIST DATA in JSON FORMAT;
    let filePath = 'src/data/email/enucs-members.json'
    let fileData = await loadFileContents(filePath)

    // ~~~~~~~~~~
    // ... get list of members & info;
    // ... iterate over the loop of members, and send out email 1 by 1;
    fileData.forEach(member => {
        console.log(member.name);
        
        // ~~~~~~~~~~
        //... ommit the members with the sent out already emails;
        if (member.welcome_email_sent) {
            return;
        }
        
        // ~~~~~~~~~~
        //... update the member to `sent-out-email` to TRUE;
        member.welcome_email_sent = true
        //... make sure new members have their `market-opt` set to true;
        member.mark_opt = true
        //... generate the user's UID
        while (true) {
            member.perk_code = (Math.random() + 1).toString(36).substring(7).toUpperCase();
            let count = 0;
            for (let _m in fileData) {
                if (member.perk_code == _m.perk_code) {
                    count = count + 1;
                }
            }
            //...exit when there is only the copy of itself;
            if (count == 1 || count == 0) {
                break;
            }
        }
    
        // ~~~~~~~~~~
        // ... declare email opts. ;
        var mailOptions = {
            from: from,                                 // ... FROM email;
            to: member.email,                           // ... TO - Member email;
            subject: subject,                           // ... EMAIL SUBJECT / TITLE;
            attachments: attachments,                   // ... necessary IMGs & FILES for the EMAIL;
            html: template(member)                      // ... process template with locals - {passwordResetAddress};
        };

        // ~~~~~~~~~~
        // ... finalize the POST request & send out email;
        res.setHeader('Content-Type', 'application/json');
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.end(JSON.stringify(error));
            } else {
                res.end(JSON.stringify(info.response));
                console.log('Email sent: ' + info.response);
            }
        });
    });

    // ~~~~~~~~~~
    //... write back NEW DATA to the MEMBERS LIST FILE;
    fs.writeFile(filePath, JSON.stringify(fileData, null, 4), err => {
        // ... checking for errors in the READING file;
        if (err) throw err;
        // ... success, EVENT ATTENDANCE UPDATED;
        console.log("Members List INFO has been UPDATED!")
        // res.setHeader('Content-Type', 'application/json');
        // res.end(JSON.stringify({"Member already sent email to": "TRUE!"}));
    });
}