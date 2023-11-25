import { AuthService, AuthenticatorAttestationRawResponse, CredentialCreateOptions, PublicKeyCredentialType, ResponseData } from "../api";
import { coerceToArrayBuffer, coerceToBase64Url } from "./helpers";

async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // send to server for registering
    let makeCredentialOptions: CredentialCreateOptions;
    try {
        makeCredentialOptions = await AuthService.createPublicKeyCredentialCreationOptions(
            { displayName: data.get('name')?.toString(), username: data.get('username')?.toString() })

    } catch (e) {
        console.error(e);
        let msg = "Something wen't really wrong";
        //showErrorAlert(msg);
        return;
    }


    console.log("Credential Options Object", makeCredentialOptions);

    if (makeCredentialOptions.status !== "ok") {
        console.log("Error creating credential options");
        console.log(makeCredentialOptions.errorMessage);
        //showErrorAlert(makeCredentialOptions.errorMessage);
        return;
    }


    let credentialCreationOptions: any = { ...makeCredentialOptions };
    // Turn the challenge back into the accepted format of padded base64
    credentialCreationOptions.challenge = coerceToArrayBuffer(makeCredentialOptions.challenge, 'challenge');
    // Turn ID into a UInt8Array Buffer for some reason
    credentialCreationOptions.user.id = coerceToArrayBuffer(makeCredentialOptions.user!.id, 'user.id');

    credentialCreationOptions.excludeCredentials = credentialCreationOptions.excludeCredentials.map((c: PublicKeyCredentialDescriptor) => {
        c.id = coerceToArrayBuffer(c.id, 'PublicKeyCredentialDescriptor.id');
        return c;
    });



    credentialCreationOptions.pubKeyCredParams = makeCredentialOptions.pubKeyCredParams?.map((c) => {
        c.type = PublicKeyCredentialType.PUBLIC_KEY; // this is always public key 
        return c;
    });

    if (credentialCreationOptions.authenticatorSelection.authenticatorAttachment === null) {
        credentialCreationOptions.authenticatorSelection.authenticatorAttachment = undefined;
    }

    console.log("Credential Options Formatted", credentialCreationOptions);

    let newCredential;
    try {
        newCredential = await navigator.credentials.create({
            publicKey: credentialCreationOptions
        });
    } catch (e) {
        var msg = "Could not create credentials in browser. Probably because the username is already registered with your authenticator. Please change username or authenticator."
        console.error(msg, e);
        //showErrorAlert(msg, e);
    }


    console.log("PublicKeyCredential Created", newCredential);

    try {
        const result = await registerNewCredential(newCredential as PublicKeyCredential);
        console.log("handleSUbmit", result)
        return result
    } catch (e) {
        // showErrorAlert(err.message ? err.message : err);
        console.log(e)
    }
}



// This should be used to verify the auth data with the server
async function registerNewCredential(newCredential: any) {
    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
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
        console.log("regist", response)
    } catch (e) {
        console.log(e)
        //showErrorAlert(e);
    }

    // show success 

    // redirect to dashboard?
    //window.location.href = "/dashboard/" + state.user.displayName;
    return response
}

export default handleRegisterSubmit