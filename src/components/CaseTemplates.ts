import { CaseCategory, CaseStatus } from "../types";

export interface CaseTemplate {
  title: string;
  incidentType: string;
  category: CaseCategory | string;
  status: CaseStatus;
  completedAt?: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  assignedOfficer: string;
  badgeNumber: string;
  location: string;
  date: string;
  rawNotes: string;
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    title: "State Data Center Ransomware & Crypto Extortion",
    incidentType: "Cyber Terrorism & Ransomware Extortion",
    category: "Cyber Crime",
    status: "pending",
    priority: "Critical",
    assignedOfficer: "Det. Priya Patel",
    badgeNumber: "AHM-2024-CF-102",
    location: "Gujarat State Data Center (GSDC), Infocity, Gandhinagar 382007",
    date: "2026-08-12 at 04:15 AM",
    rawNotes: `CYBER CRIME INCIDENT REPORT - EMERGENCY DISPATCH #CYB-2026-8841
INVESTIGATING OFFICER: Det. Priya Patel (Cyber Forensics & Digital Evidence Lead)
LOCATION: Gujarat State Data Center, Server Cluster Node 4, Gandhinagar.

INCIDENT OVERVIEW:
On August 12, 2026, at 04:15 AM, automated intrusion alarms triggered across 14 municipal and administrative database servers. Lead System Architect reported master storage volumes encrypted with the extension '.lockbit3_gjgov'. All database operations abruptly halted.

FORENSIC ARTIFACTS & INTRUSION VECTOR:
1. Entry Vector: Compromised VPN credentials of external maintenance contractor (VPN Gateway IP: 185.220.101.5 via Tor exit relay).
2. Privilege Escalation: Lateral movement via PsExec and Active Directory exploitation (CVE-2024-38077).
3. Encryption Binary: Memory dump recovered 'svchost_update.exe' (MD5: 8f3c7a91b2e4d5671a008c2d11ef3b49), identified as custom compiled LockBit 3.0 Linux/Windows cross-compiled ransomware payload.
4. Ransom Demand: Digital ransom note 'RESTORE_FILES.txt' demanding 45 BTC (approx. ₹22.5 Crores) to Bitcoin address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh. Threat actors threaten to publish 1.8 TB of citizen registry and tax records on their darknet Tor leak portal within 72 hours.
5. Volatile Memory Dump: Preserved RAM image (128 GB) on write-blocked drive for rootkit and C2 server IP extraction. Memory reveals active websocket beacons to command IP: 194.26.29.112 (hosted in bulletproof offshore datacenter).

ACTION TAKEN:
- Isolated infected subnet VLAN-40 from state WAN to prevent lateral infection.
- Issued statutory notices under IT Act Section 43/66/66F (Cyber Terrorism) and Section 385/386 IPC/BNS for extortion.
- Coordinated with Indian Computer Emergency Response Team (CERT-In) and Interpol Cybercrime Directorate.`
  },
  {
    title: "SIM Swap & Multi-Bank UPI Cyber Heist",
    incidentType: "Cyber Financial Fraud & SIM Hijacking",
    category: "Cyber Crime",
    status: "pending",
    priority: "High",
    assignedOfficer: "Inspector R.K. Jadeja",
    badgeNumber: "AHM-2024-IO-047",
    location: "Cyber Crime Police Station, Old High Court Complex, Navrangpura, Ahmedabad",
    date: "2026-08-11 at 11:30 AM",
    rawNotes: `CYBER CRIME FIRST INFORMATION TRANSCRIPT
COMPLAINANT: Rajesh K. Agrawal, Managing Director of Gujarat Agrotech Ltd.
OFFICER: Inspector R.K. Jadeja, Cyber Crime PS Ahmedabad.

CHRONOLOGY OF FRAUD:
1. On August 10, 2026, at 22:00 PM, complainant observed sudden cellular network deactivation on primary registered mobile (+91 98250 XXXXX). Cellular service provider automated SMS indicated an 'e-SIM activation request approved on iPhone 15 device (IMEI: 358941092837461)'.
2. Complainant did NOT request eSIM transfer. Between 23:30 PM and 04:00 AM, the syndicate logged into complainant's net banking across 3 major banks (ICICI, HDFC, SBI) using intercept 2FA OTPs.
3. Total Unauthorized Withdrawals: ₹1,45,00,000 (₹1.45 Crores) routed through 38 distinct UPI mule accounts across Gujarat, Rajasthan, and Jharkhand in increments of ₹95,000 to evade automated AML triggers.

TECHNICAL FORENSIC TRAIL:
- The fraudulent eSIM swap was sanctioned at a rogue telecom franchise outlet in Surat using a forged physical Aadhaar card photocopy bearing victim's name but suspect's photograph.
- IP Login Logs: All banking sessions originated from proxy IP 103.145.74.22 (ISP: AS133612) using fingerprint spoofing browser.
- Mule Account Analysis: Funds swiftly aggregated into primary receiver account 'Kisan Traders' at Jamtara branch, where ₹80,00,000 was converted to USDT via P2P crypto exchanges.

EVIDENCE COLLECTED:
- Telecom KYC logs, forged Aadhaar photocopy, CCTV footage of franchise counter.
- Banking IP header logs, transaction UTR numbers, and frozen mule account statements.
- Emergency freeze orders dispatched under Section 91 CrPC / Section 94 BNSS to freezing 14 mule accounts with balance of ₹42,50,000.`
  },
  {
    title: "Deepfake Executive Impersonation & Wire Extortion",
    incidentType: "AI Deepfake Fraud & Corporate Extortion",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-08T16:45:00Z",
    priority: "High",
    assignedOfficer: "Det. Priya Patel",
    badgeNumber: "AHM-2024-CF-102",
    location: "Fintech Hub, SG Highway, Bodakdev, Ahmedabad 380054",
    date: "2026-08-05 at 15:20 PM",
    rawNotes: `INVESTIGATION COMPLETION DOSSIER - GUJARAT POLICE CYBER CRIME CELL
CASE STATUS: RESOLVED / OFFENDERS INTERCEPTED / ₹2.8 CRORES RECOVERED

INCIDENT DETAILS:
On August 5, 2026, Chief Financial Officer of Nexus Finserve received an urgent Microsoft Teams video conference invite appearing to be from the company's UK-based Chairman, Sir Arthur Sterling. The video feed displayed real-time facial expressions, synced lip movements, and exact vocal cadence of the Chairman instructing an immediate confidential acquisition wire transfer of ₹2,80,00,000 to an escrow account in GIFT City IFSC.

FORENSIC DISCOVERY & RESOLUTION:
1. Forensic Video Analysis: Frame-by-frame deepfake audio-visual spectrum inspection by Cyber Cell revealed subtle facial boundary artifacting (0.04s latency jitter), synthesized neural speech clone generated using 3-minute public YouTube interview audio.
2. The transfer was executed via RTGS. Within 45 minutes of the alert, Ahmedabad Cyber Cell invoked the 1930 Citizen Financial Cyber Fraud reporting emergency portal and coordinate with RBI nodal desk.
3. Rapid Interception: Beneficiary account in GIFT City bank frozen before withdrawal. Entire amount of ₹2,80,00,000 secured and reversed to corporate treasury.
4. Three conspirators operating a tech shell firm in Ahmedabad arrested with 12 laptops, voice cloning software suites, and international VoIP SIM boxes.

CHARGES FILED: IT Act Sec 66C, 66D, Bharatiya Nyaya Sanhita (BNS) Sec 318(4) (Cheating) & Sec 336(3) (Forgery). Case successfully closed and charge sheet submitted to Cyber Special Court.`
  },
  {
    title: "AePS Biometric Spoofing & Micro-ATM Cyber Ring",
    incidentType: "Biometric Identity Theft & AePS Cyber Fraud",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-04T12:15:00Z",
    priority: "Critical",
    assignedOfficer: "Inspector R.K. Jadeja",
    badgeNumber: "AHM-2024-IO-047",
    location: "Nikol & Bapunagar Micro-ATM Kiosks, East Ahmedabad",
    date: "2026-08-01 at 09:00 AM",
    rawNotes: `CASE RESOLUTION SUMMARY - AEPS BIOMETRIC CLONING BUST
INVESTIGATING OFFICER: Inspector R.K. Jadeja (Badge #AHM-2024-IO-047)
STATUS: COMPLETED THIS MONTH // SYNDICATE DISMANTLED

OVERVIEW:
Over 60 rural and elderly victims filed complaints stating unauthorized cash debits from Aadhaar-linked bank accounts without OTPs or card usage. Investigation revealed a sophisticated Aadhaar Enabled Payment System (AePS) exploitation ring.

MODUS OPERANDI:
- Suspects downloaded public land registry property sale deeds (which contained unredacted fingerprints and Aadhaar numbers).
- Using polymer silicone molds and 3D printing, the syndicate fabricated artificial biometric silicone thumbs coated with conductive gel.
- The cloned fingerprints were used at rogue Micro-ATM Customer Service Points (CSPs) across Ahmedabad East to siphon daily withdrawal limits of ₹10,000 per victim.

SEIZURES & ARRESTS:
- 1,240 polymer silicone cloned fingerprints with victim Aadhaar labels.
- 6 biometric optical fingerprint scanner devices, 18 micro-ATM POS units, and ₹14,80,000 in cash.
- Mastermind cyber operator (Anand V.) and 4 accomplices arrested and booked under IT Act Section 66, 66C, 66D and BNS Section 318, 338. Full recovery completed this month.`
  },
  {
    title: "Prahlad Nagar Elder Financial Cyber Scam & Digital Arrest",
    incidentType: "Digital Arrest & Cyber Extortion",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-09T18:00:00Z",
    priority: "High",
    assignedOfficer: "Adv. Vikram Mehta",
    badgeNumber: "GJ-PROS-882",
    location: "847 Corporate Road, Prahlad Nagar, Ahmedabad, Gujarat 380015",
    date: "2026-08-06 at 14:00 PM",
    rawNotes: `CASE RESOLUTION & PROSECUTORIAL DOSSIER - DIGITAL ARREST SYNDICATE
OFFICER: Adv. Vikram Mehta, Special Cyber Public Prosecutor
STATUS: COMPLETED THIS MONTH // CHARGE SHEET SUBMITTED

SUMMARY:
Victim Margaret Pendelton (Age 82) was subjected to 72 hours of continuous Skype video surveillance by imposters posing as 'CBI Cyber Division Officers'. Imposters showed fabricated arrest warrants bearing fake Supreme Court seals and forced victim into transferring ₹1,30,00,000 (₹1.3 Crores) to 'Government Safe Vault Escrow'.

INTERCEPTION & RESOLUTION:
- Cyber Cell tracked VoIP IP hops to a call center hub operating out of Gurgaon.
- In a joint inter-state raid, 8 cyber scammers were apprehended. 
- Bank accounts containing ₹1,12,00,000 frozen and refunded to victim under court restitution order.
- Comprehensive forensic timeline, digital call logs, and counterfeit warrant documents submitted for fast-track trial.`
  },
  {
    title: "GIFT City Tech Park Commercial Burglary & Cyber Theft",
    incidentType: "Commercial Burglary & Source Code Cyber Theft",
    category: "Commercial Burglary",
    status: "pending",
    priority: "Critical",
    assignedOfficer: "Inspector R.K. Jadeja",
    badgeNumber: "AHM-2024-IO-047",
    location: "Tower 28B, GIFT City, Gandhinagar - Ahmedabad Highway, Gujarat 382355",
    date: "2026-08-13 at 03:14 AM",
    rawNotes: `On August 13, 2026, at approximately 0730 hours, responded to Apex Cybertech offices in GIFT City regarding a reported commercial burglary and source code data theft.
Point of Entry (POE): Rear glass door shattered with concrete paver. Fabric sample snagged on window frame.
STOLEN INTEL:
1. 3x High-performance Workstations (Serials: MP9481, MP2045, MP0491) containing proprietary algorithmic trading code.
2. Hardware Ledger containing cryptographic API keys.
Suspect Mark Vane (ex-contractor terminated last week) spotted on CCTV fleeing at 03:14 AM in a dark sedan towards SG Highway. Latent fingerprints recovered from desk B3. Forensics lab analyzing digital access logs.`
  },
  {
    title: "Darknet Police Phishing Portal & Credential Harvester",
    incidentType: "Phishing Infrastructure & Citizen Data Harvesting",
    category: "Cyber Crime",
    status: "pending",
    priority: "High",
    assignedOfficer: "Det. Priya Patel",
    badgeNumber: "AHM-2024-CF-102",
    location: "Ahmedabad Cyber Forensic Lab, Gujarat 380009",
    date: "2026-08-14 at 01:20 AM",
    rawNotes: `CYBER THREAT INTELLIGENCE MEMO - AHMEDABAD CYBER CELL
TARGET: Counterfeit citizen services website 'gujaratpolice-efir-portal.org' (IP: 91.215.85.14).

TECHNICAL FINDINGS:
1. Threat actors deployed a deceptive replica of the official Gujarat Police e-FIR and Character Verification portal.
2. Citizens registering traffic complaints or police verification certificates were prompted to pay a ₹50 processing fee through a weaponized credential-harvesting payment gateway.
3. The malicious script intercepted net-banking passwords, UPI PINs, and debit card CVV data in cleartext before redirecting to an error page.
4. Over 1,200 citizen credentials recorded in threat actor's unencrypted Redis database backend.

CURRENT STATUS:
- Coordinated emergency domain takedown via Indian Nodal Registrar and Cloudflare abuse desk.
- Traced backend reverse proxy to server in Eastern Europe; ISP subpoenas served. Pending physical arrest of local money-mule handlers in Ahmedabad.`
  },
  {
    title: "SG Highway Vehicle Interception & Seizure",
    incidentType: "Possession & Illegal Contraband Transport",
    category: "Narcotics & Contraband",
    status: "completed",
    completedAt: "2026-08-03T22:30:00Z",
    priority: "Medium",
    assignedOfficer: "Inspector R.K. Jadeja",
    badgeNumber: "AHM-2024-IO-047",
    location: "S.G. Highway (Near ISKCON Flyover), Satellite, Ahmedabad",
    date: "2026-08-02 at 23:45 PM",
    rawNotes: `Inspector R.K. Jadeja reports that on August 2, 2026, at 2345 hours, while on mobile patrol on S.G. Highway, intercepted silver Hyundai Creta (GJ-01-XX-9482) speeding at 95 km/h.
Driver David Miller detained. Search revealed 2.1 kg contraband in rear duffel bag, ₹4,20,000 unaccounted cash, and loaded 9mm semi-automatic pistol under seat (Serial: T94827-C).
Forensic ballistic tests matched weapon. Accused remanded to judicial custody and formal charge sheet submitted this month.`
  },
  {
    title: "AlphaFX Crypto Pig-Butchering & Boiler Room Bust",
    incidentType: "Cryptocurrency Investment Fraud & Cyber Syndicate",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-10T14:20:00Z",
    priority: "Critical",
    assignedOfficer: "Det. Priya Patel",
    badgeNumber: "AHM-2024-CF-102",
    location: "Iscon Elegance Commercial Complex, SG Highway, Ahmedabad 380051",
    date: "2026-08-07 at 10:15 AM",
    rawNotes: `SOLVED CASE DOSSIER - OPERATION CRYPTO-HOOK
INVESTIGATING OFFICER: Det. Priya Patel (Cyber Forensics)
STATUS: SOLVED & CLOSED // 6 ARRESTED // ₹4.5 CRORES SEIZED

SYNDICATE SUMMARY:
Threat actors operated a fake high-yield crypto arbitrage exchange 'AlphaFX-Global.io', baiting victims through curated social media personas ('Pig-Butchering' romance-investment scam). Once victims deposited initial funds, falsified web dashboards showed 300% simulated profits before demanding high 'liquidity release fees' to withdraw.

FORENSIC CRACKDOWN:
1. Ahmedabad Cyber Cell tracked on-chain transaction flows across Tron (TRC-20) and Ethereum networks using Graph Blockchain Analytics.
2. Discovered 14 cold wallets consolidating funds into an offshore OTC desk.
3. Coordinated multi-point raid on an unauthorized call-center boiler room in SG Highway, Ahmedabad.
4. Seized 45 smartphones, 18 high-end laptops, 120 burner SIM cards, and secured freeze orders on ₹4,50,00,000 (₹4.5 Crores) across 18 mule bank accounts.
5. All 6 key conspirators arrested under IT Act Sec 66C/66D and BNS Sec 316/318. Case solved and forwarded for expedited judicial trial.`
  },
  {
    title: "Sterling Hospital ICU Ransomware Neutralization",
    incidentType: "Healthcare Cyber Sabotage & Ransomware Decryption",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-06T08:30:00Z",
    priority: "Critical",
    assignedOfficer: "Inspector R.K. Jadeja",
    badgeNumber: "AHM-2024-IO-047",
    location: "Sterling Multi-Speciality Hospital, Drive-In Road, Ahmedabad 380052",
    date: "2026-08-04 at 02:00 AM",
    rawNotes: `SOLVED EMERGENCY DISPATCH - HEALTHCARE CYBER DEFENSE
OFFICER: Inspector R.K. Jadeja & Gujarat Cyber Forensics Emergency Response Team (CERT-GJ)
STATUS: SOLVED & SYSTEM RESTORED // ZERO RANSOM PAID

CASE CHRONOLOGY:
1. At 02:00 AM, hospital IT director reported sudden encryption of Radiology PACS imaging servers and ICU ventilator monitoring telemetry database with extension '.phobos_medlock'.
2. Attackers left ransom note demanding 25 BTC ($1.5M) threatening patient record destruction within 12 hours.

TACTICAL FORENSIC INTERVENTION:
- Cyber Cell isolated infected hypervisor clusters to preserve raw volatile memory (RAM).
- Forensic engineers identified an uninitialized buffer flaw in the ransomware binary payload in memory dump.
- Reverse-engineered symmetric master decryption key from kernel memory cache without communicating with threat actors.
- 100% of medical and patient telemetry systems safely restored within 6 hours without hospital downtime or ransom payment.
- Attack vector traced to brute-forced RDP port on third-party HVAC telemetry controller. Vulnerability patched across all Gujarat state medical networks.`
  },
  {
    title: "AI Tatkal e-Ticketing Bot Syndicate Dismantled",
    incidentType: "Algorithmic Ticket Scalping & Black Market Cyber Ring",
    category: "Cyber Crime",
    status: "completed",
    completedAt: "2026-08-11T19:15:00Z",
    priority: "Medium",
    assignedOfficer: "Det. Priya Patel",
    badgeNumber: "AHM-2024-CF-102",
    location: "Kalupur Railway Hub & East Ahmedabad Suburbs, Gujarat",
    date: "2026-08-09 at 11:00 AM",
    rawNotes: `SOLVED CASE SUMMARY - OPERATION TATKAL-SHIELD
STATUS: COMPLETED & CHARGED // RING MASTERMIND CONVICTED

DETAILS:
A rogue software ring developed an illicit automation bot suite 'SuperTatkal-Pro' that weaponized deep-learning OCR algorithms to bypass IRCTC visual and mathematical CAPTCHAs in 0.08 seconds, cornering premium train quotas across Gujarat routes within milliseconds of window opening.

INVESTIGATION RESULTS:
- Cyber Cell analyzed browser telemetry and payment gateway transactions, mapping 3,400 bot subscriptions across the state.
- Mastermind software architect apprehended in Maninagar along with source code repository on GitHub private enterprise.
- Seized ₹72,00,000 in illicit commission proceeds and cancelled 1,400 scalped railway tickets, returning them to genuine citizen queue.
- Charges sustained under IT Act Section 43/66 and Railways Act Section 143.`
  },
  {
    title: "Diamond Bourse Hawala & Shell Invoice Fraud",
    incidentType: "Financial Hawala & Input Tax Credit Cyber Fraud",
    category: "Financial Fraud",
    status: "completed",
    completedAt: "2026-08-07T17:00:00Z",
    priority: "High",
    assignedOfficer: "Adv. Vikram Mehta",
    badgeNumber: "GJ-PROS-882",
    location: "Diamond District, Ashram Road & Navrangpura, Ahmedabad",
    date: "2026-08-03 at 16:30 PM",
    rawNotes: `SOLVED PROSECUTORIAL DOSSIER - FINANCIAL CRIME SQUAD
OFFICER: Adv. Vikram Mehta, Special Public Prosecutor
STATUS: SOLVED THIS MONTH // ASSETS RECOVERED // COMPREHENSIVE CHARGESHEET

INVESTIGATION FINDINGS:
1. Intercepted a multi-tier network of 14 dummy front companies generating ₹48 Crores in fictitious diamond polishing and trade invoices to illicitly claim Input Tax Credit (ITC).
2. Cyber financial team correlated digital signature certificates (DSC tokens) with shared MAC addresses and IP routing histories across 3 chartered accountancy offices.
3. Seized ₹3,20,00,000 in unaccounted cash, 24 digital signature hard tokens, and frozen shell accounts totaling ₹12.8 Crores.
4. 4 principal operators remanded to judicial custody; formal statutory report submitted to the Special Economic Offences Court.`
  }
];

