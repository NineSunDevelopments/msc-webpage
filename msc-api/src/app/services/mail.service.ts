import {Injectable} from "../utilities/injectable";
import {createTransport, Transporter} from "nodemailer";
import {Instance} from "../utilities/injector";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {MailOptions} from "nodemailer/lib/smtp-pool";
import {Log} from "../utilities/type";
import SMTPConnection from "nodemailer/lib/smtp-connection";


@Injectable()
export class MailService implements Instance {

    private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = null;
    private fromAddress = '"MSC-Intern" <no-reply.msc@ninesun.de>';

    constructor() {
    }

    public onDestroy() {
        this.transporter.close();
    }

    public init() {
        const host = (process.env.SMTP_HOST ?? 'localhost');
        const port = parseInt(process.env.SMTP_PORT ?? '465');
        const secure = (process.env.SMTP_SECURE ?? 'true') === 'true';
        const auth = {
            user: process.env.SMTP_USER ?? 'mail@msc',
            pass: process.env.SMTP_PASS ?? 'pa$$w0rD'
        };

        try {
            this.transporter = createTransport({host, port, secure, auth} as SMTPConnection.Options);
        } catch (e) {
            this.transporter = null;
            Log.error(e);
        }
    }

    public sendMail(options: MailOptions): Promise<SMTPTransport.SentMessageInfo> {
        if (!this.transporter) return Promise.reject();

        try {
            options.from = this.fromAddress;
            return this.transporter.sendMail(options);
        } catch (e) {
            Log.error(e);
            return Promise.reject();
        }
    }
}