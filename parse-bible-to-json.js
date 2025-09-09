#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to parse bible.json and convert it to a nested JSON object
 * Input format: [{"book":"Mat.", "chapter":1, "verse":1, "text":"..."}]
 * Output format: { "Mat.": { "1": ["verse1", "verse2", ...], "2": [...] } }
 */

function parseBibleToJson(inputPath, outputPath) {
  try {
    console.log('📖 Reading JSON file...');
    const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    console.log(`Found ${jsonData.length} verses`);
    
    // Initialize the result object
    const result = {};
    
    // Process each verse
    jsonData.forEach((verse, index) => {
      const { book, chapter, verse: verseNumber, text } = verse;
      
      // Initialize book if it doesn't exist
      if (!result[book]) {
        result[book] = {};
      }
      
      // Initialize chapter if it doesn't exist
      if (!result[book][chapter]) {
        result[book][chapter] = [];
      }
      
      // Add verse text to the chapter array
      // Note: verseNumber is 1-indexed, but array is 0-indexed
      const arrayIndex = verseNumber - 1;
      
      // Ensure the array is large enough
      while (result[book][chapter].length <= arrayIndex) {
        result[book][chapter].push('');
      }
      
      // Set the verse text
      result[book][chapter][arrayIndex] = text;
      
      if (index % 1000 === 0) {
        console.log(`Processed ${index + 1} verses...`);
      }
    });
    
    // Clean up empty strings at the end of each chapter array
    Object.keys(result).forEach(book => {
      Object.keys(result[book]).forEach(chapter => {
        const chapterArray = result[book][chapter];
        // Remove empty strings from the end
        while (chapterArray.length > 0 && chapterArray[chapterArray.length - 1] === '') {
          chapterArray.pop();
        }
      });
    });
    
    console.log('🔧 Generating JSON output...');
    
    // Sort books and chapters for consistent output
    const sortedResult = {};
    const sortedBooks = Object.keys(result).sort();
    
    sortedBooks.forEach(book => {
      sortedResult[book] = {};
      const sortedChapters = Object.keys(result[book])
        .map(Number)
        .sort((a, b) => a - b);
      
      sortedChapters.forEach(chapter => {
        sortedResult[book][chapter] = result[book][chapter];
      });
    });
    
    // Write to JSON file with pretty formatting
    const jsonOutput = JSON.stringify(sortedResult, null, 2);
    fs.writeFileSync(outputPath, jsonOutput, 'utf8');
    
    console.log(`✅ Successfully parsed and saved to ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Books: ${sortedBooks.length}`);
    
    let totalChapters = 0;
    let totalVerses = 0;
    sortedBooks.forEach(book => {
      const chapters = Object.keys(result[book]).length;
      totalChapters += chapters;
      
      Object.values(result[book]).forEach(chapter => {
        totalVerses += chapter.length;
      });
    });
    
    console.log(`   - Chapters: ${totalChapters}`);
    console.log(`   - Verses: ${totalVerses}`);
    
  } catch (error) {
    console.error('❌ Error parsing JSON:', error.message);
    process.exit(1);
  }
}

// Main execution
const inputPath = process.argv[2] || '/Users/tungpham/Downloads/bible.json';
const outputPath = process.argv[3] || 'constants/parsedBibleData.json';

console.log(`📖 Parsing Bible JSON from: ${inputPath}`);
console.log(`💾 Output will be saved to: ${outputPath}`);
console.log('');

parseBibleToJson(inputPath, outputPath);
