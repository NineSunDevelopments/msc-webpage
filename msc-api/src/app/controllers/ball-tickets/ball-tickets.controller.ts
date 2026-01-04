import {Controller, ControllerInstance, DataController, Get, Respond,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {BallTickets} from "@shared/types/ball-tickets";
import {BallTicketsService} from "../../services/ball-tickets.service";
import {Injector} from "../../utilities/injector";
import {ActivitiesSemesterService} from "../../services/activities-semester.service";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class BallTicketsController extends DataController<BallTickets, BallTicketsService> implements ControllerInstance {

    private readonly semesterService = Injector.resolve<ActivitiesSemesterService>(ActivitiesSemesterService);

    constructor(
        service: BallTicketsService,
    ) {
        super(service);
    }

    @Get({ path: "/for-current-semester" })
    public async loadForCurrentSemester(request: Request, response: Response) {
        const currentSemester = await this.semesterService.getCurrent();
        console.log(currentSemester._id)
        const ticketEntries = await this.service.findAll("semesterId = ? AND deleted = ?", [currentSemester._id.toString(), false]);
        console.log(ticketEntries.length)

        Respond({response, data: ticketEntries});
    }
}