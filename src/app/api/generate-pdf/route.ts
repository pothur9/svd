import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isVercel = !!process.env.AWS_LAMBDA_FUNCTION_VERSION;

export async function POST(req: NextRequest) {
  const { html } = await req.json();

  let browser = null;
  let puppeteer;
  let executablePath;
  let args;
  let headless;
  let defaultViewport;

  try {
    if (isVercel) {
      // Vercel/serverless: use @sparticuz/chromium
      const chromium = require('@sparticuz/chromium');
      puppeteer = require('puppeteer-core');
      executablePath = await chromium.executablePath();
      args = chromium.args;
      headless = chromium.headless;
      defaultViewport = chromium.defaultViewport;
    } else {
      // Local: use puppeteer (full)
      puppeteer = require('puppeteer');
      executablePath = undefined; // use default
      args = [];
      headless = true;
      defaultViewport = null;
    }

    browser = await puppeteer.launch({
      args,
      defaultViewport,
      executablePath,
      headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="output.pdf"',
      },
    });
  } catch (error: any) {
    if (browser) await browser.close();
    return new NextResponse(
      JSON.stringify({ error: 'Error generating PDF', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 