import {BaseController, Controller, ControllerInstance, DataController, Get,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {CorpsMember} from "@shared/types/corps-member";
import {CorpsMemberService} from "../../services/corps-member.service";
import {Request, Response} from "express";
import {CorpsService} from "../../services/corps.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class CorpsMemberController extends DataController<CorpsMember, CorpsMemberService> implements ControllerInstance {

    constructor(
        service: CorpsMemberService,
        private corpsService: CorpsService
    ) {
        super(service);
    }


    @Get({
        path: "corps/:id"
    })
    public async getForCorps(request: Request, response: Response) {
        const id = BaseController.getId(request);
        const corps = await this.corpsService.getById(id);
    }
}