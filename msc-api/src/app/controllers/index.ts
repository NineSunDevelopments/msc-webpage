import {ControllerInstance} from "../utilities/controller";
import {IndexController} from "./index/index.controller";
import {ReportFencingController} from "./report/report-fencing.controller";
import {AuthController} from "./auth/auth.controller";
import {Injectable} from "../utilities/injectable";
import {Injector, Instance} from "../utilities/injector";
import {BallTicketsController} from "./ball-tickets/ball-tickets.controller";
import {CorpsController} from "./corps/corps.controller";
import {ActivitiesActivityController} from "./activities/activities-activity.controller";
import {ActivitiesSemesterController} from "./activities/activities-semester.controller";
import {FencingDayController} from "./fencing/fencing-day.controller";
import {FencingDoctorController} from "./fencing/fencing-doctor.controller";
import {ReportSemesterController} from "./report/report-semester.controller";
import {ReportChangeController} from "./report/report-change.controller";
import {UserController} from "./user/user.controller";

@Injectable()
export class Router implements Instance {
    public routes: ControllerInstance[] = [];

    constructor() {
        this.routes = [
            // Basic API
            Injector.resolve(IndexController),
            Injector.resolve(AuthController),
            Injector.resolve(UserController),
            Injector.resolve(ReportFencingController),

            // Corpo
            Injector.resolve(BallTicketsController),
            Injector.resolve(CorpsController),
            Injector.resolve(ActivitiesActivityController),
            Injector.resolve(ActivitiesSemesterController),
            Injector.resolve(FencingDayController),
            Injector.resolve(FencingDoctorController),
            Injector.resolve(ReportFencingController),
            Injector.resolve(ReportSemesterController),
            Injector.resolve(ReportChangeController),
        ]
    }

    onDestroy?(): void {
    }
}
