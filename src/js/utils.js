export function addClassToElement(element, className) {
  if (element && className) {
    element.classList.add(className);
  }
}

export function removeClassFromElement(element, className) {
  if (element && className) {
    element.classList.remove(className);
  }
}

export function setElementValue(element, value) {
  if (element) {
    return (element.value = value);
  }
  return '';
}

export function getElementValue(element) {
  if (element) {
    return element.value;
  }
  return '';
}

export function setElementTextContent(element, value) {
  if (element) {
    element.textContent = value;
  }
}
