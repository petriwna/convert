import {
  addClassToElement,
  getElementValue,
  removeClassFromElement,
  setElementTextContent,
  setElementValue,
} from '../src/js/utils';

describe('addClassToElement', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  test('should add a class to the element', () => {
    addClassToElement(element, 'newClass');

    expect(element.classList.contains('newClass')).toBe(true);
  });

  test('should not add a class if the element is null', () => {
    addClassToElement(null, 'newClass');

    expect(element.classList.contains('newClass')).toBe(false);
  });

  test('should not add a class if the class name is empty', () => {
    addClassToElement(element, '');

    expect(element.classList.length).toBe(0);
  });
});

describe('removeClassFromElement', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.classList.add('className');
  });

  test('should remove a class from the element', () => {
    removeClassFromElement(element, 'className');

    expect(element.classList.contains('className')).toBe(false);
  });

  test('should not remove a class if the element is null', () => {
    removeClassFromElement(null, 'className');

    expect(element.classList.contains('className')).toBe(true);
  });

  test('should not remove a class if the class name is empty', () => {
    removeClassFromElement(element, '');

    expect(element.classList.contains('className')).toBe(true);
  });
});

describe('setElementValue', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('input');
  });

  test('should set the value of the element and return the value', () => {
    setElementValue(element, 'newValue');

    expect(element.value).toBe('newValue');
  });

  test('should return an empty string if the element is null', () => {
    setElementValue(null, 'newValue');

    expect(element.value).toBe('');
  });
});

describe('getElementValue', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('input');
  });

  test('should return the value of the element when it is not null', () => {
    element.value = 'testValue';

    const result = getElementValue(element);

    expect(result).toBe('testValue');
  });

  test('should return an empty string if the element is null', () => {
    const result = getElementValue(null);

    expect(result).toBe('');
  });
});

describe('setElementTextContent', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  test('should set the textContent of the element when it is not null', () => {
    setElementTextContent(element, 'testValue');

    expect(element.textContent).toBe('testValue');
  });

  test('should not modify the element if it is null', () => {
    const initialTextContent = element.textContent;

    setElementTextContent(null, 'testValue');

    expect(element.textContent).toBe(initialTextContent);
  });
});
