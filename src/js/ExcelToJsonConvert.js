export class ExcelToJsonConvert {
  constructor(fileInputId, outputId, downloadButtonId, dragId, dropTextId) {
    this.selectedFile = null;
    this.fileInput = document.getElementById(fileInputId);
    this.outputElement = document.getElementById(outputId);
    this.dragElement = document.getElementById(dragId);
    this.dropText = document.getElementById(dropTextId);
    this.downloadButton = document.getElementById(downloadButtonId);

    this.init();
  }

  init() {
    this.fileInput.addEventListener('change', (event) =>
      this.handleFileSelect(event.target.files[0]),
    );
    this.dragElement.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dragElement.classList.add('active');
      this.dropText.value = 'Release to Upload';
    });

    this.dragElement.addEventListener('dragleave', () => {
      this.dragElement.classList.remove('active');
      this.dropText.value = 'Drag & Drop';
    });

    this.dragElement.addEventListener('drop', (event) => {
      event.preventDefault();
      // this.selectedFile = event.dataTransfer.files[0];
      this.handleFileSelect(event.dataTransfer.files[0]);
    });
    this.downloadButton.addEventListener('click', () => this.handleDownloadFile());
  }

  displayFile() {
    const fileType = this.selectedFile.type;
    const validMimeType = 'application/json';
    const validExtension = '.xls';

    if (fileType === validMimeType && this.selectedFile.name.endsWith(validExtension)) {
      this.handleConvertFile();
    } else {
      alert('This is not a JSON file.');
      this.dragElement.classList.remove('active');
    }
  }

  async handleFileSelect(file) {
    if (file) {
      this.selectedFile = file;
      await this.handleConvertFile();
    } else {
      console.error('No file selected');
    }
  }

  async handleConvertFile() {
    try {
      const data = await readXlsxFile(this.selectedFile);
      const jsonData = this.convertToJson(data);
      this.displayJson(jsonData);
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

          // lengths.forEach((length) => {
          //   temp[name][actor][land][length] = '';
          // });
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
    this.outputElement.value = JSON.stringify(jsonData, null, 2);
  }

  handleDownloadFile() {
    const jsonData = this.outputElement.value;
    this.downloadObjectAsJson(jsonData, 'excel_to_json');
    this.dragElement.classList.remove('active');
    this.dropText.textContent = 'Drag & Drop';
    this.outputElement.value = '';
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
