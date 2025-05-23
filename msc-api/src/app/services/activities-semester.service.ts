import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {Activities} from "@shared/types/activities";
import {MongoConnector} from "../utilities/mongoConnector";
import {DateTime} from "luxon";

@Injectable()
export class ActivitiesSemesterService extends DataService<Activities.Semester, MongoConnector<Activities.Semester>> {

    constructor(
        connector: MongoConnector<Activities.Semester>,
    ) {
        super("activities-semester", connector);
    }

    public async init(): Promise<any> {
        const current = await this.getCurrent();

        if (!current) {
            await this.create({
                corpsId: "",
                createdAt: DateTime.now(),
                deleted: false,
                end: DateTime.now().plus({months: 6}),
                notes: "DELETE ME!",
                start: DateTime.now(),
                updatedAt: DateTime.now(),
                name: "XYZ-" + DateTime.now().year
            })
        }

        return Promise.resolve();
    }

    public getCurrent(): Promise<Activities.Semester> {
        return this
            .findAll("deleted = ?", [false])
            .then(list => list.find(x => x.start <= DateTime.now() && DateTime.now() <= x.end));
    }
}