import {
    BaseController,
    Controller,
    ControllerInstance,
    DataController,
    Get,
    Respond,
} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {ReportChangeService} from "../../services/report-change.service";
import {Report} from "@shared/types/report";
import {Request, Response} from "express";

@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class ReportChangeController extends DataController<Report.Change, ReportChangeService> implements ControllerInstance {

    constructor(
        service: ReportChangeService,
    ) {
        super(service);
    }

    @Get({ path: "/for-corps/:id" })
    public async forCorps(request: Request, response: Response) {
        const id = BaseController.getId(request);

        Respond({
            response,
            data: await this.service.findAll("corpsId = ?", [id])
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