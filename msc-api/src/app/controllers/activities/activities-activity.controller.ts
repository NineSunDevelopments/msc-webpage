import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {Activities} from "@shared/types/activities";
import {ActivitiesActivityService} from "../../services/activities-activity.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ActivitiesActivityController extends DataController<Activities.Activity, ActivitiesActivityService> implements ControllerInstance {

    constructor(
        service: ActivitiesActivityService,
    ) {
        super(service);
    }

}