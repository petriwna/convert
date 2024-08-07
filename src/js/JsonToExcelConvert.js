import * as XLSX from 'xlsx-js-style';

import { FileHandler } from './FileHandler';
import { removeClassFromElement, setNodeTextContent } from './utils';

export class JsonToExcelConvert extends FileHandler {
  constructor(fileInputId, dragId, dropTextId) {
    super(fileInputId, dragId, dropTextId);
  }

  displayFile() {
    if (this.isJsonFile()) {
      this.handleConvertFile();
    } else {
      alert('This is not a JSON file.');
      removeClassFromElement(this.dragElement, 'active');
    }
  }

  isJsonFile() {
    const fileType = this.selectedFile.type;
    const validMimeType = 'application/json';
    const validExtension = '.json';

    return fileType === validMimeType && this.selectedFile.name.endsWith(validExtension);
  }

  handleConvertFile() {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        const formattedData = this.convertJsonToExcelFormat(jsonData);

        this.downloadExcel(formattedData);
      } catch (error) {
        console.error('Error reading JSON file:', error);
      }
    };
    fileReader.readAsText(this.selectedFile);
  }

  convertJsonToExcelFormat(jsonData) {
    const sortedKeys = this.sortKeys(Object.keys(jsonData));
    const [names, actors, lands, formats] = this.extractUniqueValues(jsonData, sortedKeys);

    const excelData = this.createExcelData(names, actors, lands, formats, jsonData);

    return excelData;
  }

  sortKeys(keys) {
    return keys.sort((a, b) => {
      const [numA, suffixA] = this.splitKey(a);
      const [numB, suffixB] = this.splitKey(b);

      return numA - numB || suffixA.localeCompare(suffixB);
    });
  }

  splitKey(key) {
    const [num, ...suffixParts] = key.split('_');
    return [parseInt(num, 10), suffixParts.join('_')];
  }

  extractUniqueValues(jsonData, sortedKeys) {
    const names = [];
    const actors = new Set();
    const lands = new Set();
    const formats = new Set();

    sortedKeys.forEach((name) => {
      names.push(name);

      const entry = jsonData[name];

      for (const actor in entry) {
        if (actor !== 'label') {
          actors.add(actor);

          for (const land in entry[actor]) {
            lands.add(land);
            for (const format in entry[actor][land]) {
              formats.add(format);
            }
          }
        }
      }
    });

    return [names, actors, lands, formats];
  }

  createExcelData(names, actors, lands, formats, jsonData) {
    const excelData = [this.createHeaderRow(lands)];

    names.forEach((name) => {
      actors.forEach((actor) => {
        if (actor !== 'label') {
          formats.forEach((format) => {
            const row = [name, jsonData[name].label, actor, format];

            lands.forEach((land) => {
              row.push(jsonData[name][actor][land][format] || '');
            });

            excelData.push(row);
          });
        }
      });
    });

    return excelData;
  }

  createHeaderRow(lands) {
    return [null, 'label', null, null, ...lands];
  }

  downloadExcel(formattedData) {
    const ws = XLSX.utils.aoa_to_sheet(formattedData);
    this.applyStyles(ws);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'json_to_excel.xlsx');

    this.resetUI();
  }

  applyStyles(ws) {
    const range = XLSX.utils.decode_range(ws['!ref']);

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = ws[cellAddress];

        if (cell) {
          this.styleCell(cell, row, col);
        }
      }
    }
  }

  styleCell(cell, row, col) {
    cell.s = {
      font: {
        name: 'Arial',
        sz: 10,
      },
      alignment: { wrapText: true },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    if (row === 0) {
      cell.s.font = {
        name: 'Arial',
        sz: 10,
        bold: true,
      };
      cell.s.fill = { fgColor: { rgb: 'c5d9f1' } };
      cell.s.alignment = { horizontal: 'center' };
    }

    if (col <= 3) {
      cell.s.fill = { fgColor: { rgb: 'c5d9f1' } };
      cell.s.font = {
        sz: 10,
        bold: true,
      };
    }

    if (col >= 4 && row >= 2) {
      cell.s.font.sz = 8;
    }
  }

  resetUI() {
    removeClassFromElement(this.dragElement, 'active');
    setNodeTextContent(this.dropText, 'Drag & Drop');
    this.selectedFile = null;
  }
}
