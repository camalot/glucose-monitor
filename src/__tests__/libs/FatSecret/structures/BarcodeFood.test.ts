import BarcodeFood from '../../../../libs/FatSecret/structures/BarcodeFood';

describe('BarcodeFood Class', () => {
  describe('constructor', () => {
    it('should correctly assign properties from options', () => {
      const options = { id: '12345' };
      const barcodeFood = new BarcodeFood(options);

      expect(barcodeFood.id).toBe('12345');
    });

    it('should handle undefined options gracefully', () => {
      const barcodeFood = new BarcodeFood({});
      expect(barcodeFood.id).toBeUndefined();
    });
  });

  describe('fromResponse', () => {
    it('should create an instance of BarcodeFood with the correct id from a valid response', () => {
      const response = {
        food_id: {
          value: '67890',
        },
      };

      const barcodeFood = BarcodeFood.fromResponse(response);

      expect(barcodeFood).toBeInstanceOf(BarcodeFood);
      expect(barcodeFood.id).toBe('67890');
    });

    it('should handle a response with no food_id gracefully', () => {
      const response = {};

      const barcodeFood = BarcodeFood.fromResponse(response);

      expect(barcodeFood).toBeInstanceOf(BarcodeFood);
      expect(barcodeFood.id).toBeUndefined();
    });

    it('should handle null or undefined response gracefully', () => {
      const barcodeFoodFromNull = BarcodeFood.fromResponse(null);
      const barcodeFoodFromUndefined = BarcodeFood.fromResponse(undefined);

      expect(barcodeFoodFromNull).toBeInstanceOf(BarcodeFood);
      expect(barcodeFoodFromNull.id).toBeUndefined();

      expect(barcodeFoodFromUndefined).toBeInstanceOf(BarcodeFood);
      expect(barcodeFoodFromUndefined.id).toBeUndefined();
    });
  });
});