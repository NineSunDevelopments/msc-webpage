import {DateTime} from "luxon";
import {MongoEntity} from "./mongo-entity";

export namespace MSCSettings {
    export interface PersonalInfo {
        name: string;
        email: string;
        phone: string;
    }

    /**
     * Represents a CorpsInCharge entity, extending the MongoEntity interface.
     * This entity manages the information related to corps leadership and associated banking details.
     *
     * @interface CorpsInCharge
     * @extends MongoEntity
     *
     * @property {string} corpsId - The unique identifier for the corps.
     * @property {string} senior - The identifier or name of the senior the corps.
     * @property {string} conSenior - The identifier or name of the consultative senior.
     * @property {string} subSenior - The identifier or name of the subordinate senior leader.
     * @property {Object} banking - Banking information for the corps.
     * @property {string} banking.iban - The International Bank Account Number for financial transactions.
     * @property {string} banking.bic - The Bank Identifier Code associated with the IBAN.
     * @property {string} banking.name - The name of the account holder or the banking entity.
     * @property {string} semesterId - The unique identifier for the current semester related to the corps.
     *
     */
    export interface CorpsInCharge extends MongoEntity {
        corpsId: string;
        senior: PersonalInfo;
        conSenior: PersonalInfo;
        subSenior: PersonalInfo;
        banker: PersonalInfo;
        banking: {
            iban: string;
            bic: string;
            name: string;
        }
        semesterId: string;
        active: boolean;
    }
}