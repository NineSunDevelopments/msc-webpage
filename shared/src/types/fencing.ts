import {DateTime} from "luxon";
import {MongoEntity} from "./mongo-entity";


export namespace Fencing {

    /**
     * Represents a fencing day event within the system.
     *
     * This interface defines the structure for a fencing day event, including its
     * date, location, associated corps, official status, and additional related metadata.
     * It also includes information about matches conducted during the event.
     *
     * Day extends the MongoEntity to ensure compatibility with the database schema.
     *
     * Properties:
     * @property {DateTime} date - The date of the fencing day.
     * @property {string} location - The location of the fencing day.
     * @property {string} corpsId - The unique identifier associated with the fencing day's corps.
     * @property {boolean} official - Indicates whether the fencing day is official.
     * @property {string} description - A brief description or additional information about the fencing day.
     * @property {string} semesterId - The unique identifier associated with the fencing day's semester.
     * @property {Object[]} matches - A list of matches conducted during the fencing day.
     * @property {string} matches.corpsId - The unique identifier associated with the match's corps.
     * @property {string} matches.doctorId - The unique identifier associated with the match's doctor.
     * @property {number} matches.partyALevel - The party level of the first party.
     * @property {number} matches.partyBLevel - The party level of the second party.
     * @property {string} matches.notes - Additional notes or information about the match.
     *
     */
    export interface Day extends MongoEntity {
        date: DateTime;
        location: string;
        corpsId: string;
        official: boolean;
        description: string;
        semesterId: string;
        matches: {
            corpsId: string;
            doctorId: string;
            partyALevel: number;
            partyBLevel: number;
            notes: string;
        }
    }

    /**
     * Represents a Doctor entity with relevant details.
     * Extends the MongoEntity interface.
     *
     * @interface Doctor
     *
     * @property {string} name - The full name of the doctor.
     * @property {boolean} active - Indicates whether the doctor is currently active.
     * @property {string} corpsId - The identifier associated with the doctor in the organization's system.
     * @property {boolean} external - Specifies if the doctor is an external consultant.
     * @property {string} email - The email address of the doctor.
     * @property {string} phone - The contact phone number of the doctor.
     */
    export interface Doctor extends MongoEntity {
        name: string;
        active: boolean;
        corpsId: string;
        external: boolean;
        email: string;
        phone: string;
    }

    /**
     * Represents an Arbiter entity, which extends MongoEntity.
     * An Arbiter is responsible for overseeing operations and is identified by specific attributes.
     *
     * @interface Arbiter
     * @extends MongoEntity
     *
     * @property {string} name - The name of the arbiter.
     * @property {boolean} active - Indicates whether the arbiter is currently active.
     * @property {string} corpsId - The identifier of the corps this arbiter is associated with.
     * @property {string} email - The email address of the arbiter.
     * @property {string} phone - The phone number of the arbiter.
     */
    export interface Arbiter extends MongoEntity {
        name: string;
        active: boolean;
        corpsId: string;
        email: string;
        phone: string;
    }
}
