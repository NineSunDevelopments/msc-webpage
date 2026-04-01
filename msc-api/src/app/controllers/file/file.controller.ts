import {
    BaseController,
    Controller,
    ControllerInstance,
    DataController, Delete,
    Get,
    Post,
    Respond,
    RESPONSE_TYPE,
} from "../../utilities/controller";
import {Request, Response} from 'express';
import {MIDDLEWARE} from "../../application";
import {STATUS_CODE} from "../../constants/status-codes";
import {FileManager} from "@shared/types/file-manager";
import {FileManagerService} from "../../services/file-manager.service";
import {Log} from "../../utilities/type";


@Controller({
    middlewares: [MIDDLEWARE.AUTH]
})
export class FileController extends DataController<FileManager.File, FileManagerService> implements ControllerInstance {

    constructor(
        service: FileManagerService,
    ) {
        super(service);
    }

    @Get({path: '/download/:id'})
    public async download(request: Request, response: Response) {
        const id: string = BaseController.getId(request);
        const file = await this.service.getById(id);

        if (!file) {
            Respond({
                response,
                status: STATUS_CODE.NOT_FOUND,
                data: "Unable to find file with id: " + file._id
            });
            return;
        }


        const data = await this.service.readFile(file);

        Respond({
            response,
            type: RESPONSE_TYPE.RAW,
            data,
            header: {
                'Content-Type': file.mimeType,
                'Content-Disposition': `attachment; filename="${file.name}.${file.extension}"`,
            },
            status: STATUS_CODE.OK,
        })
    }

    @Post({path: '/upload/'})
    public async upload(request: Request, response: Response) {
        const rawFile: FileManager.File = {...request.body.file};
        const content: Buffer = Buffer.from(request.body.content, 'base64');
        const file = await this.service.getById(rawFile._id);

        if (!file) {
            Respond({
                response,
                status: STATUS_CODE.NOT_FOUND,
                data: "Unable to find file with id: " + rawFile._id
            });
            return;
        }

        this.service.writeFile(file, content)
            .then((data) => {
                    Respond({
                        response,
                        data,
                        status: STATUS_CODE.OK,
                    });
            })
            .catch((error) => {
                Respond({
                    response,
                    data: error,
                    status: STATUS_CODE.BAD_REQUEST,
                });
            });
    }

    @Delete({path: '/:id'})
    public override async delete(request: Request, response: Response) {
        const file = await this.service.getById(BaseController.getId(request));
        await this.service.deleteFile(file);
        await super.delete(request, response);
    }

    public filter(value: FileManager.File): boolean {
        return !value || !value.deleted;
    }
}
