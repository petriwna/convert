import { FileHandler } from '../src/js/FileHandler';
import { addClassToElement, removeClassFromElement, setElementTextContent } from '../src/js/utils';

jest.mock('../src/js/utils', () => ({
  addClassToElement: jest.fn(),
  removeClassFromElement: jest.fn(),
  setElementTextContent: jest.fn(),
}));

describe('FileHandler', () => {
  let fileHandler;
  let fileInput;
  let dragElement;
  let dropText;
  let mockJsonFile;
  let mockXlsFile;
  let mockXlsxFile;

  beforeEach(() => {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';

    dragElement = document.createElement('div');
    dragElement.id = 'dragElement';

    dropText = document.createElement('p');
    dropText.id = 'dragText';

    document.body.appendChild(fileInput);
    document.body.appendChild(dragElement);
    document.body.appendChild(dropText);

    mockJsonFile = new File(['{"key":"value"}'], 'data.json', { type: 'application/json' });
    mockXlsFile = new File(['sheet data'], 'data.xls', { type: 'application/vnd.ms-excel' });
    mockXlsxFile = new File(['sheet data'], 'data.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    fileHandler = new FileHandler('fileInput', 'dragElement', 'dragText');
  });

  afterEach(() => {
    document.body.removeChild(fileInput);
    document.body.removeChild(dragElement);
    document.body.removeChild(dropText);
  });

  test('should initialize event listeners', () => {
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    dragElement.dispatchEvent(new Event('dragover', { bubbles: true }));

    dragElement.dispatchEvent(new Event('dragleave', { bubbles: true }));

    const dropEvent = new Event('drop', { bubbles: true });
    dropEvent.dataTransfer = {
      files: [mockJsonFile],
    };
    dragElement.dispatchEvent(dropEvent);

    expect(addClassToElement).toHaveBeenCalledTimes(2);
    expect(removeClassFromElement).toHaveBeenCalledTimes(1);
    expect(setElementTextContent).toHaveBeenCalledTimes(3);
  });
});
