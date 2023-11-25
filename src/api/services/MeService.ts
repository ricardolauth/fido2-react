/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MeService {

    /**
     * @returns User Success
     * @throws ApiError
     */
    public static meAsync(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/me',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static deleteMeAsync(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/me',
        });
    }

    /**
     * @param id 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteMyCredentialAsync(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/me/credentials/{id}',
            path: {
                'id': id,
            },
        });
    }

}
