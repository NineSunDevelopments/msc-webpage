import {MongoEntity} from "./mongo-entity";
import {DateTime} from "luxon";


/**
 * Represents a Corps entity that extends the properties of a MongoEntity.
 * A Corps typically contains details such as its name, foundation date, colors,
 * coat of arms, signum, motto, and fencing motto.
 *
 * @interface Corps
 * @extends MongoEntity
 *
 * @property {string} name - The name of the Corps.
 * @property {DateTime} foundationDate - The date when the Corps was founded.
 * @property {string[]} colors - An array containing up to 5 color representations associated with the Corps.
 * @property {string} coatOfArms - The heraldic emblem or insignia representing the Corps.
 * @property {string} signum - The sign or distinctive mark representing the Corps.
 * @property {string} motto - The motto or slogan associated with the Corps.
 * @property {string} fencingMotto - The motto specifically related to the Corps’ fencing tradition.
 */
export interface Corps extends MongoEntity {
    name: string;
    colors: string[];
    position: number;
    url: string;
    coatOfArms: string;
    external: boolean;
}
