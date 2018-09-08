module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'valid gmail',
            pass: 'pwd'
        }
    });
    if (req.query.question || (req.body && req.body.question)) {
        var mailOptions = {
            from: 'no-reply@genie.com',
            to: 'abc@xyz.com',
            subject: 'Genie',
            text: req.body.question
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        context.res = {
            // status: 200, /* Defaults to 200 */
            body:"OK"
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};