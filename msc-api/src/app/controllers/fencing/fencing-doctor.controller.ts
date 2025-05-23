import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {FencingDoctorService} from "../../services/fencing-doctor.service";
import {Fencing} from "@shared/types/fencing";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class FencingDoctorController extends DataController<Fencing.Doctor, FencingDoctorService> implements ControllerInstance {

    constructor(
        service: FencingDoctorService,
    ) {
        super(service);
    }

}