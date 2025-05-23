import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {Activities} from "@shared/types/activities";
import {MongoConnector} from "../utilities/mongoConnector";

@Injectable()
export class ActivitiesActivityService extends DataService<Activities.Activity, MongoConnector<Activities.Activity>> {

    constructor(
        connector: MongoConnector<Activities.Activity>,
    ) {
        super("activities-activity", connector);
    }
}