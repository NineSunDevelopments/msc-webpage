import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ReportFencingService} from "../../services/report-fencing.service";
import {Report} from "@shared/types/report";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ReportFencingController extends DataController<Report.Fencing, ReportFencingService> implements ControllerInstance {

    constructor(
        service: ReportFencingService,
    ) {
        super(service);
    }

}