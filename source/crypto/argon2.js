const nodeArgon2 = require("argon2");
const toBuffer = require("typedarray-to-buffer");

function argon2(
    password,
    salt,
    memory,
    iterations,
    length,
    parallelism,
    type,
    version
) {
    return nodeArgon2.hash(toBuffer(password), {
        salt: toBuffer(salt),
        type,
        memoryCost: memory,
        hashLength: length,
        parallelism,
        version,
        timeCost: iterations,
        raw: true,
    });
}

module.exports = {
    argon2,
};
