import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {BallTickets} from "@shared/types/ball-tickets";

@Injectable()
export class BallTicketsService extends DataService<BallTickets, MongoConnector<BallTickets>> {

    constructor(
        connector: MongoConnector<BallTickets>,
    ) {
        super("ball-tickets", connector);
    }
}