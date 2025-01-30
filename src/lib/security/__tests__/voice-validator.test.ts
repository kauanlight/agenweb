import { VoiceValidator } from '../voice-validator';

describe('VoiceValidator', () => {
  describe('validatePhoneNumber', () => {
    it('should validate Brazilian phone numbers', () => {
      expect(VoiceValidator.validatePhoneNumber('+55 (11) 99999-9999')).toBe(true);
      expect(VoiceValidator.validatePhoneNumber('+55 (21) 9999-9999')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(VoiceValidator.validatePhoneNumber('11999999999')).toBe(false);
      expect(VoiceValidator.validatePhoneNumber('+55 999999999')).toBe(false);
    });
  });

  describe('validateTextForSynthesis', () => {
    it('should validate text input', () => {
      expect(VoiceValidator.validateTextForSynthesis('Olá, como vai?')).toBe(true);
      expect(VoiceValidator.validateTextForSynthesis('Hello world 123')).toBe(true);
    });

    it('should reject invalid text', () => {
      const longText = 'a'.repeat(600);
      expect(VoiceValidator.validateTextForSynthesis(longText)).toBe(false);
      expect(VoiceValidator.validateTextForSynthesis('<script>alert("test")</script>')).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should sanitize text', () => {
      const dirtyText = '<script>alert("test")</script>';
      const sanitizedText = VoiceValidator.sanitizeText(dirtyText);
      
      expect(sanitizedText).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');
    });
  });
});
