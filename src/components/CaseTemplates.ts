export interface CaseTemplate {
  title: string;
  incidentType: string;
  location: string;
  date: string;
  rawNotes: string;
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    title: "GIFT City Tech Park Commercial Burglary",
    incidentType: "Commercial Burglary & Cyber Theft",
    location: "Tower 28B, GIFT City, Gandhinagar - Ahmedabad Highway, Gujarat 382355",
    date: "2026-06-15 at 03:14 AM",
    rawNotes: `On June 15, 2026, at approximately 0730 hours, I responded to Apex Cybertech offices in GIFT City regarding a reported commercial burglary and data theft. Made contact with reporting party, Priya Patel, VP of Operations. Priya stated she arrived at 0715 hours and found the rear glass door shattered.

I inspected the point of entry (POE). The glass door near the server room was broken with a concrete paver lying inside. Recovered a dark fabric sample snagged on the frame.
Inside, several desk drawers in the product design suite were opened and rummaged through.

Priya reported the following items missing:
1. 3x High-performance Workstations (Serial numbers provided: MP9481, MP2045, MP0491) containing proprietary financial software source code.
2. 1x Encrypted hardware ledger from the executive locker (passcode bypassed or unlocked via written code found in a desk drawer).

WITNESS / SUSPECT TESTIMONY:
Priya recalled that an ex-contractor, Mark Vane (S1), was terminated last Friday following a dispute over equity. Mark vowed to 'get what is rightfully mine' in front of two witnesses (Rajesh Shah, designer; and Neha Joshi, HR). Mark possessed a building swipe-card that had been deactivated, but the rear POE used a mechanical key latch.

SECURITY FOOTAGE SUMMARY:
Reviewed exterior CCTV from Ahmedabad-Gandhinagar expressway junction. At 0314 AM, a black Honda City sedan parked in the rear alleyway. A lone male wearing a dark hooded sweatshirt and face cover approached the glass door, broke it, entered, and re-emerged 4 minutes later carrying a loaded backpack before fleeing towards SG Highway. Fingerprint dusting yielded partial latents on desk B3. Secured raw fabric, glass shards, and CCTV footage for crime lab analysis.`
  },
  {
    title: "SG Highway Vehicle Interception & Seizure",
    incidentType: "Possession & Illegal Contraband Transport",
    location: "S.G. Highway (Near ISKCON Flyover), Satellite, Ahmedabad, Gujarat 380015",
    date: "2026-06-16 at 23:45 PM",
    rawNotes: `Inspector R.K. Jadeja (badge #AHM-4829) reports that on June 16, 2026, at approximately 2345 hours, while on mobile patrol on S.G. Highway near ISKCON Flyover, Satellite area, I observed a silver Hyundai Creta (Gujarat Registration GJ-01-XX-9482) traveling at excessive speed (95 km/h in a 60 km/h zone) and swerving between lanes without signaling.

Initiated traffic stop with lights and siren. Vehicle pulled over to the shoulder near Karnavati Club road junction.
Approached driver side and identified the driver as David Miller (DOB 11/12/1994) via Gujarat Driving License.
Upon contact, detected strong suspicious odor from cabin. Driver exhibited slurred speech and severe nervousness with shaking hands.

I requested driver to step out of vehicle for inspection.
During exit, observed a large duffel bag lying on the rear passenger floorboard stuffed with heat-sealed bricks of contraband.

SEARCH RESULTS & EVIDENCE SEIZED AT SATELLITE POLICE STATION:
1. Rear Floorboard: Black duffel bag containing 4 heat-sealed packages of illegal substances, total weight approximately 2.1 kg.
2. Glovebox: Precision digital counting scale with powder residue and ₹4,20,000 in cash ($2000 and ₹500 denominations, rubber-banded).
3. Under Driver's Seat: A concealed 9mm semi-automatic pistol, cold to touch, loaded with 8 rounds in magazine. Serial number: T94827-C.

Driver refused to answer questions regarding weapon or cash origin, stating 'speak to my advocate.' Driver placed under arrest and transported to Ahmedabad Cyber Crime Branch / Satellite Police Station for booking.`
  },
  {
    title: "Prahlad Nagar Elder Financial Cyber Scam",
    incidentType: "Elder Financial Fraud & Cyber Wire Fraud",
    location: "847 Corporate Road, Prahlad Nagar, Ahmedabad, Gujarat 380015",
    date: "2026-06-10 at 14:00 PM",
    rawNotes: `Responded to Ahmedabad Cyber Crime Branch lobby to record a formal complaint of elder financial cyber fraud. Met with victim's son, Amit Pendelton, and victim, Margaret Pendelton (Age 82, resident of Prahlad Nagar, Ahmedabad).

Margaret reported that over the last 3 weeks (commencing May 20, 2026), she fell victim to a digital arrest and wire transfer scam.
Margaret received phone calls from an individual posing as 'Special Officer Richard Cole' from the Cyber Crime Investigation Cell. The imposter claimed Margaret’s Aadhaar and bank accounts were linked to an international money-laundering syndicate operating across Gujarat borders.

To avoid immediate 'digital arrest' and asset frozen orders, Margaret was coerced into transferring her fixed deposit savings to a 'government escrow clearance account'.

BANK TRANSFER RECORDS (State Bank of India & HDFC Bank, SG Highway Branch):
- May 22, 2026: RTGS wire transfer of ₹45,00,000 to 'Zenith Holding Escrow' (Current Account ending in 9384).
- June 2, 2026: NEFT transfer of ₹85,00,000 to the same destination account.

Margaret was sworn to secrecy under threat of immediate arrest for obstruction of justice. The fraud was uncovered when her son reviewed her passbook and found her life savings depleted.
The caller used VoIP number +91 98250 01932 (returns generic inactive status). Bank wire receipts and handwritten caller instructions were seized as evidence. Ahmedabad Cyber Crime Cell has issued emergency freeze requests to the beneficiary bank.`
  }
];
