import { FileHandler } from './FileHandler';
import {
  getElementValue,
  removeClassFromElement,
  setElementTextContent,
  setElementValue,
} from './utils';

export class ExcelToJsonConvert extends FileHandler {
  constructor(fileInputId, outputId, downloadButtonId, dragId, dropTextId) {
    super(fileInputId, dragId, dropTextId);

    this.outputElement = document.getElementById(outputId);
    this.downloadButton = document.getElementById(downloadButtonId);

    this.initializeDownloadButton();
  }

  initializeDownloadButton() {
    this.downloadButton.addEventListener('click', () => this.handleDownloadFile());
  }

  async displayFile() {
    if (this.isExcelFile()) {
      await this.processFile();
    } else {
      alert('This is not a Excel file.');
      removeClassFromElement(this.dragElement, 'active');
    }
  }

  isExcelFile() {
    const fileType = this.selectedFile.type;
    const validExcelMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExcelExtensions = ['.xls', '.xlsx'];

    return (
      validExcelMimeTypes.includes(fileType) &&
      validExcelExtensions.some((ext) => this.selectedFile.name.endsWith(ext))
    );
  }

  async processFile() {
    try {
      const data = await readXlsxFile(this.selectedFile);
      const jsonData = this.convertToJson(data);

      this.displayJson(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file');
      this.resetUI();
    }
  }

  convertToJson(data) {
    const headers = data[0];
    const rows = data.slice(1);
    const lands = headers.filter((value) => value && value !== 'label');
    const temp = {};

    rows.forEach((row) => {
      const [name, label, actor, length, ...texts] = row;

      if (name) {
        if (!temp[name]) {
          temp[name] = { label, [actor]: {} };
        }

        if (!temp[name][actor]) {
          temp[name][actor] = {};
        }

        texts.forEach((text, index) => {
          const land = lands[index];

          if (land) {
            if (!temp[name][actor][land]) {
              temp[name][actor][land] = {};
            }

            temp[name][actor][land][length] = text || '';
          }
        });
      }
    });

    return temp;
  }

  displayJson(jsonData) {
    setElementValue(this.outputElement, JSON.stringify(jsonData, null, 2));
  }

  handleDownloadFile() {
    const jsonData = getElementValue(this.outputElement);

    this.downloadJson(jsonData, 'excel_to_json');
    this.resetUI();
  }

  downloadJson(jsonData, filename) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `${filename}.json`);

    document.body.appendChild(downloadAnchorNode);

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  resetUI() {
    removeClassFromElement(this.dragElement, 'active');
    setElementTextContent(this.dropText, 'Drag & Drop');
    setElementValue(this.outputElement, '');
    this.selectedFile = null;
  }
}
