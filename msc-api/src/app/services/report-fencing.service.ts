import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Report} from "@shared/types/report";

@Injectable()
export class ReportFencingService extends DataService<Report.Fencing, MongoConnector<Report.Fencing>> {

    constructor(
        connector: MongoConnector<Report.Fencing>,
    ) {
        super("report-fencing", connector);
    }
}


