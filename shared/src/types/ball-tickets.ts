import {MongoEntity} from "./mongo-entity";


/**
 * Represents the structure of a BallTickets entity.
 *
 * This interface defines the required fields for a BallTickets object,
 * which extends the MongoEntity interface.
 * It includes details about the corporate entity, quantity of tickets,
 * and contact details.
 *
 * @interface BallTickets
 * @extends MongoEntity
 *
 * @property corpsId A unique identifier representing the corporate entity requesting the tickets.
 * @property amount The number of tickets requested.
 * @property contactPerson The name of the contact person for the ticket request.
 * @property contactPhone The phone number of the contact person.
 */
export interface BallTickets extends MongoEntity {
    corpsId: string;
    amount: number;
    contactPerson: string;
    contactPhone: string;
    semesterId: string;
}
