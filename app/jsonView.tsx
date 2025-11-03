import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);
import "highlight.js/styles/stackoverflow-light.css";

const data = {
  billId: "H-2025-007891",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
    contact: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Springfield, IL, 62704",
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
const highlightedCode = hljs.highlightAuto(JSON.stringify(data, null, 2)).value;

export default function JSONView() {
  return (
    <div className="bg-white p-4 border-gray-300 border-r w-full h-full overflow-auto">
      <h2 className="mb-2 font-semibold text-lg">JSON Data</h2>
      <pre className="bg-gray-100 p-4 rounded-md">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}
