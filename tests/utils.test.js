import { addClassToElement } from '../src/js/utils';

describe('addClassToElement', () => {
  test('should add a class to the element', () => {
    const element = document.createElement('div');

    addClassToElement(element, 'newClass');

    expect(element.classList.contains('newClass')).toBe(true);
  });
});
