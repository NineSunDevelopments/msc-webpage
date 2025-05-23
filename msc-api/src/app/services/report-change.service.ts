import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Report} from "@shared/types/report";

@Injectable()
export class ReportChangeService extends DataService<Report.Change, MongoConnector<Report.Change>> {

    constructor(
        connector: MongoConnector<Report.Change>,
    ) {
        super("change", connector);
    }
}


