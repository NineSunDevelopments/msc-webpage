import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {User} from "@shared/types/user";
import {MongoConnector} from "../utilities/mongoConnector";
import {Log} from "../utilities/type";
import {HashPassword} from "../utilities/dataUtils";
import {DateTime} from "luxon";
import {CorpsService} from "./corps.service";
import {Injector} from "../utilities/injector";
import {MailService} from "./mail.service";

@Injectable()
export class UserService extends DataService<User, MongoConnector<User>> {

    private corpsService: CorpsService = Injector.inject(CorpsService);
    private mailService: MailService = Injector.inject(MailService);

    constructor(
        connector: MongoConnector<User>,
    ) {
        super("users", connector);
    }

    public async init(): Promise<any> {
        const corps = await this.corpsService.getAll();
        return this.getAll().then((users) => {
            const admin = users.find(x => x.email === "no-reply.msc@ninesun.de");
            if (users.length === 0 || !admin) {
                const now = DateTime.now();
                this.create({
                    corpsId: corps.find(x => x.name === "Admins")?._id,
                    deleted: false,
                    activated: true,
                    isSuperAdmin: true,
                    email: "no-reply.msc@ninesun.de",
                    token: "",
                    password: HashPassword("admin", now),
                    createdAt: now,
                    updatedAt: now
                }).then(() => {
                    Log.info("User table initialized, admin user created");
                });
            }
        });
    }

    public generatePassword(): string {
        return Math.random().toString(36).slice(-8);
    }

    public async resetPassword(user: User) {
        const now = DateTime.now();

        const randomPassword = this.generatePassword();

        user.password = HashPassword(randomPassword, user.createdAt);
        user.updatedAt = now;

        const updatedUser = await this.update(user, true);

        this.mailService.sendMail({
            to: updatedUser.email,
            subject: "Password reset",
            text: `Your password has been reset to '${randomPassword}'.`
        }).then();
    }

    public sanitize(data: User, skip: boolean = false): User {
        if (!!data?.salt)
            delete data.salt;

        if (!!data?.password)
            delete data.password;

        return data;
    }
}