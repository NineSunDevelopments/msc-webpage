import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {Corps} from "@shared/types/corps";
import {CorpsService} from "../../services/corps.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class CorpsController extends DataController<Corps, CorpsService> implements ControllerInstance {

    constructor(
        service: CorpsService,
    ) {
        super(service);
    }

}