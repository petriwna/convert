import '../scss/main.scss';
import { ExcelToJsonConvert } from './ExcelToJsonConvert';
import { JsonToExcelConvert } from './JsonToExcelConvert';

export function init() {
  new ExcelToJsonConvert('excel_file', 'json_data', 'download_btn');
  new JsonToExcelConvert('json_file', 'drag-area', 'btn-json', 'text');
}

document.addEventListener('DOMContentLoaded', init);
