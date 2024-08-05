import '../scss/main.scss';
import { ExcelToJsonConvert } from './ExcelToJsonConvert';
import { JsonToExcelConvert } from './JsonToExcelConvert';

export function init() {
  new ExcelToJsonConvert('excel_file', 'convert_btn', 'json_data', 'download_btn');
  new JsonToExcelConvert('json_file', 'convert-json-btn');
}

document.addEventListener('DOMContentLoaded', init);
