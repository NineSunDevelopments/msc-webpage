import {Controller, ControllerInstance, DataController, Get, Respond,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ActivitiesSemesterService} from "../../services/activities-semester.service";
import {Activities} from "@shared/types/activities";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ActivitiesSemesterController extends DataController<Activities.Semester, ActivitiesSemesterService> implements ControllerInstance {

    constructor(
        service: ActivitiesSemesterService,
    ) {
        super(service);
    }

    @Get({ path: "current" })
    public async getCurrent(request: Request, response: Response): Promise<void> {
        const data = await this.service.getCurrent();
        Respond({response, data});
    }
}