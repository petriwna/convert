export class JsonToExcelConvert {
  constructor(fileInputId, convertButtonId, downloadButtonId, outputId) {
    this.selectedFile = null;
    this.fileInput = document.getElementById(fileInputId);
    this.convertButton = document.getElementById(convertButtonId);
    this.outputElement = document.getElementById(outputId);
    this.downloadButton = document.getElementById(downloadButtonId);

    this.init();
  }

  init() {
    this.fileInput.addEventListener('change', (event) => this.handleFileSelect(event));
    this.convertButton.addEventListener('click', () => this.handleConvertFile());
    this.downloadButton.addEventListener('click', () => this.handleDownloadFile());
  }

  handleFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      console.error('No file selected');
    }
  }

  handleConvertFile() {
    try {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        this.displayJson(jsonData);
      };
      fileReader.readAsText(this.selectedFile);
    } catch (error) {
      console.error('Error reading JSON file:', error);
    }
  }

  displayJson(jsonData) {
    this.outputElement.value = JSON.stringify(jsonData, null, 2);
  }

  handleDownloadFile() {
    const jsonData = JSON.parse(this.outputElement.value);
    this.downloadObjectAsExcel(jsonData, 'json_to_excel');
  }

  downloadObjectAsExcel(jsonData, filename) {
    try {
      const formattedData = this.jsonToExcelFormat(jsonData);
      if (formattedData.length === 0) {
        throw new Error('Formatted data is empty. Please check the JSON structure.');
      }
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error('Error during Excel file creation:', error);
    }
  }

  jsonToExcelFormat(jsonData) {
    const excelData = [];
    const names = [];
    const actors = [];
    const lands = new Set();
    const secondRow = [null, 'label', null, null];
    let label = null;
    const firstRow = [null, null, null, null];
    const formats = new Set();

    for (const name in jsonData) {
      names.push(name);

      label = jsonData[name].label;
      for (const actor in jsonData[name]) {
        actors.push(actor);
        for (const land in jsonData[name][actor]) {
          if (actor !== 'label') {
            lands.add(land);

            for (const format in jsonData[name][actor][land]) {
              formats.add(format);
              console.log(jsonData[name][actor][land][format]);
            }
          }
        }
      }
    }

    lands.forEach((land) => {
      secondRow.push(land);

      switch (land) {
        case 'ua':
          firstRow.push('Оригінал');
          break;
        case 'en':
          firstRow.push('Англійська en');
          break;
        case 'pl':
          firstRow.push('Польська pl');
          break;
        case 'lt':
          firstRow.push('Литовська lt');
          break;
        case 'cz':
          firstRow.push('Чеська cz');
          break;
        case 'de':
          firstRow.push('Німецька de');
          break;
        case 'ro':
          firstRow.push('Румунська ro');
          break;
        case 'sk':
          firstRow.push('Словацька sk');
          break;
        case 'lv':
          firstRow.push('Латиська lv');
          break;
        case 'et':
          firstRow.push('Естонська et');
          break;
        case 'hu':
          firstRow.push('Угорська hu');
          break;
        case 'it':
          firstRow.push('Італійська it');
          break;
        case 'fr':
          firstRow.push('Французська fr');
          break;
        case 'es':
          firstRow.push('Іспанська es');
          break;
        case 'ca':
          firstRow.push('Каталонська са');
          break;
      }
    });

    excelData.push(firstRow);
    excelData.push(secondRow);

    names.forEach((name) => {
      actors.forEach((actor) => {
        if (actor !== 'label') {
          formats.forEach((format) => {
            const row = [name, label, actor, format];

            lands.forEach((land) => {
              const text = jsonData[name][actor][land][format] || '';
              row.push(text);
            });

            excelData.push(row);
          });
        }
      });
    });

    return excelData;
  }
}
