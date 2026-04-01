import {Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {Activities} from "@shared/types/activities";
import {ActivitiesActivityService} from "../../services/activities-activity.service";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class ActivitiesActivityController extends DataController<Activities.Activity, ActivitiesActivityService> implements ControllerInstance {

    constructor(
        service: ActivitiesActivityService,
    ) {
        super(service);
    }

    @Get({
        middlewares: [MIDDLEWARE.NO_AUTH]
    })
    public override async getAll(request: Request, response: Response): Promise<void> {
        await super.getAll(request, response);
    }

}
