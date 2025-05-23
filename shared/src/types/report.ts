import {MongoEntity} from "./mongo-entity";
import {DateTime} from "luxon";
import {CorpsChangeType} from "../enums/corps-change-type";

export namespace Report {
    /**
     * Represents changes within a Corps entity.
     *
     * This interface defines the structure for tracking modifications or updates
     * related to a Corps. It extends the `MongoEntity` interface to include
     * MongoDB-specific entity fields.
     *
     * @interface CorpsChanges
     * @extends MongoEntity
     *
     * @property {CorpsChangeType} type - The type of change.
     * @property {string} name - The name of the Corps.
     * @property {DateTime} date - The date when the change was made.
     * @property {string} semesterId Unique identifier for the associated with the report.
     * @property {string} reason - The reason for the change.
     * @property {string} additionalInfo - Additional information about the change.
     * @property {boolean} honorable - Whether the change is honorable.
     *
     */
    export interface Change extends MongoEntity {
        type: CorpsChangeType;
        name: string;
        date: DateTime;
        semesterId: string;
        reason?: string;
        additionalInfo?: string;
        honorable?: boolean;
    }


    /**
     * Represents a semester report within a system.
     *
     * This interface is designed to store the necessary details
     * regarding a report submitted for a specific semester.
     * It includes information about the associated corps, due dates,
     * personnel involved, and the details of honorable judges.
     *
     * @interface SemesterReport
     * @extends MongoEntity
     *
     * @property {string} corpsId Unique identifier for the corps associated with the semester report.
     * @property {string[]} changes List of changes documented in the report.
     * @property {DateTime} dueDate Deadline for the submission of the semester report.
     * @property {string} semesterId Unique identifier for the semester associated with the report.
     * @property {string} senior MemberID of the senior member involved in the report.
     * @property {string} conSenior MemberID of the con-senior member associated with the report.
     * @property {string} subSenior MemberID of the sub-senior member involved in the report.
     * @property {string} fuchsMajor MemberID of the Fuchs major responsible for the report.
     * @property {DateTime} submitDate The actual submission date of the report.
     * @property {Object[]} honorableJudge List containing details of the honorable judge(s).
     * @property {string} honorableJudge.firstName First name of the judge
     * @property {string} honorableJudge.lastName Last name of the judge
     * @property {string} honorableJudge.address Address of the judge
     * @property {string} honorableJudge.phone Phone number of the judge
     * @property {string} honorableJudge.email Email address of the judge
     *
     *
     */
    export interface Semester extends MongoEntity {
        corpsId: string;
        changes: string[];
        dueDate: DateTime;
        semesterId: string;
        senior: string;
        conSenior: string;
        subSenior: string;
        fuchsMajor: string;
        submitDate: DateTime;
        honorableJudge: {
            firstName: string;
            lastName: string;
            address: string;
            phone: string;
            email: string;
        }[];
    }

    /**
     * Represents a fencing report within a system.
     *
     * This interface is designed to store the necessary details
     * regarding a fencing report submitted for a specific fencing day.
     * It includes information about the associated fencing day,
     * the party levels, and any notes.
     *
     * @interface FencingReport
     * @extends MongoEntity
     *
     * @property {string} corpsId Unique identifier for the corps associated with the fencing report.
     * @property {DateTime} dueDate Deadline for the submission of the fencing report.
     * @property {DateTime} submitDate The actual submission date of the report.
     * @property {string} semesterId Unique identifier for the semester associated with the report.
     * @property {string} fencingDayId Unique identifier for the fencing day associated with the report.
     * @property {number} partyALevel Party level of the first party.
     * @property {number} partyBLevel Party level of the second party.
     * @property {string} notes Additional notes or information about the match.
     *
     */
    export interface Fencing extends MongoEntity {
        corpsId: string;
        dueDate: DateTime;
        submitDate: DateTime;
        semesterId: string;
        fencingDayId: string;
        partyALevel: number;
        partyBLevel: number;
        notes: string;
    }
}