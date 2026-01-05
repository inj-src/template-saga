export const Bill = {
  billId: "H-2025-007891",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
    contact: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Springfield",
  },
  admissionInfo: {
    admissionDate: "2025-12-01T14:30:00Z",
    bed: "WARD-A-203",
  },
  lineItems: [
    {
      description: "Admission Fee",
      amount: 500.0,
    },
    {
      description: "Operation Fee",
      amount: 50000.0,
    },
    {
      description: "Surgeon Fee",
      amount: 12000.0,
    },
    {
      description: "Room Rent (3 days @ 1500)",
      amount: 4500.0,
    },
    {
      description: "Pharmacy and Medical Supplies",
      amount: 3275.5,
    },
    {
      description: "Lab Tests",
      amount: 1200.0,
    },
  ],
  billSummary: {
    totalAmount: 71475.5,
    discount: 2500.0,
    totalPayable: 68975.5,
    amountPaid: 60000.0,
    due: 8975.5,
    paidAmountInWord: "Sixty Thousand Dollars Only",
  },
  printDetails: { 
    printBy: "billing_clerk_02",
    printingTime: "2025-12-09T00:23:00Z",
  },
};

export type DataType = typeof Bill;

export interface DataSet {
  label: string;
  data: unknown;
  templateHtml?: string;
}

