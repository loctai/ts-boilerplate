import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import * as Mail from "nodemailer/lib/mailer";
const hbs = require('nodemailer-express-handlebars')
const sendgrid = require('nodemailer-sendgrid-transport');
const postmark = require('nodemailer-postmark-transport');
const mailgun = require('nodemailer-mailgun-transport');


import { logError, logInfo } from '../../utils/logger/logger';
import { resolve } from 'path';

export class MailerService {
    public static sendMail(toEmail: string, subject: string, template: string, context: object) {

        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
    
        let aws = new AWS.SES({ apiVersion: "2010-12-01" });
        //TODO: inject the transport mailer
        let transporter : Mail = null;
        transporter =  this.getTransport();
       
        const options = {
            from: 'JOP <tailv@ebizworld.com.vn>',
            to: toEmail,
            subject: subject,
            template: template,
            context: context
        }
      
        const viewPath = resolve(__dirname, '../../', 'mail-templates');
        console.log(viewPath)
        transporter.use(
            'compile',
            hbs({
              viewEngine: {
                extname: '.hbs',
                partialsDir: viewPath,
                layoutsDir: viewPath,
                defaultLayout: template,
              },
              viewPath: viewPath,
              extName: '.hbs',
            }),
          );
        return transporter.sendMail(options).then((info) => {
            logInfo('sendMail() -', 'MAIL SERVICE', info)
        }).catch((err) => {
            logError('sendMail() -', 'MAIL SERVICE', err)
        });
       
    }

    public static getTransport() {
        switch (process.env.MAIL_TRANSPORT) {
            case 'ses':
                AWS.config.update({
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                });
                let aws = new AWS.SES({ apiVersion: "2010-12-01" });
                return nodemailer.createTransport({SES: aws});
            case 'sendgrid':
                return nodemailer.createTransport(
                    sendgrid({
                        auth: {
                            api_key: process.env.SENDGRID_API_KEY
                        },
                    })
                );
            case 'postmark':
                return nodemailer.createTransport(
                    postmark({
                        auth: {
                            apiKey: process.env.POSTMARK_API_KEY
                        },
                    })
                );
            case 'mailgun':
                return nodemailer.createTransport(
                    mailgun({
                        auth: {
                            api_key: process.env.MAILGUN_API_KEY,
                            domain: process.env.MAILGUN_DOMAIN
                        },
                    })
                );
            case 'smtp':
                //https://stackoverflow.com/a/62377331/7039250
                const smtpConfigs = {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false, // env('SMTP_SECURE') == 'true', // eslint-disable-line eqeqeq
                    ignoreTLS: process.env.SMTP_SECURE == 'false', // eslint-disable-line eqeqeq
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                };
                return nodemailer.createTransport(smtpConfigs);
            default:
                console.error('No valid TRANSPORT set');
                return nodemailer.createTransport({streamTransport: true, newline: 'unix', buffer: true});
        }
    }
}  

