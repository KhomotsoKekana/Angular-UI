import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexStroke,
    ApexFill,
    ApexTooltip,
    ApexLegend,
    ApexPlotOptions,
    ApexResponsive,
    ApexYAxis,
    ApexNonAxisChartSeries,
    ApexOptions,
    NgApexchartsModule
} from 'ng-apexcharts';

@Component({
    selector: 'app-chart',
    imports: [NgApexchartsModule],
    template: `
    <apx-chart
      #chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
      [yaxis]="chartOptions.yaxis"
      [title]="chartOptions.title"
      [dataLabels]="chartOptions.dataLabels"
      [stroke]="chartOptions.stroke"
      [fill]="chartOptions.fill"
      [tooltip]="chartOptions.tooltip"
      [legend]="chartOptions.legend"
      [plotOptions]="chartOptions.plotOptions"
      [responsive]="chartOptions.responsive"
      [labels]="chartOptions.labels"
      [theme]="chartOptions.theme"
    ></apx-chart>
  `,
    styles: [
        `:host { display: block; width: 100%; }
        
        ::ng-deep .apexcharts-canvas {
            background-color: transparent !important;
        }
        `
    ]
})
export class ChartComponent implements OnInit, OnChanges {

    @ViewChild('chart') chart: any;

    // Common inputs
    @Input() title: string = '';
    @Input() type: 'bar' | 'line' | 'area' | 'donut' | 'radialBar' | 'pie' = 'bar';
    @Input() height: number = 320;
    @Input() theme: 'light' | 'dark' = 'light';

    // Axis chart inputs (bar, line, area)
    @Input() series: any[] = []; // [{ name: 'Label', data: [1,2,3] }]
    @Input() categories: string[] = []; // ['Jan', 'Feb', 'Mar']

    // Non-axis chart inputs (donut, pie, radialBar)
    @Input() labels: string[] = []; // ['Team A', 'Team B', 'Team C']
    @Input() values: number[] = []; // [44, 55, 13]

    // Donut specific inputs
    @Input() centerLabel: string = '';
    @Input() centerValue: string = '';
    @Input() showTotal: boolean = false;
    @Input() totalLabel: string = 'Total';
    @Input() cornerRadius: number = 10;  // New input for controlling the corner radius
    @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
    // Advanced customization
    @Input() customOptions: Partial<ApexOptions> = {};

    @Input() enableDataLabels: boolean = false;
    @Input() valueFormatter?: (value: number) => string;

    chartOptions: Partial<ApexOptions> = {};

    // Track previous data to optimize updates
    private previousValues: number[] = [];
    private previousSeries: any[] = [];
    private isInitialized = false;

    ngOnInit(): void {
        this.buildChartOptions();
        this.isInitialized = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Check if we have a data-only update that doesn't require full chart rebuild
        if (this.isInitialized) {
            const hasDataChanges = changes['values'] !== undefined || changes['series'] !== undefined || changes['centerValue'] !== undefined;
            const hasStructuralChanges =
                changes['type'] !== undefined ||
                changes['height'] !== undefined ||
                changes['theme'] !== undefined ||
                changes['cornerRadius'] !== undefined ||
                changes['enableDataLabels'] !== undefined;

            const dataOnlyUpdate = hasDataChanges && !hasStructuralChanges;

            if (dataOnlyUpdate) {
                // Only update the data without recreating the entire chart
                this.updateChartData();
            } else {
                // Rebuild the chart for significant changes
                this.buildChartOptions();
            }
        } else {
            // First change detection cycle, chart not initialized yet
            this.buildChartOptions();
        }
    }

