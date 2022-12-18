const AUTH_TIMEOUT = 60000;
const ATTESTATION = 'direct';
const KEY_TYPE = 'public-key';
const AUTH_ATTACH = 'platform';
const APP_HOST = location.host;
const APP_NAME = 'WebAuthn FIDO';
const DOM_ID = id => document.getElementById(id);
const DOM_CLASS = cl => document.getElementsByClassName(cl)?.[0];
const getChallenge = (key = `${new Date().getTime()}`) => Uint8Array.from(key, c => c.charCodeAt(0));

DOM_CLASS('home').style.display = 'none';

let createdUser, userInfo;
const onRegister = async () => {
    const username = DOM_ID('username').value;

    userInfo = {
        name: username,
        displayName: username,
        id: getChallenge(username)
    };

    const publicKeyCredentialCreationOptions = {
        user: userInfo,
        timeout: AUTH_TIMEOUT,
        attestation: ATTESTATION,
        challenge: getChallenge(),
        rp: { id: APP_HOST, name: APP_NAME },
        pubKeyCredParams: [{ alg: -7, type: KEY_TYPE }],
        authenticatorSelection: { authenticatorAttachment: AUTH_ATTACH }
    };
    const authCreate = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });

    createdUser = authCreate;
};

const onSignIn = async () => {
    const credentialRequestOptions = {
        rpId: APP_HOST,
        timeout: AUTH_TIMEOUT,
        challenge: getChallenge(),
        userVerification: 'required',
        allowCredentials: [{ id: base64URLDecode(createdUser.id), type: KEY_TYPE }]
    };
    await navigator.credentials.get({ publicKey: credentialRequestOptions });

    DOM_CLASS('authentication').style.display = 'none';
    DOM_CLASS('home').style.display = 'block';
    DOM_ID('signedUser').innerHTML = userInfo.name;
};

const onSignOut = () => {
    location.reload();
};
