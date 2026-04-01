import {Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {Request, Response} from 'express';
import {MIDDLEWARE} from "../../application";
import {Corps} from "@shared/types/corps";
import {CorpsService} from "../../services/corps.service";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class CorpsController extends DataController<Corps, CorpsService> implements ControllerInstance {

    constructor(
        service: CorpsService,
    ) {
        super(service);
    }

    @Get({
        path: '/',
        middlewares: [MIDDLEWARE.NO_AUTH]
    })
    public override async getAll(request: Request, response: Response): Promise<void> {
        await super.getAll(request, response);
    }

}
