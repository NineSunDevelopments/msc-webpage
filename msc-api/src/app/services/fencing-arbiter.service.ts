import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Fencing} from "@shared/types/fencing";

@Injectable()
export class FencingArbiterService extends DataService<Fencing.Arbiter, MongoConnector<Fencing.Arbiter>> {

    constructor(
        connector: MongoConnector<Fencing.Arbiter>,
    ) {
        super("fencing-arbiter", connector);
    }
}

