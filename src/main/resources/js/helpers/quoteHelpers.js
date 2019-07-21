export default function generateKey(currentUsedKeys) {
    let generatedKey = Math.floor(Math.random() * 99999)
    if(!keyIsOriginal(currentUsedKeys, generatedKey)) {
        generatedKey = generateKey(currentUsedKeys)
    }
    return generatedKey
}
function keyIsOriginal(currentUsedKeys, generatedKey) {
    for (let i = 0; i < currentUsedKeys.length; i++) {
        if (currentUsedKeys[i] === generatedKey) {
            return false
        }
    }
    return true
}
