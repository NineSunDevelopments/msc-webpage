
import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {MSCSettings} from "@shared/types/MSCSettings";
import {DateTime} from "luxon";
import {CorpsService} from "./corps.service";
import {ActivitiesSemesterService} from "./activities-semester.service";
import * as console from "node:console";

@Injectable()
export class CorpsInChargeService extends DataService<MSCSettings.CorpsInCharge, MongoConnector<MSCSettings.CorpsInCharge>> {

    constructor(
        connector: MongoConnector<MSCSettings.CorpsInCharge>,
        private corpsService: CorpsService,
        private semesterService: ActivitiesSemesterService,
    ) {
        super("corps-in-charge", connector);
    }

    public async init(): Promise<any> {
        const current = await this.getCurrent();

        if (!current) {
            const currentSemester = await this.semesterService.getCurrent();
            const corps = await this.corpsService.findOne("name = ?", ["Suevo-Guestphalia"]);

            await this.create({
                active: true,
                banking: {
                    bic: "BIC",
                    iban: "IBAN",
                    name: "BANK NAME"
                },
                corpsId: corps._id,
                deleted: false,
                semesterId: currentSemester._id,
                senior: {
                    name: "Senior",
                    phone: "+49 123456789",
                    email: "mail@msc-corps.de"
                },
                conSenior: {
                    name: "Consultant senior",
                    phone: "+49 123456789",
                    email: "mail@msc-corps.de"
                },
                subSenior: {
                    name: "Subservient senior",
                    phone: "+49 123456789",
                    email: "mail@msc-corps.de"
                },
                banker: {
                    name: "Subservient senior",
                    phone: "+49 123456789",
                    email: "mail@msc-corps.de"
                },
                createdAt: DateTime.now(),
                updatedAt: DateTime.now()
            });
            currentSemester.corpsId = corps._id;
            await this.semesterService.update(currentSemester);
        }

        return Promise.resolve();
    }

    public getCurrent(): Promise<MSCSettings.CorpsInCharge> {
        return this.findOne("deleted = ? AND active = ?", [false, true]);
    }
}