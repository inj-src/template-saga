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

export const AdmissionDetails = {
  admissionId: "ADM-2025-003421",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
    bloodGroup: "B+",
    contact: "+1 (555) 987-6543",
    emergencyContact: "+1 (555) 123-4567",
    address: "456 Oak Avenue, Springfield",
  },
  admissionDetails: {
    admissionDate: "2025-12-01T14:30:00Z",
    admissionType: "Emergency",
    referredBy: "Dr. Robert Wilson",
    department: "Cardiology",
    ward: "WARD-A",
    bed: "WARD-A-203",
    roomType: "Private",
  },
  medicalInfo: {
    chiefComplaint: "Chest pain and shortness of breath",
    diagnosis: "Acute Coronary Syndrome",
    allergies: ["Penicillin", "Aspirin"],
    currentMedications: ["Metformin", "Lisinopril"],
    vitalSigns: {
      bloodPressure: "145/92 mmHg",
      pulse: "98 bpm",
      temperature: "98.6°F",
      respiratoryRate: "22 breaths/min",
      oxygenSaturation: "94%",
    },
  },
  attendingPhysician: {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    contact: "+1 (555) 234-5678",
  },
  admittedBy: "nurse_admin_01",
  admissionTime: "2025-12-01T14:30:00Z",
};

export const IndoorSummary = {
  summaryId: "IS-2025-007891",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
    admissionDate: "2025-12-01T14:30:00Z",
    dischargeDate: "2025-12-05T10:00:00Z",
    totalStayDays: 4,
  },
  treatmentSummary: {
    diagnosis: "Acute Coronary Syndrome - Successfully Treated",
    procedures: [
      "Coronary Angiography",
      "Percutaneous Coronary Intervention (PCI)",
      "Stent Placement",
    ],
    surgeries: [
      {
        name: "PCI with Stent",
        date: "2025-12-02T08:00:00Z",
        surgeon: "Dr. Sarah Johnson",
        duration: "2 hours 30 minutes",
      },
    ],
    medications: [
      "Clopidogrel 75mg - Daily",
      "Atorvastatin 40mg - Daily",
      "Metoprolol 50mg - Twice daily",
      "Aspirin 81mg - Daily",
    ],
  },
  dailyProgress: [
    {
      date: "2025-12-01",
      note: "Patient admitted with chest pain. ECG shows ST elevation. Shifted to ICU.",
      attendingDoctor: "Dr. Sarah Johnson",
    },
    {
      date: "2025-12-02",
      note: "Underwent successful PCI with stent placement. Stable post-procedure.",
      attendingDoctor: "Dr. Sarah Johnson",
    },
    {
      date: "2025-12-03",
      note: "Shifted to general ward. Vitals stable. Good recovery progress.",
      attendingDoctor: "Dr. Robert Wilson",
    },
    {
      date: "2025-12-04",
      note: "Patient ambulatory. No complications. Preparing for discharge.",
      attendingDoctor: "Dr. Robert Wilson",
    },
  ],
  dischargeCondition: "Stable and improved",
  followUpInstructions: "Follow up in cardiology OPD after 1 week",
  dischargedBy: "Dr. Sarah Johnson",
};

export const PrescriptionRecord = {
  prescriptionId: "RX-2025-008234",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
    contact: "+1 (555) 987-6543",
  },
  prescriptionDate: "2025-12-05T10:30:00Z",
  physician: {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    license: "MD-12345",
    contact: "+1 (555) 234-5678",
  },
  diagnosis: "Post-PCI - Acute Coronary Syndrome",
  medications: [
    {
      name: "Clopidogrel",
      dosage: "75mg",
      frequency: "Once daily",
      duration: "6 months",
      instructions: "Take with food",
      quantity: 180,
    },
    {
      name: "Atorvastatin",
      dosage: "40mg",
      frequency: "Once daily at bedtime",
      duration: "Ongoing",
      instructions: "Take at night",
      quantity: 90,
    },
    {
      name: "Metoprolol",
      dosage: "50mg",
      frequency: "Twice daily",
      duration: "Ongoing",
      instructions: "Take morning and evening",
      quantity: 180,
    },
    {
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      duration: "Ongoing",
      instructions: "Take after breakfast",
      quantity: 90,
    },
    {
      name: "Pantoprazole",
      dosage: "40mg",
      frequency: "Once daily before breakfast",
      duration: "3 months",
      instructions: "Take 30 minutes before meal",
      quantity: 90,
    },
  ],
  generalInstructions: [
    "Avoid heavy physical activities for 2 weeks",
    "Follow a low-fat, low-sodium diet",
    "Monitor blood pressure daily",
    "Avoid smoking and alcohol",
    "Get adequate rest",
  ],
  nextFollowUp: "2025-12-12T14:00:00Z",
  prescribedBy: "Dr. Sarah Johnson",
};

