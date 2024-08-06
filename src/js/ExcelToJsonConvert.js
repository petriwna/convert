export class ExcelToJsonConvert {
  constructor(fileInputId, outputId, downloadButtonId) {
    this.selectedFile = null;
    this.fileInput = document.getElementById(fileInputId);
    // this.convertButton = document.getElementById(convertButtonId);
    this.outputElement = document.getElementById(outputId);
    this.downloadButton = document.getElementById(downloadButtonId);

    this.init();
  }

  init() {
    this.fileInput.addEventListener('change', (event) => this.handleFileSelect(event));
    // this.convertButton.addEventListener('click', () => this.handleConvertFile());
    this.downloadButton.addEventListener('click', () => this.handleDownloadFile());
  }

  async handleFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
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
    const lands = data[1].filter((value) => value !== null && value !== 'label');

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

          lengths.forEach((length) => {
            temp[name][actor][land][length] = {};
          });
        });
      });
    });

    for (let i = 2; i < data.length; i++) {
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
