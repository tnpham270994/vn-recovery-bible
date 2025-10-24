const fs = require('fs');
const path = require('path');

function parseFootnotesFromHTML(htmlContent) {
  const footnotes = {};
  
  // More comprehensive regex to handle various footnote formats
  const footnoteRegex = /<p>(\d+)<sup>(\d+)<\/sup>\s*(.*?)<\/p>/gs;
  let match;
  
  while ((match = footnoteRegex.exec(htmlContent)) !== null) {
    const verseNumber = match[1];
    const footnoteId = match[2];
    let footnoteText = match[3];
    
    // Clean up the footnote text
    footnoteText = footnoteText
      .replace(/<em>(.*?)<\/em>/g, '$1') // Remove em tags but keep content
      .replace(/<sup>(\d+)<\/sup>/g, '$1') // Convert superscript references to plain text
      .replace(/<\/p>$/g, '') // Remove trailing </p> tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Skip empty footnotes
    if (!footnoteText) continue;
    
    // Initialize verse if it doesn't exist
    if (!footnotes[verseNumber]) {
      footnotes[verseNumber] = [];
    }
    
    // Add footnote to the verse
    footnotes[verseNumber].push({
      id: footnoteId,
      text: footnoteText
    });
  }
  
  return footnotes;
}

function extractChapterFromTitle(htmlContent) {
  // Try to extract chapter number from title
  const titleMatch = htmlContent.match(/Chuong (\d+)/i);
  return titleMatch ? titleMatch[1] : "1";
}

function convertHTMLToJSON(inputPath, outputPath) {
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(inputPath, 'utf8');
    
    // Extract chapter number
    const chapterNumber = extractChapterFromTitle(htmlContent);
    
    // Parse footnotes
    const parsedFootnotes = parseFootnotesFromHTML(htmlContent);
    
    // Create the final JSON structure
    const result = {
      footnotes: {
        [chapterNumber]: parsedFootnotes
      }
    };
    
    // Write to output file
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
    console.log(`Chapter: ${chapterNumber}`);
    console.log(`Found footnotes for ${Object.keys(parsedFootnotes).length} verses`);
    
    // Print summary
    Object.keys(parsedFootnotes).forEach(verse => {
      console.log(`Verse ${verse}: ${parsedFootnotes[verse].length} footnotes`);
    });
    
  } catch (error) {
    console.error('Error converting HTML to JSON:', error.message);
  }
}

// Usage
const inputFile = path.join(__dirname, 'data', 'raw_data', 'footnotes.html');
const outputFile = path.join(__dirname, 'converted-footnotes.json');

convertHTMLToJSON(inputFile, outputFile);
