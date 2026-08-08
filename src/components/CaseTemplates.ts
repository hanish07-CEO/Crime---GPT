export interface CaseTemplate {
  title: string;
  incidentType: string;
  location: string;
  date: string;
  rawNotes: string;
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    title: "Apex Tech Office Burglary",
    incidentType: "Commercial Burglary",
    location: "404 Silicon Way, Suite B, San Jose, CA",
    date: "2026-06-15 at 03:14 AM",
    rawNotes: `On June 15, 2026, at approximately 0730 hours, I responded to Apex Tech offices regarding a reported commercial burglary. Upon arrival, I made contact with the reporting party, Sarah Lin, VP of Operations. Sarah stated she arrived at 0715 hours and found the rear glass door shattered.

I inspected the rear point of entry (POE). The double-pane glass door was completely shattered with a heavy rock lying inside the kitchen area. I recovered a single piece of dark fabric snagged on the door frame.
Inside, several desk drawers in the product design suite were opened and rummaged through.

Sarah reported the following items missing:
1. 3x Apple MacBook Pro laptops (Serial numbers provided: MP9481, MP2045, MP0491) stored on the design desks.
2. 1x Ledger crypto wallet from the executive safe (which had its combination bypassed or unlocked via written code found on the underside of the desk).

SARAH'S TESTIMONY:
Sarah recalled that an ex-independent contractor, Mark Vane (S1), was terminated last Friday, June 12, following a dispute over equity. Mark vowing to 'get what is rightfully mine' in front of two witnesses (John Doe, designer; and Lisa Chang, HR). Mark still possessed a building swipe-card that had reportedly been deactivated, but Sarah observed that the rear glass POE didn't use keycard locks, only manual key turn.

SECURITY FOOTAGE SUMMARY:
I reviewed exterior CCTV from the adjacent business. At 0314 AM, a dark-colored late-model sedan (possibly black Honda Civic) parked in the rear alleyway. A lone individual, male, wearing a dark hooded sweatshirt, dark pants, and face cover, exited the sedan, approached the rear door of Apex Tech, and threw a heavy object. The individual entered, re-emerged 4 minutes later carrying a loaded backpack, and fled southbound in the sedan. Fingerprint dusting was performed at the safe and product design suites, yielding partial latents on desk B3. Secured raw fabric, rock, and copy of security footage as evidence.`
  },
  {
    title: "Route 101 Traffic Stop Seizure",
    incidentType: "Possession for Sale (Narcotics)",
    location: "US-101 Southbound near Mile Marker 34.5, San Mateow",
    date: "2026-06-16 at 23:45 PM",
    rawNotes: `Officer Martinez (badge #4829) reports that on June 16, 2026, at approximately 2345 hours, I was on routine patrol in a marked vehicle. Observed a silver 2018 BMW 5-Series traveling Southbound on US-101. Vehicle was clocked at 84 MPH in a 65 MPH zone. Observed the vehicle swerving across lanes on two occasions without signaling.

Initiated a traffic stop with overhead lights/sirens. Vehicle pulled over to the right shoulder.
Approached driver side and identified lone occupant as David Miller (DOB 11/12/1994) via CA Driver's License.
Upon contact, I immediately detected a strong odor of burnt cannabis emitting from the cabin. David's eyes were bloodshot and watery. David's speech was slurred, and he appeared unusually nervous, with shaking hands.

I asked David to exit the vehicle to conduct a Standardized Field Sobriety Test (SFST).
During exit, I observed a brown paper shopping bag lying in plain view on the passenger side floorboard, stuffed with several thick heat-sealed plastic bags containing a green leafy substance.
Based on the plain view observation and the heavy odor, I detained David in the back of my patrol car and conducted a vehicle search.

SEARCH RESULTS & EVIDENCE SEIZED:
1. Passenger Floorboard: Brown paper bag containing 4 separate heat-sealed bags of green leafy substance, total weight approximately 2.1 pounds (suspected cannabis).
2. Glovebox: A silver digital scale with white residue, and $4,200 in cash ($20 and $100 denominations, rubber-banded).
3. Under Driver's Seat: A black Taurus 9mm semi-automatic pistol, cold to touch, loaded with 8 rounds in the magazine. Serial number: T94827-C.

David declined to answer any questions regarding the gun or the quantity of cash, stating 'talk to my lawyer.' David was not read Miranda at the scene since interrogation was halted. David transported to county jail and booked.`
  },
  {
    title: "Elder Financial Scams Alert",
    incidentType: "Elder Financial Abuse & Wire Fraud",
    location: "847 Oak Avenue, Palo Alto, CA",
    date: "2026-06-10 at 14:00 PM",
    rawNotes: `I responded to Palo Alto Police lobby to take a telephonic/walk-in report of elder financial fraud. Met with victim's son, Arthur Pendelton, and the victim, Margaret Pendelton (Age 82).

Margaret reported that over the last 3 weeks (commencing May 20, 2026), she fell victim to a wire transfer scam.
 Margaret received a phone call from an individual claiming to be 'Federal Special Agent Richard Cole' from the Federal Trade Commission (FTC). Cole claimed that Margaret’s social security number had been compromised and was linked to a money-laundering ring in southern Texas.
To protect her retirement accounts from federal 'forfeiture orders,' Margaret was instructed to liquidate her mutual funds and wire them to a 'federal secure vault account' pending the completion of the investigation.

 Margaret’s banking records show the following transactions wire-transferred:
- May 22, 2026: Wire transfer of $45,000 to 'Zenith Holding Escrow LLC' at Chase Bank (Account ended in 9384).
- June 2, 2026: Wire transfer of $85,000 to same Chase Bank account.

Margaret was sworn to absolute secrecy. Cole told her that any disclosure would 'compromise national security' and lead to her arrest for obstruction of justice.
The scam was discovered when Margaret’s son, Arthur, reviewed her ledger and found her savings completely depleted.
Margaret provided the cell phone number Cole used: (650) 555-0193. Phone number was called, but returns a generic deactivated Google Voice voicemail. Bank wire receipts and Margaret's notepad with Cole's handwritten instructions were secured as evidence. Arthur has contacted the Chase Bank security division, but Chase reported the receiving account was emptied via international cash wires to Eastern Europe immediately after arrival.`
  }
];