    private buildChartOptions(): void {
        // Determine if this is an axis chart or non-axis chart
        const isAxisChart = ['bar', 'line', 'area'].includes(this.type);

        // Build appropriate series data based on chart type
        const seriesData = isAxisChart
            ? this.series
            : this.values;

        // Create base options
        const options: Partial<ApexOptions> = {
            series: seriesData,
            chart: {
                type: this.type,
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            title: {
                text: this.title,
                align: 'left',
                style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
            },
            dataLabels: {
                enabled: this.enableDataLabels,
                formatter: this.valueFormatter ?
                    (val: string, opts: any) => {
                        const seriesIndex = opts.seriesIndex;
                        const numericValue = this.values[seriesIndex];
                        return this.valueFormatter ? this.valueFormatter(numericValue) : val;
                    } : undefined
            },
            stroke: {
                show: ['line', 'area'].includes(this.type) ? true : false,
                curve: ['line', 'area'].includes(this.type) ? 'smooth' : 'straight',
                width: 2,
            },
            fill: {
                type: this.type === 'area' ? 'gradient' : 'solid',
                colors: this.gradientBuilder(this.categories?.length || this.labels?.length),
            },
            tooltip: {
                theme: this.theme,
                y: {
                    formatter: this.valueFormatter || undefined
                },
                // For non-axis charts like donut/pie, custom formatter that uses valueFormatter
                custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
                    if (!this.valueFormatter || !['donut', 'pie'].includes(this.type)) {
                        return undefined; // Use default tooltip for other chart types
                    }

                    const value = this.values[seriesIndex];
                    const label = this.labels[seriesIndex];
                    const formattedValue = this.valueFormatter(value);

                    return `
                        <div class="apexcharts-tooltip-custom" style="padding: 8px; background: ${this.theme === 'dark' ? '#1E1E1E' : 'white'}; color: ${this.theme === 'dark' ? 'white' : 'black'}; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                            <div class="text-xs">${label}</div>
                            <div style="display: flex; align-items: center; margin-top: 4px;" class="text-xs">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${w.globals.colors[seriesIndex]}; margin-right: 6px;"></div>
                                <div>${formattedValue}</div>
                            </div>
                        </div>
                    `;
                }
            },
            legend: {
                position: this.legendPosition,
                fontSize: '12px',
                labels: { colors: this.theme === 'dark' ? '#eee' : '#555' },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        legend: { position: 'bottom' },
                    },
                },
            ],
            theme: {
                mode: this.theme
            }
        };

        // Add axis-specific options
        if (isAxisChart) {
            options.xaxis = {
                categories: this.categories,
                labels: { style: { fontSize: '12px' } },
            };
            options.yaxis = {
                labels: { style: { fontSize: '12px' } },
            };
        } else {
            // For non-axis charts like donut, pie
            options.labels = this.labels;
        }

        // Add chart-specific options
        if (this.type === 'bar') {
            options.plotOptions = {
                bar: {
                    borderRadius: 6,
                    columnWidth: '50%',
                    distributed: false
                }
            };
        } else if (['donut', 'pie'].includes(this.type)) {
            options.plotOptions = {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    expandOnClick: false,
                    offsetX: 0,
                    offsetY: 0,
                    customScale: 1,
                    dataLabels: {
                        offset: 0,
                    },
                    donut: {
                        size: '70%',  // Control the size of the donut hole
                        labels: {
                            show: true,
                            name: {
                                show: false,
                                offsetY: -10,
                                formatter: () => this.centerLabel || ''
                            },
                            value: {
                                show: false,
                                offsetY: 10,
                                formatter: () => this.centerValue || ''
                            },
                            total: {
                                show: true,  // Always show the total label
                                label: this.centerLabel || '',
                                // formatter: () => this.values.reduce((sum, val) => sum + val, 0).toString()
                                formatter: () => this.centerValue || ''
                            }
                        },
                    }
                }
            };

            // Add rounded corners for donut/pie slices
            if (options.plotOptions?.pie) {
                (options.plotOptions.pie as any).cornerRadius = this.cornerRadius;
            }

            // Add center label and value for donut charts
            if (this.type === 'donut' && (this.centerLabel || this.centerValue)) {
                // Need to cast to access nested properties
                const pieOptions = (options.plotOptions?.pie || {}) as any;
                if (pieOptions?.donut?.labels) {
                    if (this.centerLabel) {
                        pieOptions.donut.labels.name.show = true;
                        pieOptions.donut.labels.value.showAlways = true;
                        pieOptions.donut.labels.name.formatter = () => this.centerLabel;
                    }
                    if (this.centerValue) {
                        pieOptions.donut.labels.value.show = true;
                        pieOptions.donut.labels.value.showAlways = true;
                        pieOptions.donut.labels.value.formatter = () => this.centerValue;
                    }
                }
            }
        } else if (this.type === 'radialBar') {
            options.plotOptions = {
                radialBar: {
                    hollow: { size: '60%' },
                    track: { background: '#f4f4f4' },
                    dataLabels: {
                        name: { fontSize: '16px' },
                        value: { fontSize: '14px' },
                    },
                }
            };
        }

        // Merge with custom options (allowing overrides)
        this.chartOptions = { ...options, ...this.customOptions };
    }

    private gradientBuilder(steps: number = 3): string[] {
        // Get the primary RGB color from the CSS variable "--color-primary"
        const primaryRGB = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primary')
            .trim();
        // Parse the primary color from an "rgb(r, g, b)" string
        const rgbRegex = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/;
        const result = primaryRGB.match(rgbRegex);
        if (!result) {
            return [];
        }
        const r = parseInt(result[1], 10);
        const g = parseInt(result[2], 10);
        const b = parseInt(result[3], 10);

        // Helper: Convert RGB to HSL
        const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
            r /= 255;
            g /= 255;
            b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h = 0, s = 0;
            const l = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h * 360, s * 100, l * 100];
        };

        // Helper: Convert HSL to RGB
        const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
            h /= 360;
            s /= 100;
            l /= 100;
            let r: number, g: number, b: number;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p: number, q: number, t: number): number => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };

        // Helper: Convert number to two-character hex string
        const toHex = (num: number): string => {
            const hex = num.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        // Helper: Convert RGB values to Hex
        const rgbToHex = (r: number, g: number, b: number): string =>
            `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        // Convert the primary color to HSL
        const [h, s] = rgbToHsl(r, g, b);

        // We'll generate a gradient transitioning from a darker starting color to very dark.
        // Use a balanced easing function for more uniform variation across the entire color range
        const hexes: string[] = [];
        const lightnessMax = 85; // Starting lightness
        const lightnessMin = 15; // Very dark

        for (let i = 0; i < steps; i++) {
            const t = steps > 1 ? i / (steps - 1) : 0;
            // Cosine-based easing for more even distribution of color variations
            const eased = (1 - Math.cos(t * Math.PI)) / 2;
            const newL = lightnessMax - (lightnessMax - lightnessMin) * eased;
            const [newR, newG, newB] = hslToRgb(h, s, newL);
            hexes.push(rgbToHex(newR, newG, newB));
        }

        return hexes;
    }

   /**
 * Updates only the data series in the chart without rebuilding the entire chart
 */
private updateChartData(): void {
    if (!this.chart) return;

    const isAxisChart = ['bar', 'line', 'area'].includes(this.type);

    if (isAxisChart && JSON.stringify(this.series) !== JSON.stringify(this.previousSeries)) {
        // Update series data for axis charts
        this.chart.updateSeries(this.series, false);
        this.previousSeries = JSON.parse(JSON.stringify(this.series));

        // Update center value for donut if needed
        if (this.type === 'donut') {
            this.updateDonutCenterValue();
        }
    }
    else if (!isAxisChart && JSON.stringify(this.values) !== JSON.stringify(this.previousValues)) {
        // Update series data for non-axis charts (pie, donut)
        this.chart.updateSeries(this.values, false);
        this.previousValues = [...this.values];

        // Update center value for donut if needed
        if (this.type === 'donut') {
            this.updateDonutCenterValue();
        }
    } 
    // Handle case where only centerValue changed but not the data
    else if (this.type === 'donut') {
        this.updateDonutCenterValue();
    }
}

/**
 * Updates the center value of a donut chart when values change
 */
private updateDonutCenterValue(): void {
    if (this.type !== 'donut' || !this.chart) return;

    const totalValue = this.values.reduce((sum, val) => sum + val, 0);
    let formattedTotal = this.valueFormatter ? this.valueFormatter(totalValue) : totalValue.toString();

    // Update the donut center value
    if (this.chart.updateOptions) {
        this.chart.updateOptions({
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: !!this.centerLabel,
                                formatter: () => this.centerLabel || ''
                            },
                            value: {
                                show: true,
                                formatter: () => this.centerValue || formattedTotal
                            },
                            total: {
                                show: true,
                                label: this.centerLabel || '',
                                formatter: () => this.centerValue || formattedTotal
                            }
                        }
                    }
                }
            }
        }, false, false);
    }
}

}