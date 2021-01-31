import crypto from "crypto"

export const generateUserToken = () => {
    const hash = crypto.createHash("sha256")
    hash.update(`${Date.now()}_${(Math.random() * 1_00_000_000).toFixed(0)}`)
    return hash.digest("hex")
}
