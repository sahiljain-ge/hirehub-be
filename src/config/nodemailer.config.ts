import nodemailer from 'nodemailer'
import { EMAIL, EMAIL_HOST_NAME, EMAIL_PASS } from './server-config.js';

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST_NAME,
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});

export default transporter;