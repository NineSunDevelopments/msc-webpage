import {Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {FencingDoctorService} from "../../services/fencing-doctor.service";
import {Fencing} from "@shared/types/fencing";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class FencingDoctorController extends DataController<Fencing.Doctor, FencingDoctorService> implements ControllerInstance {

    constructor(
        service: FencingDoctorService,
    ) {
        super(service);
    }

    @Get()
    public override async getAll(request: Request, response: Response): Promise<void> {
        await super.getAll(request, response);
    }

}
