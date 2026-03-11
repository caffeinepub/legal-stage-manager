import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";

actor {
  type Case = {
    contractId : Text;
    caseId : Text;
    caseDescription : Text;
    status : Text;
    customerName : Text;
    customerNumber : Text;
    outstandingBalance : Float;
    mobileNumber : Text;
    omniflowNumber : Text;
    productType : Text;
    assignedAgency : Text;
  };

  module Case {
    public func compare(case1 : Case, case2 : Case) : Order.Order {
      Text.compare(case1.caseId, case2.caseId);
    };
  };

  type LitigationStatus = {
    #filed;
    #awaitingHearing;
    #inTrial;
    #judgementIssued;
  };

  type Judgement = {
    #wageGarnishment;
    #propertyLien;
    #writOfSeizureSale;
    #assetRepossession;
    #auction;
    #none;
  };

  type LitigationRecord = {
    courtCaseNumber : Text;
    filingDate : Time.Time;
    courtName : Text;
    courtSummonsDate : ?Time.Time;
    hearingDate : ?Time.Time;
    caseStatus : LitigationStatus;
    judgement : Judgement;
  };

  type EnforcementRecord = {
    enforcementType : Text;
    initiationDate : Time.Time;
    status : Text;
    amountRecovered : Float;
    responsibleLegalParty : Text;
  };

  type NoticeType = {
    #firstDemand;
    #finalDemand;
    #statutory;
  };

  type DeliveryMethod = {
    #email;
    #courier;
    #physical;
  };

  type NoticeStatus = {
    #active;
    #expired;
    #complied;
  };

  type NoticeRecord = {
    noticeId : Text;
    caseId : Text;
    noticeType : NoticeType;
    noticeSentDate : Time.Time;
    noticeExpiryDate : Time.Time;
    deliveryMethod : DeliveryMethod;
    deliveryStatus : Text;
    noticeStatus : NoticeStatus;
  };

  let cases = Map.empty<Text, Case>();
  let litigationRecords = Map.empty<Text, LitigationRecord>();
  let enforcementRecords = Map.empty<Text, EnforcementRecord>();
  let noticeRecords = List.empty<NoticeRecord>();

  public shared ({ caller }) func addCase(newCase : Case) : async () {
    if (cases.containsKey(newCase.caseId)) {
      Runtime.trap("Case with this ID already exists");
    };
    cases.add(newCase.caseId, newCase);
  };

  public shared ({ caller }) func updateCase(caseId : Text, updatedCase : Case) : async () {
    if (not cases.containsKey(caseId)) {
      Runtime.trap("Case not found");
    };
    cases.add(caseId, updatedCase);
  };

  public query ({ caller }) func getCases() : async [Case] {
    cases.values().toArray().sort();
  };

  public query ({ caller }) func getCase(caseId : Text) : async Case {
    switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) { c };
    };
  };

  public query ({ caller }) func getLitigation(caseId : Text) : async LitigationRecord {
    switch (litigationRecords.get(caseId)) {
      case (null) { Runtime.trap("Litigation record not found") };
      case (?rec) { rec };
    };
  };

  public shared ({ caller }) func updateLitigation(caseId : Text, record : LitigationRecord) : async () {
    if (not cases.containsKey(caseId)) {
      Runtime.trap("Case not found");
    };
    litigationRecords.add(caseId, record);
  };

  public query ({ caller }) func getEnforcement(caseId : Text) : async EnforcementRecord {
    switch (enforcementRecords.get(caseId)) {
      case (null) { Runtime.trap("Enforcement record not found") };
      case (?rec) { rec };
    };
  };

  public shared ({ caller }) func updateEnforcement(caseId : Text, record : EnforcementRecord) : async () {
    if (not cases.containsKey(caseId)) {
      Runtime.trap("Case not found");
    };
    enforcementRecords.add(caseId, record);
  };

  public query ({ caller }) func getNotices(caseId : Text) : async [NoticeRecord] {
    let filtered = noticeRecords.values().filter(
      func(n) {
        n.caseId == caseId;
      }
    );
    filtered.toArray();
  };
};
