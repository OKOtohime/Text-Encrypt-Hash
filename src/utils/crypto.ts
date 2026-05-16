import CryptoJS from 'crypto-js';

const hashAlgorithms: Record<string, (message: string) => CryptoJS.lib.WordArray> = {
    'md5': CryptoJS.MD5,
    'sha1': CryptoJS.SHA1,
    'sha256': CryptoJS.SHA256,
    'sha224': CryptoJS.SHA224,
    'sha512': CryptoJS.SHA512,
    'sha384': CryptoJS.SHA384,
    'sha3': CryptoJS.SHA3,
    'ripemd160': CryptoJS.RIPEMD160,
};

const hmacAlgorithms: Record<string, (message: string, key: string) => CryptoJS.lib.WordArray> = {
    'hmac-md5': CryptoJS.HmacMD5,
    'hmac-sha1': CryptoJS.HmacSHA1,
    'hmac-sha256': CryptoJS.HmacSHA256,
    'hmac-sha224': CryptoJS.HmacSHA224,
    'hmac-sha512': CryptoJS.HmacSHA512,
    'hmac-sha384': CryptoJS.HmacSHA384,
    'hmac-sha3': CryptoJS.HmacSHA3,
    'hmac-ripemd160': CryptoJS.HmacRIPEMD160,
};

const cipherAlgorithms: Record<string, any> = {
    'aes': CryptoJS.AES,
    'des': CryptoJS.DES,
    'tripledes': CryptoJS.TripleDES,
    'rc4': CryptoJS.RC4,
    'rabbit': CryptoJS.Rabbit,
    'rabbit-legacy': CryptoJS.RabbitLegacy,
};

export function generateHash(text: string, type: string, key: string = ''): string {
    if (type.startsWith('hmac-')) {
        return hmacAlgorithms[type](text, key).toString();
    }
    return hashAlgorithms[type](text).toString();
}

export function generateEncryption(text: string, type: string, key: string = ''): string {
    if (type === 'base64') {
        const words = CryptoJS.enc.Utf8.parse(text);
        return CryptoJS.enc.Base64.stringify(words);
    }
    return cipherAlgorithms[type].encrypt(text, key).toString();
}

export function generateDecryption(ciphertext: string, type: string, key: string = ''): string {
    if (type === 'base64') {
        const words = CryptoJS.enc.Base64.parse(ciphertext);
        return words.toString(CryptoJS.enc.Utf8);
    }
    const decryptedWords = cipherAlgorithms[type].decrypt(ciphertext, key);
    return decryptedWords.toString(CryptoJS.enc.Utf8);
}