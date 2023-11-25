/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuthenticatorAttachment } from './AuthenticatorAttachment';
import type { UserVerificationRequirement } from './UserVerificationRequirement';

export type AuthenticatorSelection = {
    authenticatorAttachment?: AuthenticatorAttachment;
    requireResidentKey?: boolean;
    userVerification?: UserVerificationRequirement;
};
