/* eslint-disable */

// 库
// import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export function  file2Xce (file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const data = e.target.result
      this.wb = XLSX.read(data, {
        type: 'binary'
      })
      const result = []
      this.wb.SheetNames.forEach((sheetName) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
        })
      })
      resolve(result)
    }
    reader.readAsBinaryString(file.raw)
  })
}



