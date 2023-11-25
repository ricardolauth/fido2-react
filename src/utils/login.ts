import { ApiError, AssertionOptions, AssertionResponse, AuthService, AuthenticatorAssertionRawResponse, AuthenticatorAssertionRawResponse, PublicKeyCredentialType } from "../api";
import { PickNotNullable, coerceToArrayBuffer, coerceToBase64Url } from "./helpers";

async function handleSignInSubmit(event) {
    event.preventDefault();

    let username = this.username.value;

    // prepare form post data
    var formData = new FormData();
    formData.append('username', username);

    // send to server for registering
    let makeAssertionOptions;
    try {
        var res = await fetch('/assertionOptions', {
            method: 'POST', // or 'PUT'
            body: formData, // data can be `string` or {object}!
            headers: {
                'Accept': 'application/json'
            }
        });

        makeAssertionOptions = await res.json();
    } catch (e) {
        showErrorAlert("Request to server failed", e);
    }

    console.log("Assertion Options Object", makeAssertionOptions);

    // show options error to user
    if (makeAssertionOptions.status !== "ok") {
        console.log("Error creating assertion options");
        console.log(makeAssertionOptions.errorMessage);
        showErrorAlert(makeAssertionOptions.errorMessage);
        return;
    }

    // todo: switch this to coercebase64
    const challenge = makeAssertionOptions.challenge.replace(/-/g, "+").replace(/_/g, "/");
    makeAssertionOptions.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

    // fix escaping. Change this to coerce
    makeAssertionOptions.allowCredentials.forEach(function (listItem) {
        var fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
        listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
    });

    console.log("Assertion options", makeAssertionOptions);

    Swal.fire({
        title: 'Logging In...',
        text: 'Tap your security key to login.',
        imageUrl: "/images/securitykey.min.svg",
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        focusCancel: false
    });

    // ask browser for credentials (browser will ask connected authenticators)
    let credential;
    try {
        credential = await navigator.credentials.get({ publicKey: makeAssertionOptions })
    } catch (err) {
        showErrorAlert(err.message ? err.message : err);
    }

    try {
        await verifyAssertionWithServer(credential);
    } catch (e) {
        showErrorAlert("Could not verify assertion", e);
    }
}

/**
 * Sends the credential to the the FIDO2 server for assertion
 * @param {any} assertedCredential
 */
async function verifyAssertionWithServer(assertedCredential) {

    // Move data into Arrays incase it is super long
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    const data = {
        id: assertedCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: assertedCredential.type,
        extensions: assertedCredential.getClientExtensionResults(),
        response: {
            authenticatorData: coerceToBase64Url(authData),
            clientDataJSON: coerceToBase64Url(clientDataJSON),
            signature: coerceToBase64Url(sig)
        }
    };

    let response;
    try {
        let res = await fetch("/makeAssertion", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        response = await res.json();
    } catch (e) {
        showErrorAlert("Request to server failed", e);
        throw e;
    }

    console.log("Assertion Object", response);

    // show error
    if (response.status !== "ok") {
        console.log("Error doing assertion");
        console.log(response.errorMessage);
        showErrorAlert(response.errorMessage);
        return;
    }

    // show success message
    await Swal.fire({
        title: 'Logged In!',
        text: 'You\'re logged in successfully.',
        type: 'success',
        timer: 2000
    });

    // redirect to dashboard to show keys
    window.location.href = "/dashboard/" + value("#login-username");
}

export const getAssertionOptions = async (username?: string) => {
    let makeAssertionOptions: AssertionOptions;
    try {
        makeAssertionOptions = await AuthService.getApiAuthAssertionOptions(username)
    } catch (e) {
        //showErrorAlert("Request to server failed", e);
        const error = e as ApiError
        console.log(error.message)
        return;
    }

    console.log("Assertion Options Object", makeAssertionOptions);

    // show options error to user
    if (makeAssertionOptions.status !== "ok") {
        console.log("Error creating assertion options");
        console.log(makeAssertionOptions.errorMessage);
        //showErrorAlert(makeAssertionOptions.errorMessage);
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
        console.error(e)
        return;
    }

    return token
}