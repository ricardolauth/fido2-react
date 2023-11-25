/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttestationConveyancePreference } from './AttestationConveyancePreference';
import type { AuthenticationExtensionsClientInputs } from './AuthenticationExtensionsClientInputs';
import type { AuthenticatorSelection } from './AuthenticatorSelection';
import type { Fido2User } from './Fido2User';
import type { PubKeyCredParam } from './PubKeyCredParam';
import type { PublicKeyCredentialDescriptor } from './PublicKeyCredentialDescriptor';
import type { PublicKeyCredentialRpEntity } from './PublicKeyCredentialRpEntity';

export type CredentialCreateOptions = {
    status?: string | null;
    errorMessage?: string | null;
    rp?: PublicKeyCredentialRpEntity;
    user?: Fido2User;
    challenge?: string | null;
    pubKeyCredParams?: Array<PubKeyCredParam> | null;
    timeout?: number;
    attestation?: AttestationConveyancePreference;
    authenticatorSelection?: AuthenticatorSelection;
    excludeCredentials?: Array<PublicKeyCredentialDescriptor> | null;
    extensions?: AuthenticationExtensionsClientInputs;
};
