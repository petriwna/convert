import { FileHandler } from './FileHandler';
import { getNodeValue, removeClassFromElement, setNodeTextContent, setNodeValue } from './utils';

export class ExcelToJsonConvert extends FileHandler {
  constructor(fileInputId, outputId, downloadButtonId, dragId, dropTextId) {
    super(fileInputId, dragId, dropTextId);

    this.outputElement = document.getElementById(outputId);
    this.downloadButton = document.getElementById(downloadButtonId);

    this.initDownloadButton();
  }

  initDownloadButton() {
    this.downloadButton.addEventListener('click', () => this.handleDownloadFile());
  }

  async displayFile() {
    await this.handleConvertFile();
  }

  async handleConvertFile() {
    try {
      const data = await readXlsxFile(this.selectedFile);
      this.displayJson(this.convertToJson(data));
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  convertToJson(data) {
    const names = [];
    const temp = {};
    const actors = new Set();
    const lengths = new Set();
    const lands = data[0].filter((value) => value !== null && value !== 'label');

    data.forEach((row) => {
      const name = row[0];

      if (name !== null) {
        if (!names.includes(name)) {
          names.push(name);
        }

        temp[name] = {
          label: row[1],
        };

        actors.add(row[2]);
        lengths.add(row[3]);
      }
    });

    names.sort((a, b) => {
      const [numA, suffixA] = a.split('_');
      const [numB, suffixB] = b.split('_');
      const intA = parseInt(numA, 10);
      const intB = parseInt(numB, 10);

      if (intA !== intB) {
        return intA - intB;
      } else if (suffixA && suffixB) {
        return suffixA.localeCompare(suffixB);
      } else if (suffixA) {
        return 1;
      } else if (suffixB) {
        return -1;
      }
      return 0;
    });

    names.forEach((name) => {
      if (!temp[name]) {
        temp[name] = {};
      }
      actors.forEach((actor) => {
        if (!temp[name][actor]) {
          temp[name][actor] = {};
        }

        lands.forEach((land) => {
          if (!temp[name][actor][land]) {
            temp[name][actor][land] = {};
          }
        });
      });
    });

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[0];
      const actor = row[2];
      const length = row[3];
      const texts = row.slice(4);

      texts.forEach((text, index) => {
        const land = lands[index];
        if (name && actor && land && length) {
          temp[name][actor][land][length] = text || '';
        }
      });
    }

    return temp;
  }

  displayJson(jsonData) {
    setNodeValue(this.outputElement, JSON.stringify(jsonData, null, 2));
  }

  handleDownloadFile() {
    const jsonData = getNodeValue(this.outputElement);

    this.downloadObjectAsJson(jsonData, 'excel_to_json');

    removeClassFromElement(this.dragElement, 'active');
    setNodeTextContent(this.dropText, 'Drag & Drop');
    setNodeValue(this.outputElement, '');

    this.selectedFile = null;
  }

  downloadObjectAsJson(jsonData, filename) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `${filename}.json`);

    document.body.appendChild(downloadAnchorNode);

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
