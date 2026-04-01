import {Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {Fencing} from "@shared/types/fencing";
import {FencingArbiterService} from "../../services/fencing-arbiter.service";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class FencingArbiterController extends DataController<Fencing.Arbiter, FencingArbiterService> implements ControllerInstance {

    constructor(
        service: FencingArbiterService,
    ) {
        super(service);
    }

    @Get()
    public override async getAll(request: Request, response: Response): Promise<void> {
       await super.getAll(request, response);
    }

}
