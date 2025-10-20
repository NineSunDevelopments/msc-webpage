import {
    BaseController,
    Controller,
    ControllerInstance,
    DataController,
    Delete,
    Get,
    Post,
    Put,
    Respond,
} from "../../utilities/controller";
import {Request, Response} from 'express';
import {MIDDLEWARE} from "../../application";
import {UserService} from "../../services/user.service";
import {User} from "@shared/types/user";
import {STATUS_CODE} from "../../constants/status-codes";
import {HashPassword} from "../../utilities/dataUtils";
import {DateTime} from "luxon";
import {MailService} from "../../services/mail.service";


@Controller({
    middlewares: [MIDDLEWARE.NO_AUTH]
})
export class UserController extends DataController<User, UserService> implements ControllerInstance {

    constructor(
        service: UserService,
        private mailService: MailService,
    ) {
        super(service);
    }

    @Get()
    public async getAll(request: Request, response: Response) {
        const users = (await this.service.getAll()).filter(x => this.filter(x));
        Respond({response, data: users});
    }

    @Get({path: '/:id'})
    public async getById(request: Request, response: Response) {
        let id: string = BaseController.getParam(request, "id", null);
        const user = await this.service.getById(id);

        Respond({response, data: user});
    }

    @Get({path: '/reset-password/:id'})
    public async resetPassword(request: Request, response: Response) {
        let id: string = BaseController.getParam(request, "id", null);
        const user = await this.service.getById(id);

        await this.service.resetPassword(user);

        Respond({response, data: true});
    }

    @Post()
    public async create(request: Request, response: Response) {
        const protoUser: User = {...request.body};
        const now = DateTime.now();
        const newUser = await this.service.create({
            ...protoUser,
            createdAt: now,
            updatedAt: now,
            password: HashPassword(protoUser.password, now),
        });

        Respond({response, data: newUser});
    }

    @Post({path: '/create-new-corps-account'})
    public async createNewCorpsAccount(request: Request, response: Response) {
        const protoUser: User = {...request.body};
        const now = DateTime.now();
        const randomPassword = this.service.generatePassword();

        let newUser = {
            ...protoUser,
            password: HashPassword(randomPassword, now),
            createdAt: now,
            updatedAt: now,
        };

        if (newUser._id) {
            newUser = await this.service.update(newUser);
        } else {
            newUser = await this.service.create(newUser);
        }

        this.mailService.sendMail({
            to: newUser.email,
            subject: "MSC Account Erstellt",
            html: `Für Ihr Corps wurde ein neuer MSC-Account angelegt. <br>
                    Sie können sich unter <a href="https://msc-corps.de/intern">https://msc-corps.de/intern</a> anmelden.<br><br>
                    Nutzen Sie hierfür bitte folgende Zugangsdaten:<br>
                    <b>E-Mail: </b> <span>${newUser.email}</span><br>
                    <b>Passwort: </b> <span>${randomPassword}</span>`
        }).then();

        Respond({response, data: newUser});
    }

    @Put()
    public async update(request: Request, response: Response) {
        let user: User = request.body;

        if (!user) {
            Respond({
                response,
                status: STATUS_CODE.NOT_FOUND,
                data: "Unable to find user with mail: " + user.email
            });
            return;
        }

        if (!request.body.password) {
            const oldUser = await this.service.getById(user._id);
            user.password = oldUser.password;
        }

        user = await this.service.update(user);

        Respond({response, data: user});
    }

    @Delete({path: '/:id'})
    public async delete(request: Request, response: Response) {
        const id = BaseController.getParam(request, "id", "");
        await this.service.delete(id);
        Respond({response, data: true});
    }

    public filter(value: User): boolean {
        return !value || !value.deleted;
    }

}