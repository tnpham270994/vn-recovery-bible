const fs = require('fs');
const path = require('path');

function convertHtmlToJson(htmlFilePath, outputFilePath, chapterNumber = 1) {
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Extract content between <body> and </body> tags
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
      throw new Error('No body tag found in HTML file');
    }
    
    const bodyContent = bodyMatch[1];
    
    // Extract all paragraph content with multiline support
    const paragraphMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
    if (!paragraphMatches) {
      throw new Error('No paragraph tags found in HTML file');
    }
    
    const contentItems = [];
    
    paragraphMatches.forEach(paragraph => {
      // Extract content inside <p> tags
      const contentMatch = paragraph.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      if (contentMatch) {
        let paragraphContent = contentMatch[1];
        
        // Clean up HTML entities and formatting
        let cleanContent = paragraphContent
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/<br\s*\/?>/g, ' ')
          .replace(/<em>([^<]*)<\/em>/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Check if this paragraph starts with a verse number (like "1 ", "2 ", etc.)
        const verseNumberMatch = cleanContent.match(/^(\d+)\s+(.*)$/s);
        if (verseNumberMatch) {
          const verseNumber = verseNumberMatch[1];
          let verseText = verseNumberMatch[2];
          
          // Convert <sup>content</sup> to [content]
          verseText = verseText.replace(/<sup>([^<]*)<\/sup>/g, '[$1]');
          
          // Only add non-empty verses
          if (verseText && verseText.length > 0) {
            contentItems.push({
              type: 'verse',
              verse_no: parseInt(verseNumber),
              content: verseText
            });
          }
        } else if (cleanContent && cleanContent.length > 0) {
          // Check if this looks like a title/header (contains Roman numerals, letters with periods, or specific patterns)
          const isTitle = /^[IVX]+\.|^[A-Z]\.|^CHƯƠNG|^cc\.|^\d+:\d+/.test(cleanContent) || 
                         cleanContent.includes('–') || 
                         cleanContent.includes('để') && cleanContent.length < 100;
          
          if (isTitle) {
            contentItems.push({
              type: 'title',
              content: cleanContent
            });
          }
        }
      }
    });
    
    // Create JSON structure with array of objects
    const jsonData = {
      verse_data: {
        [chapterNumber.toString()]: contentItems
      }
    };
    
    // Write the JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    const verseCount = contentItems.filter(item => item.type === 'verse').length;
    const titleCount = contentItems.filter(item => item.type === 'title').length;
    
    console.log(`Successfully converted ${htmlFilePath} to ${outputFilePath}`);
    console.log(`Found ${verseCount} verses and ${titleCount} titles in chapter ${chapterNumber}`);
    console.log(`First few items:`);
    contentItems.slice(0, 8).forEach((item, index) => {
      console.log(`${index + 1}: [${item.type}] ${item.content.substring(0, 80)}...`);
    });
    
  } catch (error) {
    console.error('Error converting file:', error.message);
  }
}

// Usage example
const inputFile = path.join(__dirname, 'data', 'raw_data', 'verse.html');
const outputFile = path.join(__dirname, 'converted-verses.json');

// Convert to JSON format (chapter 1)
convertHtmlToJson(inputFile, outputFile, 1);
