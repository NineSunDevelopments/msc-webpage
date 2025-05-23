import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {BallTickets} from "@shared/types/ball-tickets";
import {BallTicketsService} from "../../services/ball-tickets.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class BallTicketsController extends DataController<BallTickets, BallTicketsService> implements ControllerInstance {

    constructor(
        service: BallTicketsService,
    ) {
        super(service);
    }

}