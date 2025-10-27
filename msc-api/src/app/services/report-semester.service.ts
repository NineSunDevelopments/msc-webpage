import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Report} from "@shared/types/report";
import {DateTime} from "luxon";

@Injectable()
export class ReportSemesterService extends DataService<Report.Semester, MongoConnector<Report.Semester>> {

    constructor(
        connector: MongoConnector<Report.Semester>,
    ) {
        super("report-semester", connector);
    }

    public sanitize(data: Report.Semester, skip: boolean = false): Report.Semester {
        return {
            corpsId: "",
            changes: [],
            dueDate: DateTime.now(),
            semesterId: "",
            senior: "",
            conSenior: "",
            subSenior: "",
            fuchsMajor: "",
            submitDate: DateTime.now(),
            deleted: false,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            ...data ?? {},
            corpsInventory: {
                f: 0,
                cb: 0,
                iaCb: 0,
                ck: 0,
                ah: 0,
                eb: 0,
                ...data.corpsInventory ?? {},
            }
        }
    }
}


