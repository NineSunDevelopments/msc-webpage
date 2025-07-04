import {DateTime} from "luxon";
import {MongoEntity} from "./mongo-entity";

export namespace Activities {
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
    export interface Activity extends MongoEntity {
        name: string;
        date: DateTime;
        location: string;
        semesterId: string;
        official: boolean;
        attendanceRequired: boolean;
        description: string;
    }

    export interface PersonalInfo {
        name: string;
        email: string;
        phone: string;
    }

    /**
     * Represents a semester, including its start and end dates, associated corps, and additional notes.
     *
     * @interface Semester
     *
     * @property {DateTime} start - The start date and time of the semester.
     * @property {DateTime} end - The end date and time of the semester.
     * @property {string} corpsId - The identifier for the corps associated with the semester.
     * @property {string} notes - Additional notes or information about the semester.
     */
    export interface Semester extends MongoEntity {
        name: string;
        start: DateTime;
        end: DateTime;
        corpsId: string;
        notes: string;
        senior?: PersonalInfo;
        conSenior?: PersonalInfo;
        subSenior?: PersonalInfo;
        banker?: PersonalInfo;
        banking?: {
            iban: string;
            bic: string;
            name: string;
        };
        honorableJudges?: {
            firstName: string;
            lastName: string;
            address: string;
            phone: string;
            email: string;
        }[];
    }
}