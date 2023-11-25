/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuthenticationExtensionsClientOutputs } from './AuthenticationExtensionsClientOutputs';
import type { PublicKeyCredentialType } from './PublicKeyCredentialType';
import type { ResponseData } from './ResponseData';

export type AuthenticatorAttestationRawResponse = {
    id?: string | null;
    rawId?: string | null;
    type?: PublicKeyCredentialType;
    response?: ResponseData;
    extensions?: AuthenticationExtensionsClientOutputs;
};
