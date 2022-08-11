import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { use } from '@maticnetwork/maticjs'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
import { ethers } from 'ethers';
import { keccak_256 } from 'js-sha3';

export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

const detectProvider = async () => {
    if (window.ethereum) {
        return window.ethereum;
    } else if (window.web3) {
        return window.web3.currentProvider;
    } else {

        const provider = await detectEthereumProvider();
        alert(provider)
        return provider;
        alert('No provider detected. Install extension or wallet.')
    }
}

export let web3: Web3;

const initWeb3 = async () => {
    const provider = await detectProvider();
    console.log('provider > ', provider)
    let web3Provider;
    if (provider) {
        // @ts-ignore
        web3Provider = new Web3(provider);
    } else {
        web3Provider = new Web3("ws://localhost:8545");
    }
    web3 = web3Provider;
    return web3Provider;
}

initWeb3();


// install web3 plugin
use(Web3ClientPlugin)

var ethAddress = '0x299974AeD8911bcbd2C61262605b89F591a53E83';
var polygonAddress = '0x332A8191905fA8E6eeA7350B5799F225B8ed30a9';

var abi = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'string[]',
                name: 'keys',
                type: 'string[]',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getData',
        outputs: [
            {
                internalType: 'address',
                name: 'resolver',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'string[]',
                name: 'values',
                type: 'string[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    }
];

var polygonProvider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/demo");
var provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/demo");

var ethContract = new ethers.Contract(ethAddress, abi, provider);
var poligonContract = new ethers.Contract(polygonAddress, abi, polygonProvider);

function namehash(name: string) {
    const hashArray = hash(name);
    return arrayToHex(hashArray);
}

// @ts-ignore
function hash(name: string) {
    if (!name) {
        return new Uint8Array(32);
    }
    const [label, ...remainder] = name.split('.');
    const labelHash = keccak_256.array(label);
    // @ts-ignore
    const remainderHash = hash(remainder.join('.'));
    return keccak_256.array(new Uint8Array([...remainderHash, ...labelHash]));
}

function arrayToHex(arr: Uint8Array) {
    return '0x' + Array.prototype.map.call(arr, x => ('00' + x.toString(16)).slice(-2)).join('');
}

async function fetchContractData(contract: ethers.Contract, keys: string[], tokenId: string) {
    return contract.getData(keys, tokenId);
}

const interestedKeys = [
    'brad.crypto'
]

const tokenId = namehash(interestedKeys[0])

resolveBothChains(tokenId, interestedKeys)

async function resolveEthNetwork(tokenId: string, interestedKeys: string[]) {
    fetchContractData(ethContract, interestedKeys, tokenId).then(data => {
        console.log('Eth: ', data)
        console.log({
            ownerAddress: data.owner,
            resolverAddress: data.resolver,
            records: data[2]
        });
    });
}

function isEmpty(msg: string) {
    return !msg || msg === '0x0000000000000000000000000000000000000000';
}

async function resolveBothChains(tokenId: string, interestedKeys: string[]) {
    // try to resolve the polygon network first
    fetchContractData(poligonContract, interestedKeys, tokenId).then(data => {
        console.log('Polygon: ', data)
        if (isEmpty(data.owner)) {
            // if no owner for domain found on polygon network look up the eth network
            return resolveEthNetwork(tokenId, interestedKeys);
        }

        // proceed with polygon results
        console.log({
            ownerAddress: data.owner,
            resolverAddress: data.resolver,
            records: data[2]
        });

    });
}
