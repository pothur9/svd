import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to clean up oklch colors
const cleanOklchColors = (clonedDoc: Document) => {
  // Clean up CSS rules
  const styleSheets = clonedDoc.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule instanceof CSSStyleRule && rule.style) {
            // Replace any oklch colors with hex equivalents
            const backgroundColor = rule.style.backgroundColor;
            const color = rule.style.color;
            
            if (backgroundColor && backgroundColor.includes('oklch')) {
              rule.style.backgroundColor = '#ffffff';
            }
            if (color && color.includes('oklch')) {
              rule.style.color = '#000000';
            }
          }
        }
      }
    } catch {
      // Ignore cross-origin stylesheet errors
    }
  }
  
  // Clean up inline styles and computed styles on all elements
  const allElements = clonedDoc.querySelectorAll('*');
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const elementStyle = (element as HTMLElement).style;
    
    // Check and fix background colors
    const bgColor = computedStyle.backgroundColor || elementStyle.backgroundColor;
    if (bgColor && bgColor.includes('oklch')) {
      elementStyle.backgroundColor = '#ffffff';
    }
    
    // Check and fix text colors
    const textColor = computedStyle.color || elementStyle.color;
    if (textColor && textColor.includes('oklch')) {
      elementStyle.color = '#000000';
    }
    
    // Check and fix border colors
    const borderColor = computedStyle.borderColor || elementStyle.borderColor;
    if (borderColor && borderColor.includes('oklch')) {
      elementStyle.borderColor = '#ea580c';
    }
  });
};

export const generatePDFFromHTML = async (htmlContent: string, filename: string = 'card.pdf'): Promise<void> => {
  try {
    // Create a temporary container for the HTML
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.height = '55mm';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // Wait for images to load before processing
    const images = container.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 170 * 2.83465, // 170mm in px
      height: 55 * 2.83465, // 55mm in px
      logging: false, // Disable logging to reduce noise
      ignoreElements: () => false,
      onclone: cleanOklchColors,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 170 * 2.83465,
      windowHeight: 55 * 2.83465
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [170, 55],
    });

    // Add the canvas image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 170, 55, '', 'FAST');

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const generateCardPDF = async (cardElement: HTMLElement): Promise<Blob> => {
  try {
    // Convert the card element to canvas
    const canvas = await html2canvas(cardElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 171.2 * 2.83465, // Convert mm to pixels (1mm = 2.83465px)
      height: 54 * 2.83465,
      logging: false, // Disable logging to reduce noise
      ignoreElements: () => {
        // Ignore elements that might cause color parsing issues
        return false;
      },
      onclone: cleanOklchColors
    });

    // Create PDF with the same dimensions as the card
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [171.2, 54], // Width: 85.6mm * 2, Height: 54mm
    });

    // Add the canvas image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 171.2, 54);

    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPDF = async (cardElement: HTMLElement, filename: string = 'card.pdf') => {
  try {
    const pdfBlob = await generateCardPDF(cardElement);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}; 