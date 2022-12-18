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
resetOverlay();

const showSuccessOverlay = (label, disable = true) => {
    DOM_CLASS('overlay').style.display = 'block';
    DOM_CLASS('overlay-spinner').style.display = 'none';
    DOM_CLASS('overlay-error').style.display = 'none';
    DOM_CLASS('overlay-success').style.display = 'block';
    DOM_CLASS('overlay-label').style.display = 'block';
    DOM_CLASS('overlay-label').innerHTML = label || 'Success !';

    if (disable)
        setTimeout(() => {
            resetOverlay();
        }, 3000);
};

const showErrorOverlay = (label, disable = true) => {
    DOM_CLASS('overlay').style.display = 'block';
    DOM_CLASS('overlay-spinner').style.display = 'none';
    DOM_CLASS('overlay-error').style.display = 'block';
    DOM_CLASS('overlay-success').style.display = 'none';
    DOM_CLASS('overlay-label').style.display = 'block';
    DOM_CLASS('overlay-label').innerHTML = label || 'Failed !';

    if (disable)
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

if (!window.PublicKeyCredential) showErrorOverlay('WebAuthn not supported in this browser !', false);

const promisyFetch = (method, url, data) =>
    new Promise((res, rej) => {
        const reqOpt = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(url, reqOpt)
            .then(response => response.ok ? response.json() : rej(response))
            .then(res)
            .catch(rej);
    });

const onRegister = async () => {
    try {
        showLoadingOverlay('Registering...');

        const username = DOM_ID('username').value;
        const publicKey = await promisyFetch('POST', '/register-request', { username });
        publicKey.user.id = getChallenge(username);
        publicKey.challenge = getChallenge();
        const registeredResponse = await navigator.credentials.create({ publicKey });
        await promisyFetch('POST', '/register-response', { username, id: registeredResponse.id });

        showSuccessOverlay('Registered !');
    } catch (error) {
        showErrorOverlay(error?.status === 409 ? 'Username already exists !' : 'Error registering !');
    }
};

const onSignIn = async () => {
    try {
        showLoadingOverlay('Signing in...');

        const username = DOM_ID('username').value;
        const publicKey = await promisyFetch('POST', '/login-request', { username });
        publicKey.challenge = getChallenge();
        const userId = publicKey.allowCredentials[0].id;
        publicKey.allowCredentials[0].id = base64URLDecode(userId);

        await navigator.credentials.get({ publicKey });

        showSuccessOverlay('Signed in !');

        DOM_CLASS('authentication').style.display = 'none';
        DOM_CLASS('home').style.display = 'block';
        DOM_ID('signedUser').innerHTML = username;
        //DOM_ID('userId').innerHTML = userId;
    } catch (error) {
        showErrorOverlay('Error signing in !');
    }
};

const onSignOut = () => {
    location.reload();
};
