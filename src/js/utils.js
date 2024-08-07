export function addClassToElement(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

export function removeClassFromElement(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

export function setNodeValue(element, value) {
  if (element) {
    return (element.value = value);
  }
  return '';
}

export function getNodeValue(element) {
  if (element) {
    return element.value;
  }
  return '';
}

export function setNodeTextContent(element, value) {
  if (element) {
    element.textContent = value;
  }
}
