/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuthenticationExtensionsClientInputs } from './AuthenticationExtensionsClientInputs';
import type { PublicKeyCredentialDescriptor } from './PublicKeyCredentialDescriptor';
import type { UserVerificationRequirement } from './UserVerificationRequirement';

export type AssertionOptions = {
    status?: string | null;
    errorMessage?: string | null;
    challenge?: string | null;
    timeout?: number;
    rpId?: string | null;
    allowCredentials?: Array<PublicKeyCredentialDescriptor> | null;
    userVerification?: UserVerificationRequirement;
    extensions?: AuthenticationExtensionsClientInputs;
};
