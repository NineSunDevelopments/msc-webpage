import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ActivitiesSemesterService} from "../../services/activities-semester.service";
import {Activities} from "@shared/types/activities";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ActivitiesSemesterController extends DataController<Activities.Semester, ActivitiesSemesterService> implements ControllerInstance {

    constructor(
        service: ActivitiesSemesterService,
    ) {
        super(service);
    }

}