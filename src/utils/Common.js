/**
 * Formats a given number with spaces as thousands separators.
 *
 * @param {number} number   - The numeric value to be formatted.
 * @returns {string}        - The formatted string with spaces as thousands separators.
 */
export const formatNumberWithSpaces = (number) => {
    // Use toLocaleString to format the number with commas as thousands separators
    // and then replace commas with spaces to achieve the desired formatting.
    return number.toLocaleString('en-US').replace(/,/g, ' ');
}


// formatter datetime like 12/24/2023 08:30:00
/**
 * Formats a given datetime string or timestamp into a standardized format.
 *
 * @param {string | number} datetime    - The datetime string or timestamp to be formatted.
 * @returns {string}                    - The formatted datetime string in 'YYYY-MM-DD HH:mm:ss' format.
 */
export const formatDatetime = (datetime) => {

    // Define formatting options for the toLocaleString method
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    // Convert the input datetime to a Date object and format it using toLocaleString
    const formattedDatetime = new Date(datetime).toLocaleString('en-US', options);

    // Remove any commas that may be present in the formatted datetime string
    return formattedDatetime.replace(/,/g, '');
}

export const toStringForQRCode = (productId) => {
    return `inventory-track:${productId}`;
}

export const decodeData = (data) => {
    if (!data.includes(':')) {
        return {error: {message: 'Invalid QR code'}};
    } else {
        let parts = data.split(':');
        let nameApp = parts[0];
        let idProduct = parts[1];
        if (nameApp !== 'inventory-track') {
            return {error: {message: 'Invalid QR code'}};
        }

        return idProduct;
    }
}

export const showValue = (value) => {
    if (!value) return "";
    if (value.length <= 50) return value;
    return value.substring(0, 50) + "...";
};

export const showStatus = (data) => {
    return data
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
        .join(' ');
}
