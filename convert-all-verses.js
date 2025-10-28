const fs = require('fs');
const path = require('path');

const dataDir = 'data';
const outputDir = 'data/converted';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all JSON files in data folder
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && !file.endsWith('.html.json'));

console.log(`Found ${files.length} JSON files to process\n`);

// Process each file
files.forEach(filename => {
  const inputPath = path.join(dataDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  try {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Check if file has verse_data structure
    if (data.verse_data) {
      // Create a new object with the same structure
      const result = { verse_data: {} };
      
      // Iterate through each chapter
      Object.keys(data.verse_data).forEach(chapterNo => {
        const chapter = data.verse_data[chapterNo];
        
        // Convert each verse in the chapter to the new format
        result.verse_data[chapterNo] = chapter.map((verseContent, index) => ({
          type: "verse",
          verse_no: index + 1, // Array is 0-indexed, verses are 1-indexed
          content: verseContent
        }));
      });
      
      // Write to output file
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
      
      const totalVerses = Object.values(result.verse_data).reduce((sum, chapter) => sum + chapter.length, 0);
      console.log(`✓ ${filename} - Converted ${totalVerses} verses`);
    } else {
      console.log(`✗ ${filename} - Skipped (no verse_data structure)`);
    }
  } catch (error) {
    console.error(`✗ ${filename} - Error: ${error.message}`);
  }
});

console.log('\nConversion complete!');