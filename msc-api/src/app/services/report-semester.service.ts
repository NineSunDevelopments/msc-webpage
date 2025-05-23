import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Report} from "@shared/types/report";

@Injectable()
export class ReportSemesterService extends DataService<Report.Semester, MongoConnector<Report.Semester>> {

    constructor(
        connector: MongoConnector<Report.Semester>,
    ) {
        super("report-semester", connector);
    }
}


