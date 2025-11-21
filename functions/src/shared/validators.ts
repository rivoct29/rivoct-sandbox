const INDIA_PHONE_REGEX = /^\+91[1-9]\d{9}$/;

export const isValidIndiaPhone = (phone: string): boolean => INDIA_PHONE_REGEX.test(phone.trim());

export const maskApiKey = (key: string): string => {
  if (key.length <= 6) return "***";
  return `${key.slice(0, 3)}****${key.slice(-3)}`;
};

export const assertIndiaPhone = (phone: string): void => {
  if (!isValidIndiaPhone(phone)) {
    throw new Error("Phone number must be an India (+91) MSISDN with 10 digits");
  }
};

export const isTenantScoped = (customerIdFromToken: string, targetCustomerId: string): boolean =>
  customerIdFromToken === targetCustomerId;
