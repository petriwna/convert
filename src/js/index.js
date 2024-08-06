import '../scss/main.scss';
import { ExcelToJsonConvert } from './ExcelToJsonConvert';
import { JsonToExcelConvert } from './JsonToExcelConvert';

export function init() {
  new ExcelToJsonConvert(
    'excel_file',
    'json_data',
    'download_btn',
    'drag-area-excel',
    'text-excel',
  );
  new JsonToExcelConvert('json_file', 'drag-area', 'text');
}

document.addEventListener('DOMContentLoaded', init);
