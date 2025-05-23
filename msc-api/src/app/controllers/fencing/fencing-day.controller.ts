import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {FencingDayService} from "../../services/fencing-day.service";
import {Fencing} from "@shared/types/fencing";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class FencingDayController extends DataController<Fencing.Day, FencingDayService> implements ControllerInstance {

    constructor(
        service: FencingDayService,
    ) {
        super(service);
    }

}