"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTenantScoped = exports.assertIndiaPhone = exports.maskApiKey = exports.isValidIndiaPhone = void 0;
const INDIA_PHONE_REGEX = /^\+91[1-9]\d{9}$/;
const isValidIndiaPhone = (phone) => INDIA_PHONE_REGEX.test(phone.trim());
exports.isValidIndiaPhone = isValidIndiaPhone;
const maskApiKey = (key) => {
    if (key.length <= 6)
        return "***";
    return `${key.slice(0, 3)}****${key.slice(-3)}`;
};
exports.maskApiKey = maskApiKey;
const assertIndiaPhone = (phone) => {
    if (!(0, exports.isValidIndiaPhone)(phone)) {
        throw new Error("Phone number must be an India (+91) MSISDN with 10 digits");
    }
};
exports.assertIndiaPhone = assertIndiaPhone;
const isTenantScoped = (customerIdFromToken, targetCustomerId) => customerIdFromToken === targetCustomerId;
exports.isTenantScoped = isTenantScoped;
