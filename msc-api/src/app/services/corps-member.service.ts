import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {CorpsMember} from "@shared/types/corps-member";

@Injectable()
export class CorpsMemberService extends DataService<CorpsMember, MongoConnector<CorpsMember>> {

    constructor(
        connector: MongoConnector<CorpsMember>,
    ) {
        super("corps-member", connector);
    }
}