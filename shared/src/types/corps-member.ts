import {MongoEntity} from "./mongo-entity";
import {MembershipState} from "../enums/membership-state";
import {DateTime} from "luxon";

export enum MemberChangeType {
    "ACEPIERT",
    "RECEPIERT",
    "INAKTIVIERT",
    "PHILISTRIERT",
    "LEAVE",
    "IP",
    "CI",
    "DIED"
}

export interface MemberChange extends MongoEntity {
    member: string; // MemberID
    type: MemberChangeType;
    date: DateTime;
    /**
     * Needs to be the name as only MSC-Corps have an ID
     */
    corpsName: string;
    comment: string;
}

/**
 * Represents a Corps Member entity.
 *
 * This interface extends `MongoEntity` and includes information
 * about the member's name and their memberships in different corps.
 *
 * @interface CorpsMember
 * @extends MongoEntity
 *
 * @property {Object[]} memberships - A list of memberships associated with the Corps Member.
 * @property {string} memberships.corps - The identification or name of the corps the member is associated with.
 * @property {MembershipState} memberships.state - The state of the membership (e.g., active, inactive).
 * @property {boolean} memberships.inMSC - Indicates whether the member is part of the MSC (Membership Specific Committee).
 * @property {string} name - The name of the Corps Member.
 */
export interface CorpsMember extends MongoEntity {
    memberships: {
        corps: string;
        state: MembershipState;
        inMSC: boolean;
    }[];
    name: string;
}
