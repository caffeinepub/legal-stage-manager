import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LitigationRecord {
    hearingDate?: Time;
    judgement: Judgement;
    caseStatus: LitigationStatus;
    courtSummonsDate?: Time;
    courtCaseNumber: string;
    filingDate: Time;
    courtName: string;
}
export type Time = bigint;
export interface NoticeRecord {
    noticeType: NoticeType;
    noticeSentDate: Time;
    deliveryStatus: string;
    deliveryMethod: DeliveryMethod;
    noticeExpiryDate: Time;
    noticeStatus: NoticeStatus;
    noticeId: string;
    caseId: string;
}
export interface EnforcementRecord {
    status: string;
    enforcementType: string;
    responsibleLegalParty: string;
    initiationDate: Time;
    amountRecovered: number;
}
export interface Case {
    customerName: string;
    status: string;
    customerNumber: string;
    mobileNumber: string;
    productType: string;
    outstandingBalance: number;
    caseId: string;
    omniflowNumber: string;
    assignedAgency: string;
    caseDescription: string;
    contractId: string;
}
export enum DeliveryMethod {
    courier = "courier",
    email = "email",
    physical = "physical"
}
export enum Judgement {
    propertyLien = "propertyLien",
    assetRepossession = "assetRepossession",
    none = "none",
    wageGarnishment = "wageGarnishment",
    auction = "auction",
    writOfSeizureSale = "writOfSeizureSale"
}
export enum LitigationStatus {
    filed = "filed",
    judgementIssued = "judgementIssued",
    awaitingHearing = "awaitingHearing",
    inTrial = "inTrial"
}
export enum NoticeStatus {
    active = "active",
    expired = "expired",
    complied = "complied"
}
export enum NoticeType {
    firstDemand = "firstDemand",
    statutory = "statutory",
    finalDemand = "finalDemand"
}
export interface backendInterface {
    addCase(newCase: Case): Promise<void>;
    getCase(caseId: string): Promise<Case>;
    getCases(): Promise<Array<Case>>;
    getEnforcement(caseId: string): Promise<EnforcementRecord>;
    getLitigation(caseId: string): Promise<LitigationRecord>;
    getNotices(caseId: string): Promise<Array<NoticeRecord>>;
    updateCase(caseId: string, updatedCase: Case): Promise<void>;
    updateEnforcement(caseId: string, record: EnforcementRecord): Promise<void>;
    updateLitigation(caseId: string, record: LitigationRecord): Promise<void>;
}
