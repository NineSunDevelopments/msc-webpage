import {DateTime} from "luxon";
import {MongoEntity} from "./mongo-entity";

/**
 * Represents an event with various attributes defining its details.
 *
 * @interface Activity
 *
 * @property {string} name - The name of the event.
 * @property {DateTime} date - The date of the event.
 * @property {string} location - The location of the event.
 * @property {string} semesterId - The ID of the semester the event belongs to.
 * @property {boolean} official - Whether the event is official.
 * @property {boolean} attendanceRequired - Whether attendance is required.
 * @property {string} description - A description of the event.
 *
 */
export interface Judge extends MongoEntity {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
}
