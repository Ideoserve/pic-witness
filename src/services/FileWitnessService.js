export const setContractHash = async (web3, hash) => {
    const items = await web3.setHash(hash, { from: web3.address });
    return items;
}

export const getContractHash = async (web3) => {
    console.log('Getting contract hash. Web3 address: ' + web3.address)
    const items = await web3.getHash(web3.address);
    return items;
}