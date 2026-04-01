import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Judge} from "@shared/types/judge";

@Injectable()
export class JudgeService extends DataService<Judge, MongoConnector<Judge>> {

    constructor(
        connector: MongoConnector<Judge>,
    ) {
        super("judge", connector);
    }
}

