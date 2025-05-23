import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ReportSemesterService} from "../../services/report-semester.service";
import {Report} from "@shared/types/report";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ReportSemesterController extends DataController<Report.Semester, ReportSemesterService> implements ControllerInstance {

    constructor(
        service: ReportSemesterService,
    ) {
        super(service);
    }

}