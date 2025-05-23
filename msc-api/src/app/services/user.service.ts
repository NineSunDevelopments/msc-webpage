import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {User} from "@shared/types/user";
import {MongoConnector} from "../utilities/mongoConnector";
import {Log} from "../utilities/type";
import {HashPassword} from "../utilities/dataUtils";
import {DateTime} from "luxon";

@Injectable()
export class UserService extends DataService<User, MongoConnector<User>> {

    constructor(
        connector: MongoConnector<User>,
    ) {
        super("users", connector);
    }

    public init(): Promise<any> {
        return this.getAll().then((users) => {
            const admin = users.find(x => x.email === "admin@msc");
            if (users.length === 0 || !admin) {
                const now = DateTime.now();
                this.create({
                    corpsId: "",
                    deleted: false,
                    activated: true,
                    email: "admin@msc",
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

    public sanitize(data: User, skip: boolean = false): User {
        if (!!data?.salt)
            delete data.salt;

        if (!!data?.password)
            delete data.password;

        return data;
    }
}