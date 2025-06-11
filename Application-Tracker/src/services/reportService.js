import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Function to generate report data
export const generateReport = async (reportType, dateRange) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the report data based on type
    const reportData = simulateReportData(reportType, dateRange);
    return reportData;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
};

// Function to download report
export const downloadReport = async (reportType, format = 'xlsx') => {
  try {
    const data = await generateReport(reportType);
    
    switch (format) {
      case 'xlsx':
        return downloadExcel(data, reportType);
      case 'csv':
        return downloadCSV(data, reportType);
      case 'pdf':
        return downloadPDF(data, reportType);
      default:
        throw new Error('Unsupported format');
    }
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};

// Helper function to download Excel
const downloadExcel = (data, reportType) => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheets for different sections
  const positionsSheet = XLSX.utils.json_to_sheet(data.openPositions);
  const statusSheet = XLSX.utils.json_to_sheet(data.statusDetails);
  const metricsSheet = XLSX.utils.json_to_sheet(data.metrics);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, positionsSheet, "Open Positions");
  XLSX.utils.book_append_sheet(wb, statusSheet, "Status Details");
  XLSX.utils.book_append_sheet(wb, metricsSheet, "Recruitment Metrics");

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, `${reportType}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Helper function to download CSV
const downloadCSV = (data, reportType) => {
  // Convert data to CSV format
  const csvContent = Object.entries(data)
    .map(([key, value]) => {
      const headers = Object.keys(value[0]).join(',');
      const rows = value.map(row => Object.values(row).join(','));
      return `${key}\n${headers}\n${rows.join('\n')}`;
    })
    .join('\n\n');

  // Create and save CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
};

// Helper function to download PDF
const downloadPDF = (data, reportType) => {
  // PDF generation will be implemented later
  console.log('PDF generation not implemented yet');
};

// Simulate report data based on type
const simulateReportData = (reportType, dateRange) => {
  // Sample data for open positions
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      status: "Active",
      applications: 25,
      daysOpen: 15,
      targetHireDate: "2024-04-15"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "New York",
      status: "Active",
      applications: 18,
      daysOpen: 10,
      targetHireDate: "2024-04-10"
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "San Francisco",
      status: "Active",
      applications: 30,
      daysOpen: 20,
      targetHireDate: "2024-04-20"
    }
  ];

  // Sample data for status details
  const statusDetails = [
    {
      status: "Under Review",
      count: 45,
      percentage: 30,
      avgTimeInStatus: "5 days"
    },
    {
      status: "Interview",
      count: 25,
      percentage: 17,
      avgTimeInStatus: "7 days"
    },
    {
      status: "Offer",
      count: 10,
      percentage: 7,
      avgTimeInStatus: "3 days"
    },
    {
      status: "Hired",
      count: 15,
      percentage: 10,
      avgTimeInStatus: "2 days"
    },
    {
      status: "Rejected",
      count: 55,
      percentage: 36,
      avgTimeInStatus: "4 days"
    }
  ];

  // Sample data for recruitment metrics
  const metrics = [
    {
      metric: "Time to Fill",
      value: "32 days",
      target: "30 days",
      status: "Slightly Above Target"
    },
    {
      metric: "Quality of Hire",
      value: "4.2/5",
      target: "4.0/5",
      status: "Above Target"
    },
    {
      metric: "Offer Acceptance Rate",
      value: "85%",
      target: "80%",
      status: "Above Target"
    },
    {
      metric: "Cost per Hire",
      value: "$5,000",
      target: "$5,500",
      status: "Below Target"
    }
  ];

  return {
    openPositions,
    statusDetails,
    metrics
  };
}; 