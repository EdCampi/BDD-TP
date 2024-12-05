function verifyId(id) {
    let idRegex = /^\d+$/;
    return idRegex.test(id);
}

function verifyCategory(category) {
    let categoryRegex = /^[a-zA-Z\s]+$/;
    return categoryRegex.test(category);
}

function verifyPrice(price) {
    let priceRegex = /^\$|\$\$|\$\$\$$/;
    return priceRegex.test(price);
}

function verifyAddress(address) {
    let addressRegNumName = /^\d{1,5} [a-zA-Z0-9\s]+$/;
    let addressRegNameNum = /^[a-zA-Z0-9\s]+ \d{1,5}$/;
    return addressRegNameNum.test(address) || addressRegNumName.test(address);
}

/*
 * Verifies if the string has no digits.
 */
function verifyAlphabeticString(str) {
    let provinceRegex = /^[a-zA-Z\s]+$/;
    return provinceRegex.test(str);
}

function verifyPhone(phone) {
    let phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone);
}

function validateFields({restaurant, category, price, address, city, province, phone}) {
    const validations = [
        {field: restaurant, message: 'Please enter a restaurant name'},
        {field: category, message: 'Please enter a category'},
        {field: price, message: 'Please enter a price'},
        {field: address, message: 'Please enter an address'},
        {field: city, message: 'Please enter a city'},
        {field: province, message: 'Please enter a province'},
        {field: phone, message: 'Please enter a phone number'}
    ];
    for (const {field, message} of validations) {
        if (!field) {
            return message;
        }
    }
    return null;
}

function validateInput({category, price, address, city, province, phone}) {
    if (!verifyAlphabeticString(category)) {
        return 'Please enter a valid category';
    }
    if (!verifyCategory(category)) {
        return 'Please enter a valid category';
    }
    if (!verifyPrice(price)) {
        return 'Please enter a valid price';
    }
    if (!verifyAddress(address)) {
        return 'Please enter a valid address';
    }
    if (!verifyAlphabeticString(city)) {
        return 'Please enter a valid city';
    }
    if (!verifyAlphabeticString(province)) {
        return 'Please enter a valid province or state';
    }
    if (!verifyPhone(phone)) {
        return 'Please enter a valid phone number';
    }
    return null;
}

async function verifyDuplicatedAddress(restaurant, address, city, province, connectionSQL) {
    return new Promise((resolve) => {
        connectionSQL.query(`SELECT * FROM restaurants WHERE address=? AND CITY=? AND province=?`, [restaurant, address, city, province], (err, result) => {
            if (result.length > 0) {
                resolve('Another restaurant has this address registered.');
            }
            resolve(null);
        });
    });
}

async function verifyDuplicatedPhone(phone, connectionSQL) {
    return new Promise((resolve) => {
        connectionSQL.query(`SELECT * FROM restaurants WHERE phone=?`, [phone], (err, result) => {
            if (result.length > 0) {
                resolve('Another restaurant has this phone number registered.');
            }
            resolve(null);
        });
    });
}

async function verifyDuplicatedRestaurant(restaurant, connectionSQL) {
    return new Promise((resolve) => {
        connectionSQL.query(`SELECT * FROM restaurants WHERE name=?`, [restaurant], (err, result) => {
            if (result.length > 0) {
                resolve('Another restaurant has this name registered.');
            }
            resolve(null);
        });
    });
}

module.exports = {
    validateFields,
    validateInput,
    verifyDuplicatedAddress,
    verifyDuplicatedPhone,
    verifyDuplicatedRestaurant,
    verifyId
};