import CryptoJS from 'crypto-js';

// You should store this secret key securely - consider using environment variables
const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY || 'e!*cs4g+o38ff1*jf@w7$+quu1-*j1i&f(@3pjxlr5+*nttc6-';

const encryptData = (data) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

// Check if data is already encrypted (simple heuristic)
const isEncrypted = (data) => {
    // Encrypted data from CryptoJS.AES looks like base64 with specific patterns
    // This is a simple check - you might want to make it more robust
    try {
        JSON.parse(data);
        return false; // If it's valid JSON, it's likely not encrypted
    } catch (e) {
        return true; // If it's not valid JSON, it's likely encrypted
    }
};

// Custom encrypted storage adapter for redux-persist
const encryptedStorage = {
    setItem: (key, value) => {
        const encryptedValue = encryptData(value);
        if (encryptedValue) {
            localStorage.setItem(key, encryptedValue);
            return Promise.resolve();
        }
        return Promise.reject(new Error('Failed to encrypt data'));
    },

    getItem: (key) => {
        const storedValue = localStorage.getItem(key);
        if (!storedValue) {
            return Promise.resolve(null);
        }

        // Check if the stored value is encrypted
        if (isEncrypted(storedValue)) {
            // Try to decrypt it
            const decryptedValue = decryptData(storedValue);
            return Promise.resolve(decryptedValue);
        } else {
            // If it's not encrypted (legacy data), return as is and re-encrypt it
            try {
                const parsedValue = JSON.parse(storedValue);
                // Re-encrypt the data for next time
                setTimeout(() => {
                    this.setItem(key, storedValue);
                }, 0);
                return Promise.resolve(parsedValue);
            } catch (error) {
                console.error('Error parsing legacy data:', error);
                return Promise.resolve(null);
            }
        }
    },

    removeItem: (key) => {
        localStorage.removeItem(key);
        return Promise.resolve();
    },

    getAllKeys: () => {
        return Promise.resolve(Object.keys(localStorage));
    }
};

export default encryptedStorage;