export const LabReports = {
  reportId: "LAB-2025-009876",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
  },
  collectionDate: "2025-12-02T06:00:00Z",
  reportDate: "2025-12-02T14:00:00Z",
  referredBy: "Dr. Sarah Johnson",
  testResults: [
    {
      category: "Complete Blood Count",
      tests: [
        {
          name: "Hemoglobin",
          value: "13.2",
          unit: "g/dL",
          normalRange: "12.0-15.5",
          status: "Normal",
        },
        {
          name: "WBC Count",
          value: "8.5",
          unit: "×10³/μL",
          normalRange: "4.5-11.0",
          status: "Normal",
        },
        {
          name: "Platelet Count",
          value: "245",
          unit: "×10³/μL",
          normalRange: "150-400",
          status: "Normal",
        },
      ],
    },
    {
      category: "Lipid Profile",
      tests: [
        {
          name: "Total Cholesterol",
          value: "245",
          unit: "mg/dL",
          normalRange: "<200",
          status: "High",
        },
        {
          name: "LDL Cholesterol",
          value: "165",
          unit: "mg/dL",
          normalRange: "<100",
          status: "High",
        },
        {
          name: "HDL Cholesterol",
          value: "42",
          unit: "mg/dL",
          normalRange: ">40",
          status: "Normal",
        },
        {
          name: "Triglycerides",
          value: "190",
          unit: "mg/dL",
          normalRange: "<150",
          status: "High",
        },
      ],
    },
    {
      category: "Cardiac Markers",
      tests: [
        {
          name: "Troponin I",
          value: "2.5",
          unit: "ng/mL",
          normalRange: "<0.04",
          status: "Elevated",
        },
        {
          name: "CK-MB",
          value: "45",
          unit: "U/L",
          normalRange: "<25",
          status: "Elevated",
        },
      ],
    },
    {
      category: "Kidney Function",
      tests: [
        {
          name: "Creatinine",
          value: "0.9",
          unit: "mg/dL",
          normalRange: "0.6-1.2",
          status: "Normal",
        },
        {
          name: "Blood Urea Nitrogen",
          value: "18",
          unit: "mg/dL",
          normalRange: "7-20",
          status: "Normal",
        },
      ],
    },
  ],
  pathologist: {
    name: "Dr. Michael Chen",
    license: "PATH-67890",
  },
  reportedBy: "lab_tech_05",
};

export const RadiologyReport = {
  reportId: "RAD-2025-005432",
  patientInfo: {
    patientId: "P-1002345",
    name: "Jane M. Smith",
    age: 52,
    gender: "Female",
  },
  examinationType: "Coronary Angiography",
  examinationDate: "2025-12-02T08:00:00Z",
  reportDate: "2025-12-02T11:00:00Z",
  referredBy: "Dr. Sarah Johnson",
  clinicalIndication: "Acute Coronary Syndrome - Chest Pain",
  technique: "Percutaneous approach via right femoral artery. Multiple projections obtained.",
  findings: {
    leftMainCoronaryArtery: "Normal - No significant stenosis",
    leftAnteriorDescending: "80% stenosis in mid-LAD segment",
    leftCircumflex: "30% stenosis in proximal segment - Non-significant",
    rightCoronaryArtery: "40% stenosis in mid-RCA - Non-significant",
    leftVentricleFunciton: "Mild hypokinesia in anteroseptal wall. LVEF estimated at 50%",
  },
  impression: [
    "Severe stenosis (80%) in mid-LAD requiring intervention",
    "Non-obstructive disease in LCx and RCA",
    "Mild LV systolic dysfunction",
  ],
  recommendation: "Immediate PCI with stent placement for LAD lesion",
  procedure: {
    performed: true,
    details: "Successful PCI with drug-eluting stent placement in mid-LAD",
    stentSize: "3.0 x 28 mm",
    postProcedureResult: "TIMI 3 flow restored. No residual stenosis.",
  },
  radiologist: {
    name: "Dr. Emily Rodriguez",
    specialization: "Interventional Cardiologist",
    license: "RAD-54321",
  },
  reportedBy: "rad_tech_03",
};

export type DataType = typeof Bill;

export const allDataSets = {
  bill: { label: "Hospital Bill", data: Bill },
  admission: { label: "Admission Details", data: AdmissionDetails },
  "indoor-summary": { label: "Indoor Summary", data: IndoorSummary },
  prescription: { label: "Prescription Record", data: PrescriptionRecord },
  "lab-reports": { label: "Lab Reports", data: LabReports },
  radiology: { label: "Radiology Report", data: RadiologyReport },
};

export type DataSetKey = keyof typeof allDataSets;
