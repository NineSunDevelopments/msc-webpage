import {Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {FencingDayService} from "../../services/fencing-day.service";
import {Fencing} from "@shared/types/fencing";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class FencingDayController extends DataController<Fencing.Day, FencingDayService> implements ControllerInstance {

    constructor(
        service: FencingDayService,
    ) {
        super(service);
    }

    @Get()
    public override async getAll(request: Request, response: Response): Promise<void> {
        await super.getAll(request, response);
    }

}
