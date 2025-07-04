import {
    BaseController,
    Controller,
    ControllerInstance,
    DataController,
    Get,
    Respond,
} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ReportSemesterService} from "../../services/report-semester.service";
import {Report} from "@shared/types/report";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ReportSemesterController extends DataController<Report.Semester, ReportSemesterService> implements ControllerInstance {

    constructor(
        service: ReportSemesterService,
    ) {
        super(service);
    }

    @Get({ path: "/for-corps/:id" })
    public async forCorps(request: Request, response: Response) {
        const id = BaseController.getId(request);
        const data = await this.service.findAll("corpsId = ?", [id]);

        Respond({
            response,
            data
        });
    }

    @Get({ path: "/for-semester/:id" })
    public async forSemester(request: Request, response: Response) {
        const id = BaseController.getId(request);

        Respond({
            response,
            data: await this.service.findAll("semesterId = ?", [id])
        });
    }

}