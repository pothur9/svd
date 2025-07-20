import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Function to get the appropriate Chrome executable path
function getChromeExecutablePath() {
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    return process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
  }
  
  // For local development, let puppeteer find Chrome automatically
  return undefined;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardUrl = searchParams.get('cardUrl');

  if (!cardUrl) {
    return new NextResponse('Missing cardUrl', { status: 400 });
  }

  let browser;
  try {
    // Get appropriate Chrome executable path
    const chromeExecutablePath = getChromeExecutablePath();
    const isVercel = process.env.VERCEL === '1';
    
    // Configure launch arguments based on environment
    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ];
    
    // Add Vercel-specific arguments
    if (isVercel) {
      launchArgs.push(
        '--no-zygote',
        '--single-process',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      );
    }
    
    const launchOptions: {
      args: string[];
      headless: boolean;
      executablePath?: string;
    } = {
      args: launchArgs,
      headless: true,
    };
    
    // Only set executablePath if it's defined (for Vercel)
    if (chromeExecutablePath) {
      launchOptions.executablePath = chromeExecutablePath;
    }
    
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });

    // Set timeout for page operations
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // Navigate to the card URL
    await page.goto(cardUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Wait a bit for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '171.2mm', // 85.6mm * 2
      height: '54mm',
      pageRanges: '1',
      format: undefined, // Use custom dimensions
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=card.pdf',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Puppeteer PDF error:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    // Check for specific Vercel-related errors
    let errorMessage = 'Error generating PDF';
    if (error instanceof Error) {
      if (error.message.includes('Protocol error')) {
        errorMessage = 'Browser protocol error - please try again';
      } else if (error.message.includes('Navigation timeout')) {
        errorMessage = 'Page load timeout - please try again';
      } else if (error.message.includes('Target closed')) {
        errorMessage = 'Browser connection lost - please try again';
      } else if (error.message.includes('Browser was not found')) {
        errorMessage = 'Chrome browser not found. Please ensure Chrome is installed on your system. For local development, make sure Google Chrome is installed and accessible.';
      } else if (error.message.includes('Failed to launch')) {
        errorMessage = 'Failed to launch browser. Please ensure Chrome is installed and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return new NextResponse(
      JSON.stringify({ 
        error: errorMessage, 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 