import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardUrl = searchParams.get('cardUrl');

  if (!cardUrl) {
    return new NextResponse('Missing cardUrl', { status: 400 });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(cardUrl, { waitUntil: 'networkidle0' });

    // Optionally, you can select a specific element and clip to its bounding box
    // const cardElement = await page.$('.card-container');
    // const boundingBox = await cardElement.boundingBox();

    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '171.2mm', // 85.6mm * 2
      height: '54mm',
      pageRanges: '1',
      // If you want to clip to a specific element, use the 'clip' option
      // clip: boundingBox,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=card.pdf',
      },
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Puppeteer PDF error:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
} 