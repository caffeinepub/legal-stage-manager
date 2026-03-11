import type {
  Case,
  EnforcementRecord,
  LitigationRecord,
  NoticeRecord,
} from "../backend.d";
import {
  DeliveryMethod,
  Judgement,
  LitigationStatus,
  NoticeStatus,
  NoticeType,
} from "../backend.d";

const d = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

export const sampleCases: Case[] = [
  {
    caseId: "CASE-2024-001",
    contractId: "CTR-78432",
    customerName: "James Kariuki Mwangi",
    customerNumber: "CUST-10045",
    mobileNumber: "+254 722 456 789",
    status: "In Litigation",
    caseDescription: "Defaulted personal loan — 4 consecutive missed payments",
    outstandingBalance: 47250.0,
    omniflowNumber: "OFN-2024-3312",
    productType: "Personal Loan",
    assignedAgency: "Oraro & Company Advocates",
  },
  {
    caseId: "CASE-2024-002",
    contractId: "CTR-91205",
    customerName: "Grace Wanjiku Njoroge",
    customerNumber: "CUST-10198",
    mobileNumber: "+254 733 312 990",
    status: "Active",
    caseDescription:
      "Mortgage arrears — 3 months overdue, formal demand issued",
    outstandingBalance: 218600.0,
    omniflowNumber: "OFN-2024-4471",
    productType: "Mortgage",
    assignedAgency: "Coulson Harney Advocates",
  },
  {
    caseId: "CASE-2024-003",
    contractId: "CTR-65871",
    customerName: "Peter Otieno Odhiambo",
    customerNumber: "CUST-10311",
    mobileNumber: "+254 710 678 220",
    status: "Active",
    caseDescription:
      "Auto loan default — vehicle still in possession of debtor",
    outstandingBalance: 33500.0,
    omniflowNumber: "OFN-2024-5523",
    productType: "Auto Loan",
    assignedAgency: "Hamilton Harrison & Mathews",
  },
  {
    caseId: "CASE-2024-004",
    contractId: "CTR-44890",
    customerName: "Mary Wambui Kamau",
    customerNumber: "CUST-10422",
    mobileNumber: "+254 722 991 334",
    status: "Judgment Issued",
    caseDescription:
      "SME overdraft facility — judgment granted, enforcement pending",
    outstandingBalance: 89750.0,
    omniflowNumber: "OFN-2024-6614",
    productType: "Business Overdraft",
    assignedAgency: "Oraro & Company Advocates",
  },
  {
    caseId: "CASE-2024-005",
    contractId: "CTR-33217",
    customerName: "David Kipchoge Rotich",
    customerNumber: "CUST-10509",
    mobileNumber: "+254 711 112 778",
    status: "Settled",
    caseDescription: "Credit card debt — repayment plan agreed and completed",
    outstandingBalance: 0.0,
    omniflowNumber: "OFN-2024-7720",
    productType: "Credit Card",
    assignedAgency: "Anjarwalla & Khanna",
  },
  {
    caseId: "CASE-2024-006",
    contractId: "CTR-29944",
    customerName: "Faith Achieng Omondi",
    customerNumber: "CUST-10634",
    mobileNumber: "+254 723 445 661",
    status: "Active",
    caseDescription: "Equipment finance — default after business closure",
    outstandingBalance: 61400.0,
    omniflowNumber: "OFN-2024-8815",
    productType: "Equipment Finance",
    assignedAgency: "Hamilton Harrison & Mathews",
  },
];

export const sampleLitigation: Record<string, LitigationRecord> = {
  "CASE-2024-001": {
    courtCaseNumber: "ELC/NRB/2024/1142",
    filingDate: d("2024-08-15"),
    courtName: "High Court — Environment & Land Court, Nairobi",
    courtSummonsDate: d("2026-03-19"),
    hearingDate: d("2026-04-02"),
    caseStatus: LitigationStatus.awaitingHearing,
    judgement: Judgement.none,
  },
  "CASE-2024-004": {
    courtCaseNumber: "COMM/NRB/2024/0887",
    filingDate: d("2024-06-01"),
    courtName: "High Court — Commercial Division, Nairobi",
    courtSummonsDate: d("2024-09-10"),
    hearingDate: d("2024-11-20"),
    caseStatus: LitigationStatus.judgementIssued,
    judgement: Judgement.propertyLien,
  },
};

export const sampleEnforcement: Record<string, EnforcementRecord> = {
  "CASE-2024-004": {
    enforcementType: "Property Lien",
    initiationDate: d("2025-01-15"),
    status: "In Progress",
    amountRecovered: 12000,
    responsibleLegalParty: "Oraro & Company Advocates — Samuel Gitau, Esq.",
  },
};

export const sampleNotices: Record<string, NoticeRecord[]> = {
  "CASE-2024-001": [
    {
      noticeId: "NTF-001-A",
      caseId: "CASE-2024-001",
      noticeType: NoticeType.firstDemand,
      noticeSentDate: d("2024-05-10"),
      noticeExpiryDate: d("2024-06-10"),
      deliveryMethod: DeliveryMethod.email,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.expired,
    },
    {
      noticeId: "NTF-001-B",
      caseId: "CASE-2024-001",
      noticeType: NoticeType.finalDemand,
      noticeSentDate: d("2024-06-20"),
      noticeExpiryDate: d("2024-07-20"),
      deliveryMethod: DeliveryMethod.courier,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.expired,
    },
    {
      noticeId: "NTF-001-C",
      caseId: "CASE-2024-001",
      noticeType: NoticeType.statutory,
      noticeSentDate: d("2026-02-01"),
      noticeExpiryDate: d("2026-04-15"),
      deliveryMethod: DeliveryMethod.physical,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.active,
    },
  ],
  "CASE-2024-002": [
    {
      noticeId: "NTF-002-A",
      caseId: "CASE-2024-002",
      noticeType: NoticeType.firstDemand,
      noticeSentDate: d("2026-01-15"),
      noticeExpiryDate: d("2026-03-30"),
      deliveryMethod: DeliveryMethod.email,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.active,
    },
  ],
  "CASE-2024-003": [
    {
      noticeId: "NTF-003-A",
      caseId: "CASE-2024-003",
      noticeType: NoticeType.firstDemand,
      noticeSentDate: d("2026-01-20"),
      noticeExpiryDate: d("2026-04-05"),
      deliveryMethod: DeliveryMethod.courier,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.active,
    },
  ],
  "CASE-2024-005": [
    {
      noticeId: "NTF-005-A",
      caseId: "CASE-2024-005",
      noticeType: NoticeType.firstDemand,
      noticeSentDate: d("2023-09-01"),
      noticeExpiryDate: d("2023-10-01"),
      deliveryMethod: DeliveryMethod.email,
      deliveryStatus: "Delivered",
      noticeStatus: NoticeStatus.complied,
    },
  ],
};
