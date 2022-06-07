import Field, { FieldEvent } from '../../lib/field/Field';

describe('Field', () => {
  test('emits event on resize', (done) => {
    const field = new Field(5, 5);

    field.addListener(FieldEvent.RESIZE, () => {
      done();
    });

    field.setDimensions(5, 6);
  });

  test('emits event on update', (done) => {
    const field = new Field(2, 2);

    field.addListener(FieldEvent.UPDATE, () => {
      expect(field.getFieldArray().data.getUint8(0)).toBe(1);
      expect(field.getFieldArray().data.getUint8(1)).toBe(2);
      expect(field.getFieldArray().data.getUint8(2)).toBe(3);
      expect(field.getFieldArray().data.getUint8(3)).toBe(4);

      done();
    });

    field.update({
      data: [1, 2, 3, 4],
      gameId: 'test',
    });
  });
});
