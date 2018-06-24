const AWS = require('aws-sdk');
const querystring = require('querystring');

AWS.config.region = 'eu-west-2';

exports.handler = function(evt, context, callback) {
    const params = querystring.parse(evt.body);
    const my_field = params['Name'];
    const html = '<!DOCTYPE html><p>Thanks for contacting me: ' + my_field + '.</p>' + 
                 '<p>I will contact you as soon as possible.</p>'+
                 '<p>I appreciate your interest.</p>'+
                 '<a href="javascript:history.back(-1);"><input type="button" value="Return to Main" /></a>';
    SendSes(params);
    callback(null, html);
}

function SendSes(params){
    let textBody = params["Name"] + ' tried to contact you.\n' +
                   'Email: ' + params["Email"] + '\n' +
                   'Phone: ' + params["Phone"] + '\n' +
                   'Message: ' + params["Message"];
    const AWS2 = require('aws-sdk');
    AWS2.config.region = 'eu-west-1';
    var params = {
        Destination: {
            ToAddresses: ['pruebas.alertas.3@gmail.com']
        },
        Message: { /* required */
            Body: { /* required */
            Text: {
                Charset: "UTF-8",
                Data: textBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Received Message From ' + params['Name']
            }
        },
        Source: 'pruebas.alertas.3@gmail.com' /* required */
    };       
    var sendPromise = new AWS2.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    sendPromise.then(
        function(data) {
            console.log(data.MessageId);
            }).catch(
            function(err) {
                console.error(err, err.stack);
        });
    }
