import {Injectable} from "../utilities/injectable";
import {DataService} from "../utilities/data.service";
import {MongoConnector} from "../utilities/mongoConnector";
import {Corps} from "@shared/types/corps";
import {DateTime} from "luxon";

const StaticCorpsList: {name: string, image: string, external: boolean}[] = [
    { name: "suevia", image: "/assets/images/wappen/suevia.jpg", external: false },
    { name: "palatia", image: "/assets/images/wappen/palatia.jpg", external: false },
    { name: "bavaria", image: "/assets/images/wappen/bavaria.png", external: false },
    { name: "isaria", image: "/assets/images/wappen/isaria.png", external: false },
    { name: "franconia", image: "/assets/images/wappen/franconia.png", external: false },
    { name: "hubertia", image: "/assets/images/wappen/hubertia.jpg", external: false },
    { name: "arminia", image: "/assets/images/wappen/arminia.jpg", external: false },
    { name: "makaria", image: "/assets/images/wappen/makaria.jpg", external: false },
    { name: "cisaria", image: "/assets/images/wappen/cisaria.jpg", external: false },
    { name: "rheno_palatia", image: "/assets/images/wappen/rheno_palatia.jpg", external: false },
    { name: "vitruvia", image: "/assets/images/wappen/vitruvia.png", external: false },
    { name: "germania", image: "/assets/images/wappen/germania.jpg", external: false },
    { name: "transrhenania", image: "/assets/images/wappen/transrhenania.jpg", external: false },
    { name: "normannia_vandalia", image: "/assets/images/wappen/normannia_vandalia.jpg", external: false },
    { name: "suevo_guestphalia", image: "/assets/images/wappen/suevo_guestphalia.jpg", external: false },
    { name: "saxo_thuringia", image: "/assets/images/wappen/saxo_thuringia.png", external: false },
    { name: "alemannia", image: "/assets/images/wappen/alemannia.png", external: false },
    { name: "donaria", image: "/assets/images/wappen/donaria.jpg", external: false },
    { name: "budissa", image: "/assets/images/wappen/budissa.jpg", external: true },
    { name: "franconia_jena", image: "/assets/images/wappen/franconia_jena.jpg", external: true },
    { name: "pomerania", image: "/assets/images/wappen/pomerania.jpg", external: true },
    { name: "rhaetia", image: "/assets/images/wappen/rhaetia.jpg", external: true },
];

@Injectable()
export class CorpsService extends DataService<Corps, MongoConnector<Corps>> {

    constructor(
        connector: MongoConnector<Corps>,
    ) {
        super("corps", connector);
    }

    public init(): Promise<any> {
        return this.getAll().then(async (corpsList: Corps[]) => {
            if (corpsList.length === 0) {
                console.info("Corps table not initialized, adding static corps");
                return StaticCorpsList.map(async (corps, index) => {
                    let name = corps.name[0].toUpperCase() + corps.name.slice(1);
                    if (name.includes("_")) {
                        name = name.split("_").map(x => x[0].toUpperCase() + x.slice(1)).join("-");
                    }

                    return this.create({
                        coatOfArms: corps.image,
                        position: index,
                        url: "",
                        createdAt: DateTime.now(),
                        deleted: false,
                        external: corps.external,
                        name,
                        updatedAt: DateTime.now()
                    })
                });
            }

            return;
        });
    }

    public async getAll(skipSanitization: boolean = false): Promise<Corps[]> {
        return super.getAll(skipSanitization).then(list => list.sort((a, b) => a.position - b.position));
    }
}