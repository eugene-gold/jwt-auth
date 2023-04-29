const nodeMailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,

            },
            tls:{
                ciphers: "SSLv3",
                rejectUnauthorized:false
            }
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация учетной записи' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                    </div>
                `

        })
    }
}

module.exports = new MailService()