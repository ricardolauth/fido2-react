/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssertionResponse } from './AssertionResponse';
import type { AuthenticationExtensionsClientOutputs } from './AuthenticationExtensionsClientOutputs';
import type { PublicKeyCredentialType } from './PublicKeyCredentialType';

export type AuthenticatorAssertionRawResponse = {
    id?: string | null;
    rawId?: string | null;
    response?: AssertionResponse;
    type?: PublicKeyCredentialType;
    extensions?: AuthenticationExtensionsClientOutputs;
};
