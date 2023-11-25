import { enqueueSnackbar } from "notistack";
import { ApiError, AssertionOptions, AuthService, AuthenticatorAssertionRawResponse, PublicKeyCredentialType } from "../api";
import { PickNotNullable, coerceToArrayBuffer, coerceToBase64Url } from "./helpers";


export const getAssertionOptions = async (username?: string) => {
    let makeAssertionOptions: AssertionOptions;
    try {
        makeAssertionOptions = await AuthService.getApiAuthAssertionOptions(username)
    } catch (e) {
        const error = e as ApiError
        enqueueSnackbar(`API: ${error.url} throws ${error.message}`, { variant: 'error' })
        return;
    }

    // show options error to user
    if (makeAssertionOptions.status !== "ok") {
        enqueueSnackbar(`Error while creating credential options: ${makeAssertionOptions.errorMessage}`, { variant: 'error' })
        return;
    }

    return makeAssertionOptions;
}

export const parseAssertionOptions = async (options: AssertionOptions) => {
    const optionNotNullable = options as PickNotNullable<AssertionOptions>;
    const makeAssertionOptions: PublicKeyCredentialRequestOptions = {
        ...optionNotNullable,
        challenge: coerceToArrayBuffer(options.challenge, 'AssertionOptions.challenge'),
        allowCredentials: options.allowCredentials?.map(cred => {
            return {
                ...cred,
                transports: cred.transports == null ? undefined : cred.transports,
                id: coerceToArrayBuffer(cred.id, 'PublicKeyCredentialDescriptor.id'),
                type: PublicKeyCredentialType.PUBLIC_KEY,
            }
        }),
        extensions: { ...options.extensions, appid: options.extensions?.appid == null ? undefined : options.extensions?.appid }
    }

    return makeAssertionOptions;
}

export const parseAssertionResponse = (assertedCredential: PublicKeyCredential): AuthenticatorAssertionRawResponse => {
    const response = assertedCredential.response as AuthenticatorAssertionResponse
    const authData = new Uint8Array(response.authenticatorData);
    const clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    const rawId = new Uint8Array(assertedCredential.rawId);
    const sig = new Uint8Array(response.signature);
    const userHandle = response.userHandle !== null ? new Uint8Array(response.userHandle) : null
    const data = {
        id: assertedCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: PublicKeyCredentialType.PUBLIC_KEY,
        extensions: assertedCredential.getClientExtensionResults(),
        response: {
            authenticatorData: coerceToBase64Url(authData),
            clientDataJSON: coerceToBase64Url(clientDataJSON),
            userHandle: userHandle !== null ? coerceToBase64Url(userHandle) : null,
            signature: coerceToBase64Url(sig)
        }
    };

    return data
}

export const postAssertedCredential = async (assertionRawResponse: AuthenticatorAssertionRawResponse) => {
    let token: string;
    try {
        token = await AuthService.postApiAuthAssertion(assertionRawResponse)
    } catch (e) {
        const error = e as ApiError
        enqueueSnackbar(`API: ${error.url} returns ${error.message}`, { variant: 'error' })
        return;
    }

    return token
}