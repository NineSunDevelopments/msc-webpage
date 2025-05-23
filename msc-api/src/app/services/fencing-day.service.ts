import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Fencing} from "@shared/types/fencing";

@Injectable()
export class FencingDayService extends DataService<Fencing.Day, MongoConnector<Fencing.Day>> {

    constructor(
        connector: MongoConnector<Fencing.Day>,
    ) {
        super("fencing-day", connector);
    }
}

