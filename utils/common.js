const getChallenge = (key = `${new Date().getTime()}`) => Uint8Array.from(key, c => c.charCodeAt(0));

module.exports = { getChallenge };
