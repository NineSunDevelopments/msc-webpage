import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Fencing} from "@shared/types/fencing";

@Injectable()
export class FencingDoctorService extends DataService<Fencing.Doctor, MongoConnector<Fencing.Doctor>> {

    constructor(
        connector: MongoConnector<Fencing.Doctor>,
    ) {
        super("fencing-doctor", connector);
    }
}

