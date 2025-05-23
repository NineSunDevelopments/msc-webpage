import {Controller, ControllerInstance, DataController,} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {CorpsMember} from "@shared/types/corps-member";
import {CorpsMemberService} from "../../services/corps-member.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class CorpsMemberController extends DataController<CorpsMember, CorpsMemberService> implements ControllerInstance {

    constructor(
        service: CorpsMemberService,
    ) {
        super(service);
    }

}