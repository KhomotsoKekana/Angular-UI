import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../../../../ui/src/lib/chart/chart.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ChartComponent],
  templateUrl: './chart.component.html',
})
export class DocsChartComponent {
  // Chart type selection
  selectedChartType: 'bar' | 'line' | 'area' | 'donut' | 'pie' | 'radialBar' = 'bar';
  
  // Theme selection
  selectedTheme: 'light' | 'dark' = 'light';
  
  // Bar chart data
  barChartSeries = [
    {
      name: 'Sales',
      data: [44, 55, 57, 56, 61, 58]
    }, 
    {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105]
    }
  ];
  
  barChartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Line chart data
  lineChartSeries = [
    {
      name: 'Page Views',
      data: [28, 29, 33, 36, 32, 32, 33]
    },
    {
      name: 'Sessions',
      data: [12, 11, 14, 18, 17, 13, 13]
    }
  ];
  
  lineChartCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Area chart data
  areaChartSeries = [
    {
      name: 'New Users',
      data: [31, 40, 28, 51, 42, 109, 100]
    },
    {
      name: 'Returning Users',
      data: [11, 32, 45, 32, 34, 52, 41]
    }
  ];
  
  areaChartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Donut chart data
  donutChartLabels = ['Team A', 'Team B', 'Team C', 'Team D'];
  donutChartValues = [44, 55, 13, 33];
  donutCenterLabel = 'Total';
  donutCenterValue = '145';
  
  // Pie chart data
  pieChartLabels = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Others'];
  pieChartValues = [44, 23, 21, 17, 15];
  
  // Custom formatter examples
  percentageFormatter = (value: number): string => {
    return value.toFixed(1) + '%';
  };
  
  currencyFormatter = (value: number): string => {
    return '$' + value.toLocaleString();
  };
  
  // Options for customizing charts
  enableDataLabels = false;
  cornerRadius = 10;
  legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  chartHeight = 320;
  
  // Dynamic chart data updates demo
  liveUpdateData = [44, 55, 57, 56, 61, 58];
  
  updateChartData() {
    // Generate new random values
    this.liveUpdateData = this.liveUpdateData.map(() => 
      Math.floor(Math.random() * 50) + 30
    );
  }
  
  // Returns the appropriate series data based on the selected chart type
  getSeriesForSelectedChart() {
    switch (this.selectedChartType) {
      case 'bar': return this.barChartSeries;
      case 'line': return this.lineChartSeries;
      case 'area': return this.areaChartSeries;
      default: return [];
    }
  }
  
  // Returns the appropriate categories based on the selected chart type
  getCategoriesForSelectedChart() {
    switch (this.selectedChartType) {
      case 'bar': return this.barChartCategories;
      case 'line': return this.lineChartCategories;
      case 'area': return this.areaChartCategories;
      default: return [];
    }
  }
}