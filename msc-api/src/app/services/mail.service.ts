import {Injectable} from "../utilities/injectable";
import {createTransport, Transporter} from "nodemailer";
import {Instance} from "../utilities/injector";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {MailOptions} from "nodemailer/lib/smtp-pool";


@Injectable()
export class MailService implements Instance {

    private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = null;
    private fromAddress = '"MSC-Intern" <no-reply.msc@ninesun.de>';

    constructor( ) { }

    public onDestroy() {
        this.transporter.close();
    }

    public init() {
        this.transporter = createTransport({
            host: 'ninesun.de',
            port: 465,
            secure: true,
            auth: {
                user: 'msc@ninesun.de',
                pass: '1Lq18z0!h'
            }
        });

        /*this.sendMail({
            from: this.fromAddress,
            to: "nico.saenger@gmail.com,nico-saenger@ninesun.de",
            subject: "Testmail",
            text: "Hallo Welt!"
        }).then()*/
    }

    public sendMail(options: MailOptions): Promise<SMTPTransport.SentMessageInfo> {
        options.from = this.fromAddress;
        return this.transporter.sendMail(options);
    }
}