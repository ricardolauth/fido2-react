/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Credential } from './Credential';

export type User = {
    id?: string;
    createdOn?: string;
    updatedOn?: string;
    displayName?: string | null;
    username?: string | null;
    credentials?: Array<Credential> | null;
};
