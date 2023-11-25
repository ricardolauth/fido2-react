import { AuthService, CredentialCreateOptions, PublicKeyCredentialType, User } from "../api";
import { coerceToArrayBuffer, coerceToBase64Url } from "./helpers";

export const makeCredentialOptions = async (user?: Pick<User, 'username' | 'displayName'>) => {
    let makeCredentialOptions: CredentialCreateOptions;
    try {
        makeCredentialOptions = await AuthService.createPublicKeyCredentialCreationOptions(user)
    } catch (e) {
        console.error(e);
        //showErrorAlert(msg);
        return;
    }

    if (makeCredentialOptions.status !== "ok") {
        console.log("Error creating credential options");
        console.log(makeCredentialOptions.errorMessage);
        //showErrorAlert(makeCredentialOptions.errorMessage);
        return;
    }

    return makeCredentialOptions
}

export const parseCredentialCreattionOptions = (options: CredentialCreateOptions): PublicKeyCredentialCreationOptions => {
    const data: any = {
        ...options,
        challenge: coerceToArrayBuffer(options.challenge, 'challenge'),
        user: { id: coerceToArrayBuffer(options.user!.id, 'user.id'), displayName: options.user!.displayName!, name: options.user!.name! },
        excludeCredentials: options.excludeCredentials?.map(c => { return { id: coerceToArrayBuffer(c.id!, 'excludeCredentials.id'), type: PublicKeyCredentialType.PUBLIC_KEY, transports: c.transports == null ? undefined : c.transports } }),
        extensions: undefined,
        authenticatorSelection: { ...options.authenticatorSelection, authenticatorAttachment: options.authenticatorSelection?.authenticatorAttachment == null ? undefined : options.authenticatorSelection?.authenticatorAttachment }
    }

    return data
}

// This should be used to verify the auth data with the server
export async function registerNewCredential(newCredential: PublicKeyCredential) {
    // Move data into Arrays incase it is super long
    const attestationResponse = newCredential.response as AuthenticatorAttestationResponse
    let attestationObject = new Uint8Array(attestationResponse.attestationObject);
    let clientDataJSON = new Uint8Array(attestationResponse.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    const data = {
        id: newCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: PublicKeyCredentialType.PUBLIC_KEY,
        extensions: newCredential.getClientExtensionResults(),
        response: {
            attestationObject: coerceToBase64Url(attestationObject),
            clientDataJSON: coerceToBase64Url(clientDataJSON)
        }
    };

    console.log(data)

    let response;
    try {
        response = await AuthService.createCredential(data)
    } catch (e) {
        console.log(e)
    }

    return response
}