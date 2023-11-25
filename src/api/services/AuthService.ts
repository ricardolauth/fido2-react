/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssertionOptions } from '../models/AssertionOptions';
import type { AuthenticatorAssertionRawResponse } from '../models/AuthenticatorAssertionRawResponse';
import type { AuthenticatorAttestationRawResponse } from '../models/AuthenticatorAttestationRawResponse';
import type { CredentialCreateOptions } from '../models/CredentialCreateOptions';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @param requestBody 
     * @returns CredentialCreateOptions Success
     * @throws ApiError
     */
    public static createPublicKeyCredentialCreationOptions(
requestBody?: User,
): CancelablePromise<CredentialCreateOptions> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/creationOptions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns string Success
     * @throws ApiError
     */
    public static createCredential(
requestBody?: AuthenticatorAttestationRawResponse,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/createCredential',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param username 
     * @returns AssertionOptions Success
     * @throws ApiError
     */
    public static getApiAuthAssertionOptions(
username?: string,
): CancelablePromise<AssertionOptions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/assertion-options',
            query: {
                'username': username,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiAuthAssertion(
requestBody?: AuthenticatorAssertionRawResponse,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/assertion',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
