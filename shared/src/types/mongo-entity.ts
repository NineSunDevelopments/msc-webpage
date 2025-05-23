import {DateTime} from "luxon";


/**
 * Interface representing a MongoDB entity with common fields.
 *
 * This entity includes properties commonly associated with documents
 * in a MongoDB database, such as an optional unique identifier,
 * a deletion status, and timestamps for creation and updates.
 *
 * @interface MongoEntity
 *
 * @property string _id - The unique identifier of the entity.
 * @property boolean deleted - Whether the entity has been deleted.
 * @property DateTime createdAt - The date when the entity was created.
 * @property DateTime updatedAt - The date when the entity was last updated.
 *
 */
export interface MongoEntity {
    _id?: string;
    deleted: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}