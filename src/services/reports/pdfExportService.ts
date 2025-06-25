
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  title: string;
  dateRange: string;
  metrics: {
    totalSpend: number;
    revenue: number;
    roas: number;
    conversions: number;
    improvement: string;
  };
  channelData: Array<{
    platform: string;
    spend: number;
    roas: number;
    conversions: number;
  }>;
  audienceData: {
    demographics: {
      ageDistribution: { [key: string]: number };
      genderDistribution: { male: number; female: number };
    };
    topLocations: Array<{ location: string; percentage: number }>;
  };
}

export class PDFExportService {
  private static async captureElement(element: HTMLElement): Promise<string> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    return canvas.toDataURL('image/png');
  }

  static async exportReportToPDF(reportData: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ChariotAI Marketing Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(reportData.dateRange, pageWidth / 2, yPosition, { align: 'center' });
    
    // Performance Summary
    yPosition += 25;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance Summary', 20, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const metrics = [
      ['Total Spend:', `$${reportData.metrics.totalSpend.toLocaleString()}`],
      ['Revenue:', `$${reportData.metrics.revenue.toLocaleString()}`],
      ['ROAS:', `${reportData.metrics.roas}x`],
      ['Conversions:', reportData.metrics.conversions.toString()],
      ['Performance:', reportData.metrics.improvement]
    ];
    
    metrics.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, 80, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 8;
    });

    // Channel Performance
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Channel Performance', 20, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(10);
    
    // Table headers
    pdf.setFont('helvetica', 'bold');
    pdf.text('Platform', 20, yPosition);
    pdf.text('Spend', 80, yPosition);
    pdf.text('ROAS', 120, yPosition);
    pdf.text('Conversions', 160, yPosition);
    
    yPosition += 8;
    pdf.setFont('helvetica', 'normal');
    
    reportData.channelData.forEach(channel => {
      pdf.text(channel.platform, 20, yPosition);
      pdf.text(`$${channel.spend.toLocaleString()}`, 80, yPosition);
      pdf.text(`${channel.roas}x`, 120, yPosition);
      pdf.text(channel.conversions.toString(), 160, yPosition);
      yPosition += 8;
    });

    // Audience Analytics
    yPosition += 20;
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Audience Analytics', 20, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.text('Age Distribution:', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    Object.entries(reportData.audienceData.demographics.ageDistribution).forEach(([age, percentage]) => {
      pdf.text(`${age}: ${percentage}%`, 30, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gender Distribution:', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Male: ${reportData.audienceData.demographics.genderDistribution.male}%`, 30, yPosition);
    yPosition += 6;
    pdf.text(`Female: ${reportData.audienceData.demographics.genderDistribution.female}%`, 30, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top Locations:', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    reportData.audienceData.topLocations.forEach(location => {
      pdf.text(`${location.location}: ${location.percentage}%`, 30, yPosition);
      yPosition += 6;
    });

    // Footer
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(8);
    pdf.text(`Generated on ${currentDate} by ChariotAI`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    pdf.save(`ChariotAI-Report-${currentDate}.pdf`);
  }

  static async exportPageToPDF(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for PDF export');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  }
}
