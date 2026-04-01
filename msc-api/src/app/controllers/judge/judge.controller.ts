import {
    Controller,
    ControllerInstance,
    DataController, Get,
} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {Judge} from "@shared/types/judge";
import {JudgeService} from "../../services/judge.service";
import {Request, Response} from "express";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class JudgeController extends DataController<Judge, JudgeService> implements ControllerInstance {

    constructor(
        service: JudgeService
    ) {
        super(service);
    }

    @Get()
    public override async getAll(request: Request, response: Response): Promise<void> {
        await super.getAll(request, response);
    }
}
