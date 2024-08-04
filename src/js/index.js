import '../scss/main.scss';
import { ExcelUploader } from './ExcelUploader';

export function init() {
  new ExcelUploader('excel_file', 'convert_btn', 'json_data', 'download_btn');
}

document.addEventListener('DOMContentLoaded', init);
