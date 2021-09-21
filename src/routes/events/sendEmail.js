/**
 * This is the ENDPOINT:
 * `/events/sendEmail`
 * ~~~~~~~~~~~~
 * This endpoint is a POST Endpoint,
 * which will SEND out an email to an ATTENDEE,
 * confirming their attendance to the EVENT; 
*/

// LIBRARY & API DEPNDENCIES,
const nodemailer = require('nodemailer');
const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');

import { emailAppPassword, email} from '../../config/tokens'

// =============
// EMAIL CONFIG,
// =============
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',          // ZOHO HOST;
    port: 465,                      // ZOHO PORT;
    secure: true,                   // use SSL;
    auth: {                         // email & pass (AUTH.);
        user: email,
        pass: emailAppPassword
    }
});

// ... open template file, (Using Handlebars);
var email_template = fs.readFileSync(path.join('static/email/', 'emailConfirmation.hbs'), 'utf8');

// ... create email generator,
var template = Handlebars.compile(email_template);

/**
 * Description:
 * ~~~~~~~~~~
 * EMAIL POST METHOD,
 * 
 * Recieves Data from the front-end
 * and send out an email to the Registered Atendee
 * with the Event INFO and ability to cancel their
 * attendence through the email;
 * 
 * @param {*} req 
 * @param {*} res 
*/
export function post(req, res) {
	const data = req.body;

    // declare VARs;
    let eventInfo = data.eventInfo
    let coverEventImg = eventInfo.img.substring(1);
    // console.log('sendEmail.js', data);

    // ~~~~~~~~~~
    // ATTACHMENTS OF THE EMAIL;
    var attachments = [
        // EVENT COVER IMAGE
        {
            filename: eventInfo.slug + '.png',
            path: 'static/' + coverEventImg,
            cid: 'eventCoverImg'    // same cid value as in the html img src
        },
        // ENUCS LOGO ICONS FOOTER
        {
            filename: 'enucs_logo.png',
            path: 'static/assets/img/enucs-brand/main-logo-512x512.png',
            cid: 'enucsLogoImg'     // same cid value as in the html img src
        },
        // SOCIAL ICONS FOOTER
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
        // NAPIER LOGO BRAND FOOTER
        {
            filename: 'napierUniLogo.png',
            path: 'static/assets/img/edinburgh-napier-brand-img.png',
            cid: 'napierUniLogo'     // same cid value as in the html img src
        }
    ]

    // ~~~~~~~~~~
    // DECLARE THE EMAIL OPTS.
    var mailOptions = {
        from: "Computing Society <info@enucs.org.uk>",      // FROM email;
        to: data.email,                                     // TO (Atendee email);
        subject: 'Event Confirmation! ' + eventInfo.title,  // EMAIL SUBJECT / TITLE;
        attachments: attachments,                           // necessary IMGs & FILES for the EMAIL;
        html: template(data)                                // Process template with locals - {passwordResetAddress};
    };

    // ~~~~~~~~~~
    // ... finalize the POST request;
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
}