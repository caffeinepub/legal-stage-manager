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
    customerName: "Amara Osei",
    customerNumber: "CUST-10045",
    mobileNumber: "+233 24 456 7890",
    status: "In Litigation",
    caseDescription: "Defaulted personal loan — 4 consecutive missed payments",
    outstandingBalance: 47250.0,
    omniflowNumber: "OFN-2024-3312",
    productType: "Personal Loan",
    assignedAgency: "Blackstone Legal Associates",
  },
  {
    caseId: "CASE-2024-002",
    contractId: "CTR-91205",
    customerName: "Kweku Mensah",
    customerNumber: "CUST-10198",
    mobileNumber: "+233 20 312 9900",
    status: "Active",
    caseDescription:
      "Mortgage arrears — 3 months overdue, formal demand issued",
    outstandingBalance: 218600.0,
    omniflowNumber: "OFN-2024-4471",
    productType: "Mortgage",
    assignedAgency: "Axiom Recovery Partners",
  },
  {
    caseId: "CASE-2024-003",
    contractId: "CTR-65871",
    customerName: "Efua Darko",
    customerNumber: "CUST-10311",
    mobileNumber: "+233 55 678 2200",
    status: "Active",
    caseDescription:
      "Auto loan default — vehicle still in possession of debtor",
    outstandingBalance: 33500.0,
    omniflowNumber: "OFN-2024-5523",
    productType: "Auto Loan",
    assignedAgency: "Prime Collections Ltd",
  },
  {
    caseId: "CASE-2024-004",
    contractId: "CTR-44890",
    customerName: "Kofi Asante",
    customerNumber: "CUST-10422",
    mobileNumber: "+233 26 991 3344",
    status: "Judgment Issued",
    caseDescription:
      "SME overdraft facility — judgment granted, enforcement pending",
    outstandingBalance: 89750.0,
    omniflowNumber: "OFN-2024-6614",
    productType: "Business Overdraft",
    assignedAgency: "Blackstone Legal Associates",
  },
  {
    caseId: "CASE-2024-005",
    contractId: "CTR-33217",
    customerName: "Abena Frempong",
    customerNumber: "CUST-10509",
    mobileNumber: "+233 54 112 7788",
    status: "Settled",
    caseDescription: "Credit card debt — repayment plan agreed and completed",
    outstandingBalance: 0.0,
    omniflowNumber: "OFN-2024-7720",
    productType: "Credit Card",
    assignedAgency: "Meridian Debt Solutions",
  },
  {
    caseId: "CASE-2024-006",
    contractId: "CTR-29944",
    customerName: "Yaw Boateng",
    customerNumber: "CUST-10634",
    mobileNumber: "+233 23 445 6612",
    status: "Active",
    caseDescription: "Equipment finance — default after business closure",
    outstandingBalance: 61400.0,
    omniflowNumber: "OFN-2024-8815",
    productType: "Equipment Finance",
    assignedAgency: "Prime Collections Ltd",
  },
];

export const sampleLitigation: Record<string, LitigationRecord> = {
  "CASE-2024-001": {
    courtCaseNumber: "GH/HCC/2024/1142",
    filingDate: d("2024-08-15"),
    courtName: "High Court — Commercial Division, Accra",
    courtSummonsDate: d("2026-03-25"),
    hearingDate: d("2026-04-10"),
    caseStatus: LitigationStatus.awaitingHearing,
    judgement: Judgement.none,
  },
  "CASE-2024-004": {
    courtCaseNumber: "GH/HCC/2024/0887",
    filingDate: d("2024-06-01"),
    courtName: "High Court — Commercial Division, Kumasi",
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
    responsibleLegalParty: "Blackstone Legal Associates — Michael Asare, Esq.",
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
