import { validateEmail } from '../src/utils/helpers';
import { it, describe, expect } from '@jest/globals';

describe('validateEmail tests', () => {
    it('Should return false for invalid email test.com', () => {
        expect(validateEmail("test.com")).toBe(false);
    });

    it('Should return true for valid email test@gmail.com', () => {
        expect(validateEmail("test@gmail.com")).toBe(true);
    });
})