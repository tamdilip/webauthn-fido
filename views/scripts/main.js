const AUTH_TIMEOUT = 60000;
const ATTESTATION = 'direct';
const KEY_TYPE = 'public-key';
const AUTH_ATTACH = 'platform';
const APP_HOST = location.host;
const APP_NAME = 'WebAuthn FIDO';
const DOM_ID = id => document.getElementById(id);
const DOM_CLASS = cl => document.getElementsByClassName(cl)?.[0];
const getChallenge = (key = `${new Date().getTime()}`) => Uint8Array.from(key, c => c.charCodeAt(0));

const resetOverlay = () => {
    DOM_CLASS('overlay').style.display = 'none';
    DOM_CLASS('overlay-spinner').style.display = 'none';
    DOM_CLASS('overlay-error').style.display = 'none';
    DOM_CLASS('overlay-success').style.display = 'none';
    DOM_CLASS('overlay-label').style.display = 'none';
    DOM_CLASS('overlay-label').innerHTML = 'Loading...';
};

const showSuccessOverlay = label => {
    DOM_CLASS('overlay').style.display = 'block';
    DOM_CLASS('overlay-spinner').style.display = 'none';
    DOM_CLASS('overlay-error').style.display = 'none';
    DOM_CLASS('overlay-success').style.display = 'block';
    DOM_CLASS('overlay-label').style.display = 'block';
    DOM_CLASS('overlay-label').innerHTML = label || 'Success !';

    setTimeout(() => {
        resetOverlay();
    }, 3000);
};

const showErrorOverlay = label => {
    DOM_CLASS('overlay').style.display = 'block';
    DOM_CLASS('overlay-spinner').style.display = 'none';
    DOM_CLASS('overlay-error').style.display = 'block';
    DOM_CLASS('overlay-success').style.display = 'none';
    DOM_CLASS('overlay-label').style.display = 'block';
    DOM_CLASS('overlay-label').innerHTML = label || 'Failed !';

    setTimeout(() => {
        resetOverlay();
    }, 3000);
};

const showLoadingOverlay = label => {
    DOM_CLASS('overlay').style.display = 'block';
    DOM_CLASS('overlay-spinner').style.display = 'block';
    DOM_CLASS('overlay-error').style.display = 'none';
    DOM_CLASS('overlay-success').style.display = 'none';
    DOM_CLASS('overlay-label').style.display = 'block';
    DOM_CLASS('overlay-label').innerHTML = label || 'Loading...';
};

DOM_CLASS('home').style.display = 'none';
resetOverlay();

const promisyFetch = (method, url, data) =>
    new Promise((res, rej) => {
        const reqOpt = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(url, reqOpt)
            .then((response) => response.ok ? response.json() : rej(response))
            .then(res)
            .catch(rej);
    });

let createdUser, userInfo;
const onRegister = async () => {
    try {
        showLoadingOverlay('Registering...');

        const username = DOM_ID('username').value;
        const publicKey = await promisyFetch('POST', '/register-request', { username });
        publicKey.user.id = getChallenge(username);
        publicKey.challenge = getChallenge();
        const authCreate = await navigator.credentials.create({ publicKey });

        createdUser = authCreate;
        showSuccessOverlay('Registered !');
    } catch (error) {
        console.log(error);
        showErrorOverlay(error?.status === 409 ? 'Username already exists !' : 'Error registering !');
    }
};

const onSignIn = async () => {
    try {
        showLoadingOverlay('Signing in...');

        const credentialRequestOptions = {
            rpId: APP_HOST,
            timeout: AUTH_TIMEOUT,
            challenge: getChallenge(),
            userVerification: 'required',
            allowCredentials: [{ id: base64URLDecode(createdUser.id), type: KEY_TYPE }]
        };
        await navigator.credentials.get({ publicKey: credentialRequestOptions });

        showSuccessOverlay('Signed in !');
        DOM_CLASS('authentication').style.display = 'none';
        DOM_CLASS('home').style.display = 'block';
        DOM_ID('signedUser').innerHTML = createdUser.id;
    } catch (error) {
        showErrorOverlay('Error signing in !');
    }
};

const onSignOut = () => {
    location.reload();
};
