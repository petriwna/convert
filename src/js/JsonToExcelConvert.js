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
    for (const name in jsonData) {
      const label = jsonData[name].label;

      for (const actor in jsonData[name]) {
        console.log(actor);
        if (actor !== label) {
          for (const land in jsonData[name][actor]) {
            console.log(land);
            for (const format in jsonData[name][actor][land]) {
              console.log(format);
              const row = {
                Name: name,
                Label: label,
                Actor: actor,
                Land: land,
                Format: format,
                Text: jsonData[name][actor][land][format],
              };

              excelData.push(row);
            }
          }
        }
      }
    }
    console.log(excelData);
    return excelData;
  }
}
