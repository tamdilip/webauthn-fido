const ENV = Object.freeze({
    SERVER_PORT: process.env.PORT || 3000,
    AUTH_TIMEOUT: 60000,
    ATTESTATION: 'direct',
    KEY_TYPE: 'public-key',
    AUTH_ATTACH: 'platform',
    APP_NAME: 'WebAuthn FIDO'
});

module.exports = ENV;
