var bcrypt = require('bcrypt')

getHash('Test@1234')


async function getHash(input){
    var hasedop = await bcrypt.hash(input, 10)
    console.log(hasedop)
    var isMatch = await bcrypt.compare('Test@1234', hasedop) ? "Matched" : "Wrong"
    console.log(isMatch)
    hasedop = await bcrypt.hash(input, 10)
    console.log(hasedop)
    return hasedop
}