export const allDataSets: Record<string, DataSet> = {
  bill: {
    label: "Hospital Bill (Dummy)", data: Bill,
    templateHtml: `<!--docxjs library predefined styles--><style>
.docx-wrapper { background: gray; padding: 30px; padding-bottom: 0px; display: flex; flex-flow: column; align-items: center; } 
.docx-wrapper>section.docx { background: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-bottom: 30px; }
.docx { color: black; hyphens: auto; text-underline-position: from-font; }
section.docx { box-sizing: border-box; display: flex; flex-flow: column nowrap; position: relative; overflow: hidden; }
section.docx>article { margin-bottom: auto; z-index: 1; }
section.docx>footer { z-index: 1; }
.docx table { border-collapse: collapse; }
.docx table td, .docx table th { vertical-align: top; }
.docx p { margin: 0pt; min-height: 1em; }
.docx span { white-space: pre-wrap; overflow-wrap: break-word; }
.docx a { color: inherit; text-decoration: inherit; }
.docx svg { fill: transparent; }
</style><!--docxjs document theme values--><style>.docx {
  --docx-majorHAnsi-font: Calibri;
  --docx-minorHAnsi-font: Cambria;
  --docx-dk1-color: #000000;
  --docx-lt1-color: #FFFFFF;
  --docx-dk2-color: #1F497D;
  --docx-lt2-color: #EEECE1;
  --docx-accent1-color: #4F81BD;
  --docx-accent2-color: #C0504D;
  --docx-accent3-color: #9BBB59;
  --docx-accent4-color: #8064A2;
  --docx-accent5-color: #4BACC6;
  --docx-accent6-color: #F79646;
  --docx-hlink-color: #0000FF;
  --docx-folHlink-color: #800080;
}
</style><!--docxjs document styles--><style>.docx span {
  font-family: Arial;
  min-height: 11.00pt;
  font-size: 11.00pt;
}
.docx p {
  line-height: 1.15;
}
.docx table, table.docx_tablenormal td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
p.docx_heading1 {
  margin-top: 20.00pt;
  margin-bottom: 6.00pt;
}
p.docx_heading1 span {
  min-height: 20.00pt;
  font-size: 20.00pt;
}
p.docx_heading2 {
  margin-top: 18.00pt;
  margin-bottom: 6.00pt;
}
p.docx_heading2 span {
  font-weight: normal;
  min-height: 16.00pt;
  font-size: 16.00pt;
}
p.docx_heading3 {
  margin-top: 16.00pt;
  margin-bottom: 4.00pt;
}
p.docx_heading3 span {
  font-weight: normal;
  color: #434343;
  min-height: 14.00pt;
  font-size: 14.00pt;
}
p.docx_heading4 {
  margin-top: 14.00pt;
  margin-bottom: 4.00pt;
}
p.docx_heading4 span {
  color: #666666;
  min-height: 12.00pt;
  font-size: 12.00pt;
}
p.docx_heading5 {
  margin-top: 12.00pt;
  margin-bottom: 4.00pt;
}
p.docx_heading5 span {
  color: #666666;
  min-height: 11.00pt;
  font-size: 11.00pt;
}
p.docx_heading6 {
  margin-top: 12.00pt;
  margin-bottom: 4.00pt;
}
p.docx_heading6 span {
  font-style: italic;
  color: #666666;
  min-height: 11.00pt;
  font-size: 11.00pt;
}
p.docx_title {
  margin-top: 0.00pt;
  margin-bottom: 3.00pt;
}
p.docx_title span {
  min-height: 26.00pt;
  font-size: 26.00pt;
}
p.docx_subtitle {
  margin-top: 0.00pt;
  margin-bottom: 16.00pt;
}
p.docx_subtitle span {
  font-family: Arial;
  font-style: normal;
  color: #666666;
  min-height: 15.00pt;
  font-size: 15.00pt;
}
table.docx_table1 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table1 tr.odd-row {
}
table.docx_table1 td.odd-col {
}
table.docx_table1 tr.even-row {
}
table.docx_table1 td.even-col {
}
table.docx_table1 td.first-col {
}
table.docx_table1 tr.first-row td {
}
table.docx_table1 td.last-col {
}
table.docx_table1 tr.last-row td {
}
table.docx_table2 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table2 tr.odd-row {
}
table.docx_table2 td.odd-col {
}
table.docx_table2 tr.even-row {
}
table.docx_table2 td.even-col {
}
table.docx_table2 td.first-col {
}
table.docx_table2 tr.first-row td {
}
table.docx_table2 td.last-col {
}
table.docx_table2 tr.last-row td {
}
table.docx_table3 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table3 tr.odd-row {
}
table.docx_table3 td.odd-col {
}
table.docx_table3 tr.even-row {
}
table.docx_table3 td.even-col {
}
table.docx_table3 td.first-col {
}
table.docx_table3 tr.first-row td {
}
table.docx_table3 td.last-col {
}
table.docx_table3 tr.last-row td {
}
table.docx_table4 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table4 tr.odd-row {
}
table.docx_table4 td.odd-col {
}
table.docx_table4 tr.even-row {
}
table.docx_table4 td.even-col {
}
table.docx_table4 td.first-col {
}
table.docx_table4 tr.first-row td {
}
table.docx_table4 td.last-col {
}
table.docx_table4 tr.last-row td {
}
table.docx_table5 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table5 tr.odd-row {
}
table.docx_table5 td.odd-col {
}
table.docx_table5 tr.even-row {
}
table.docx_table5 td.even-col {
}
table.docx_table5 td.first-col {
}
table.docx_table5 tr.first-row td {
}
table.docx_table5 td.last-col {
}
table.docx_table5 tr.last-row td {
}
table.docx_table6 td {
  padding-top: 5.00pt;
  padding-left: 5.00pt;
  padding-bottom: 5.00pt;
  padding-right: 5.00pt;
}
table.docx_table6 tr.odd-row {
}
table.docx_table6 td.odd-col {
}
table.docx_table6 tr.even-row {
}
table.docx_table6 td.even-col {
}
table.docx_table6 td.first-col {
}
table.docx_table6 tr.first-row td {
}
table.docx_table6 td.last-col {
}
table.docx_table6 tr.last-row td {
}
</style><!--docxjs document numbering styles--><style>p.docx-num-1-0:before {
  content: "●\\9";
  counter-increment: docx-num-1-0;
  text-decoration: none;
}
p.docx-num-1-0 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -40.50pt;
  margin-inline-start: 36.00pt;
}
p.docx-num-1-0 {
  counter-set: docx-num-1-1 0;
}
p.docx-num-1-1:before {
  content: "○\\9";
  counter-increment: docx-num-1-1;
  text-decoration: none;
}
p.docx-num-1-1 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 72.00pt;
}
p.docx-num-1-1 {
  counter-set: docx-num-1-2 0;
}
p.docx-num-1-2:before {
  content: "■\\9";
  counter-increment: docx-num-1-2;
  text-decoration: none;
}
p.docx-num-1-2 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 108.00pt;
}
p.docx-num-1-2 {
  counter-set: docx-num-1-3 0;
}
p.docx-num-1-3:before {
  content: "●\\9";
  counter-increment: docx-num-1-3;
  text-decoration: none;
}
p.docx-num-1-3 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 144.00pt;
}
p.docx-num-1-3 {
  counter-set: docx-num-1-4 0;
}
p.docx-num-1-4:before {
  content: "○\\9";
  counter-increment: docx-num-1-4;
  text-decoration: none;
}
p.docx-num-1-4 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 180.00pt;
}
p.docx-num-1-4 {
  counter-set: docx-num-1-5 0;
}
p.docx-num-1-5:before {
  content: "■\\9";
  counter-increment: docx-num-1-5;
  text-decoration: none;
}
p.docx-num-1-5 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 216.00pt;
}
p.docx-num-1-5 {
  counter-set: docx-num-1-6 0;
}
p.docx-num-1-6:before {
  content: "●\\9";
  counter-increment: docx-num-1-6;
  text-decoration: none;
}
p.docx-num-1-6 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 252.00pt;
}
p.docx-num-1-6 {
  counter-set: docx-num-1-7 0;
}
p.docx-num-1-7:before {
  content: "○\\9";
  counter-increment: docx-num-1-7;
  text-decoration: none;
}
p.docx-num-1-7 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 288.00pt;
}
p.docx-num-1-7 {
  counter-set: docx-num-1-8 0;
}
p.docx-num-1-8:before {
  content: "■\\9";
  counter-increment: docx-num-1-8;
  text-decoration: none;
}
p.docx-num-1-8 {
  display: list-item;
  list-style-position: inside;
  list-style-type: none;
  text-indent: -18.00pt;
  margin-inline-start: 324.00pt;
}
:root {
  counter-reset: docx-num-1-0 0 docx-num-1-1 0 docx-num-1-2 0 docx-num-1-3 0 docx-num-1-4 0 docx-num-1-5 0 docx-num-1-6 0 docx-num-1-7 0 docx-num-1-8 0;
}
</style><section class="docx" style="padding: 0pt 14.4pt; width: 595.3pt; min-height: 841.9pt;"><header style="margin-top: calc(0px); min-height: calc(0px);"><p style="line-height: 1;"><span></span></p><table class="no-hband no-vband docx_table6" style="width: 564pt; text-align: left; table-layout: auto;"><colgroup><col style="width: 84pt;"><col style="width: 480pt;"></colgroup><tbody><tr style="height: 65.3pt;"><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="line-height: 1;"><span><span style="display: inline-block; position: relative; text-indent: 0px; width: 59.48pt; height: 59.48pt;"><img src="data:application/octet-stream;base64,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" style="position: relative; left: 0pt; top: 0pt; width: 59.48pt; height: 59.48pt;"></span></span><span></span></p></td><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="line-height: 1.15;"><span style="font-weight: bold; min-height: 16pt; font-size: 16pt;">Demo Diagnostic Center</span></p><p style="line-height: 1.15;"><span style="min-height: 13pt; font-size: 13pt;">From somewhere - 1230</span></p><p style="line-height: 1.15;"><span style="min-height: 13pt; font-size: 13pt;">Mob: 019XXXXXX</span></p></td></tr></tbody></table><p style="line-height: 1;"><span></span></p></header><article><p><span></span></p><table class="no-hband no-vband docx_table1" style="width: 565.5pt; text-align: left; table-layout: auto;"><colgroup><col style="width: 79.5pt;"><col style="width: 203.25pt;"><col style="width: 108.75pt;"><col style="width: 174pt;"></colgroup><tbody><tr><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>Name</span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Contact    </span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Gender </span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Age</span></p><p class="docx-num-1-0" style="margin-top: 10pt; text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Address:</span></p></td><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>: {{patientInfo.name}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>: {{patientInfo.contact}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>: {{patientInfo.gender}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>: {{patientInfo.age}}</span></p><p style="margin-top: 10pt; text-indent: -13.5pt; margin-inline-start: 9pt; text-align: justify;"><span>: {{patientInfo.address}}</span></p><p style="line-height: 1;"><span></span></p></td><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Patient Id</span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Bill Id</span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Admission Date</span></p><p class="docx-num-1-0" style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>Bed</span></p></td><td style="border-width: 1pt 1pt 1.5pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>: {{patientInfo.patientId}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>: {{billId}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>: {{admissionInfo.admissionDate}}</span></p><p style="text-indent: -13.5pt; margin-inline-start: 9pt;"><span>: {{admissionInfo.bed}}</span></p></td></tr></tbody></table><p><span></span></p><table class="no-hband no-vband docx_table2" style="width: 168.75pt; table-layout: auto; margin-left: auto; margin-right: auto;"><colgroup><col style="width: 168.75pt;"></colgroup><tbody><tr><td style="background-color: rgb(207, 226, 243); padding: 5pt; vertical-align: top; border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255);"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: center;"><span style="font-weight: bold;">Bill Summary</span></p></td></tr></tbody></table><p style="text-align: left;"><span>{{#table lineItems target="a" sum="amount"}} {{#table-target "a"}}</span><span></span></p><table class="no-hband no-vband docx_table3" style="width: 566.5pt; table-layout: auto; margin-left: auto; margin-right: auto;"><colgroup><col style="width: 283.25pt;"><col style="width: 283.25pt;"></colgroup><tbody><tr><td style="border-width: 0.5pt; border-style: solid; border-color: rgb(0, 0, 0) rgb(239, 239, 239) rgb(0, 0, 0) rgb(0, 0, 0); background-color: rgb(239, 239, 239); padding: 5pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: left;"><span></span></p></td><td style="border-width: 0.5pt; border-style: solid; border-color: rgb(0, 0, 0) rgb(0, 0, 0) rgb(0, 0, 0) rgb(239, 239, 239); background-color: rgb(239, 239, 239); padding: 5pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Amount</span></p></td></tr><tr><td style="border-width: 0.5pt; border-style: solid; border-color: rgb(0, 0, 0) rgb(255, 255, 255) rgb(0, 0, 0) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: left;"><span>\\{{description}}</span></p></td><td style="border-width: 0.5pt; border-style: solid; border-color: rgb(0, 0, 0) rgb(0, 0, 0) rgb(0, 0, 0) rgb(255, 255, 255); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>\\{{amount}}</span></p></td></tr></tbody></table><p><span>{{/table-target}} </span></p><table class="no-hband no-vband docx_table4" style="width: 564pt; text-align: left; table-layout: auto;"><colgroup><col style="width: 419.25pt;"><col style="width: 144.75pt;"></colgroup><tbody><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Total Amount:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{@sum-amount}} {{#with ../billSummary}}</span></p></td></tr><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Discount:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{discount}}</span></p></td></tr><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Total Payable:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{totalPayable}}</span></p></td></tr><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Amount Paid:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{amountPaid}}</span></p></td></tr><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Due:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{due}}</span></p></td></tr><tr><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt; text-align: right;"><span>Paid Amount in word:</span></p></td><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255); background-color: rgb(255, 255, 255); padding: 0.7pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 0pt; margin-inline: 0pt;"><span> {{paidAmountInWord}} {{/with}}</span></p></td></tr></tbody></table><p><span>{{/table}}</span></p><table class="no-hband no-vband docx_table5" style="width: 201pt; text-align: left; table-layout: auto;"><colgroup><col style="width: 201pt;"></colgroup><tbody><tr style="height: 20.25pt;"><td style="border-width: 1pt; border-style: solid; border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(0, 0, 0); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="border-width: initial; border-style: none; border-color: initial; background-color: inherit; margin-top: 0pt; margin-bottom: 0pt; line-height: 1; text-indent: 18pt; margin-inline: 0pt; text-align: left;"><span>Print By: {{printDetails.printBy}}</span><span></span></p></td></tr><tr style="height: 20.25pt;"><td style="border-width: 1pt; border-style: solid; border-color: rgb(0, 0, 0) rgb(255, 255, 255) rgb(255, 255, 255); background-color: inherit; padding: 5pt; vertical-align: top;"><p style="line-height: 1; text-indent: 4.5pt; text-align: center;"><span style="min-height: 10pt; font-size: 10pt;">Printing time: {{printDetails.printingTime}}</span><span></span></p></td></tr></tbody></table><p><span> </span></p><p><span></span></p><p><span></span></p></article><footer style="margin-bottom: calc(19.2px); min-height: calc(-19.2px);"><p style="text-align: center;"><span style="min-height: 9pt; font-size: 9pt;">©Demo Diagnostic Center</span></p></footer></section>`
  },
  // admission: { label: "Admission Details", data: AdmissionDetails },
  // "indoor-summary": { label: "Indoor Summary", data: IndoorSummary },
  // prescription: { label: "Prescription Record", data: PrescriptionRecord },
  // "lab-reports": { label: "Lab Reports", data: LabReports },
  // radiology: { label: "Radiology Report", data: RadiologyReport },
};

export type DataSetKey = keyof typeof allDataSets;
