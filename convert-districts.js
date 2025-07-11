const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to your Excel file (relative to current directory)
const excelPath = path.join(__dirname, 'public', 'INDIA - Districts.xlsx');
// Output JSON file
const outputPath = path.join(__dirname, 'public', 'districts.json');

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

const result = {};

data.forEach(row => {
  const state = row['State'] || row['state'] || row['STATE'];
  const district = row['District'] || row['district'] || row['DISTRICT'];
  if (!state || !district) return;
  if (!result[state]) result[state] = [];
  if (!result[state].includes(district)) result[state].push(district);
});

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('districts.json created!'); 