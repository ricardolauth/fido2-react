/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type Credential = {
    id?: string | null;
    userId?: string;
    publicKey?: string | null;
    signatureCounter?: number;
    credType?: string | null;
    aaGuid?: string;
    regDate?: string;
    user?: User;
};
