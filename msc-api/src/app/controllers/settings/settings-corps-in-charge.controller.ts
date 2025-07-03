import {Controller, ControllerInstance, DataController, Respond, Get} from "../../utilities/controller";
import {MIDDLEWARE} from "../../application";
import {CorpsInChargeService} from "../../services/corps-in-charge.service";
import {MSCSettings} from "@shared/types/MSCSettings";


@Controller({
    prefix: "corps-in-charge",
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class SettingsCorpsInChargeController extends DataController<MSCSettings.CorpsInCharge, CorpsInChargeService> implements ControllerInstance {

    constructor(
        service: CorpsInChargeService,
    ) {
        super(service);
    }

    @Get({ path: "current" })
    public async getCurrent(request, response): Promise<void> {
        const data = await this.service.getCurrent();
        Respond({response, data});
    }

}