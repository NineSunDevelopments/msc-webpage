import {MongoEntity} from "./mongo-entity";
import {DateTime} from "luxon";


/**
 * Represents a user within the application.
 * This interface extends the MongoEntity base entity.
 *
 * @interface User
 * @extends MongoEntity
 *
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} corpsId - The ID of the Corps the user belongs to.
 * @property {boolean} activated - Whether the user has been activated.
 * @property {string} token - The current auth token of the user (null in db).
 * @property {string} salt - The salt used to hash the password.
 * @property {string} passwordResetToken - The token used to reset the password.
 * @property {DateTime} passwordResetValidUntil - The date until which the password reset token is valid.
 */
export interface User extends MongoEntity {
    email: string;
    password: string;
    corpsId: string;
    activated: boolean;
    token: string;
    salt?: string;
    passwordResetToken?: string;
    passwordResetValidUntil?: DateTime;
}
