import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ReportChangeService} from "../../services/report-change.service";
import {Report} from "@shared/types/report";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ReportChangeController extends DataController<Report.Change, ReportChangeService> implements ControllerInstance {

    constructor(
        service: ReportChangeService,
    ) {
        super(service);
    }

}