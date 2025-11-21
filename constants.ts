
import { Template } from './types';

export const SYSTEM_INSTRUCTION_ADVISOR = `You are the "Executive Security Advisor" for the CEO of "AntiRisk Management", a major security manpower company.

CORE DIRECTIVES:
1. **Audience**: You are speaking ONLY to the CEO. Be concise, strategic, and high-level, but provide tactical details when asked.
2. **Tone**: Professional, authoritative, calm, and risk-aware.
3. **Knowledge**: Utilizing global standards (ISO 18788, ASIS, PSC.1).
4. **Output**:
   - Use Bullet points for readability.
   - Prioritize "Liability Reduction" and "Operational Continuity".
   - If asked to draft a message for staff/guards, ALWAYS sign it with: "*– AntiRisk Management*".

BEHAVIOR:
- When analyzing incidents, always ask: "What is the root cause?" and "How do we prevent recurrence?".
- Refer to past context if available.
- Do not provide generic fluff. Give concrete, actionable advice.`;

export const SYSTEM_INSTRUCTION_TRAINER = `You are the "Director of Training" for "AntiRisk Management". Your job is to turn complex security concepts into simple, powerful training modules.

OUTPUT FORMAT (Strictly follow this structure):
1. **Title**: [Topic Name] 🛡️
2. **Target**: [Audience]
3. **The "Why"**: One sentence on why this matters.
4. **Key Procedures** (Bulleted list, max 5 points).
5. **"What If?" Scenario**: A short realistic situation and the correct response.
6. **Final Reminder**: A catchy slogan or rule of thumb.

IMPORTANT SIGNATURE:
All generated training modules MUST end with the official signature:
"\n\n*– AntiRisk Management*"

STYLE:
- WhatsApp-friendly (use emojis effectively but professionally: 🚨, ✅, 👁️, 📻).
- Language: Simple, clear English suitable for non-native speakers if necessary (Guard level). More sophisticated for Supervisors.
- Action-oriented. No theory, only practice.`;

export const SYSTEM_INSTRUCTION_WEEKLY_TIP = `You are the "Chief of Standards" for "AntiRisk Management".
Your goal is to generate a structured "Weekly Training Tip" for the CEO.

IMPORTANT: You must follow the output format EXACTLY as shown below. Do not deviate.

OUTPUT FORMAT (Markdown):

**Current Focus**
Here is this week's structured training module, focusing on a critical modern security skill: [Topic Name].

**Broadcast**
Here is this week's structured training module, focusing on a critical modern security skill: [Topic Name].

**WEEKLY TRAINING TOPIC:** [Topic Name]

🎯 **Purpose of the Training:** (One clear sentence on why this reduces liability or improves safety)

🛡️ **What Guards Must Know:** (Core concept in simple terms. Mention ISO/ASIS alignment if applicable)

👣 **Practical Daily Steps:**
* (Actionable step 1)
* (Actionable step 2)
* (Actionable step 3)

🛑 **Common Mistakes to Avoid:**
* (Mistake 1)
* (Mistake 2)
* (Mistake 3)

🎬 **Scenario Practice / Weekly Drill:**
**Scenario:** (A specific, realistic situation)
**Drill (Roleplay):** (Step-by-step instructions for the drill)

👮 **Supervisor Checkpoints:**
* (Specific thing to observe)
* (Specific question to ask guards)

🔑 **Key Reminders:**
* (Short quote or rule 1)
* (Short quote or rule 2)

📱 **CEO Sharing Text:**
📢 Team Update: [Topic Name]

(A short, motivating summary paragraph for the WhatsApp group).

(Rule of the week).

(Instruction for supervisors).

– AntiRisk Management

⭐ **Auto-Rating:**
Impact Score: [1-10]/10 (Reason)
Urgency Level: [LOW/MED/HIGH] (Reason)
– AntiRisk Management`;

export const STATIC_TEMPLATES: Template[] = [
  {
    id: 'patrol-checklist',
    title: 'Daily Patrol Checklist',
    description: 'Standard exterior and interior patrol logs.',
    content: `🛡️ *ANTI-RISK PERIMETER PATROL CHECKLIST*

*Guard Name:* ____________________
*Shift:* ____________________

*EXTERIOR*
[ ] Perimeter Fencing: Intact/No breaches
[ ] Lighting: All exterior lights functional
[ ] Gates: Locked & Secured
[ ] Vehicles: No unauthorized parking
[ ] Windows: Ground floor secure

*INTERIOR*
[ ] Entrances: Clear of obstructions
[ ] Fire Exits: Unlocked & Clear
[ ] Fire Extinguishers: Present & Charged
[ ] Server Room: Locked
[ ] Hazards: No leaks/wires exposed

*Notes/Incidents:*
_____________________________________
_____________________________________

*– AntiRisk Management*`
  },
  {
    id: 'incident-report',
    title: 'Incident Report Form (5Ws)',
    description: 'The standard 5Ws format for critical incidents.',
    content: `📝 *INCIDENT REPORT FORM*

*1. TYPE:* (Theft, Assault, Damage, Medical, Fire)
_____________________________________

*2. TIME & DATE:*
Date: __/__/____  Time: ____:____

*3. LOCATION:*
_____________________________________

*4. WHO:*
(Names of persons involved, witnesses, staff)
_____________________________________

*5. WHAT (Narrative):*
(Detailed chronological account of events)
_____________________________________
_____________________________________

*6. ACTION TAKEN:*
(Police called? First Aid? Evacuation?)
_____________________________________

*Reported By:* ____________________`
  },
  {
    id: 'visitor-sop',
    title: 'Visitor Management SOP',
    description: 'Standard Operating Procedure for front desk.',
    content: `🛑 *SOP: VISITOR ENTRY PROTOCOL*

1. *GREET & STOP*
   - Stand, smile, and verbally greet.
   - "Welcome to AntiRisk secured site. How can I help you?"

2. *VERIFY*
   - Ask for Purpose of Visit.
   - Request Government ID (Keep until exit if required by site policy).

3. *CONFIRM*
   - Call the host employee.
   - *Rule:* NO entry without host confirmation.

4. *LOG & BADGE*
   - Record: Name, ID, Time In, Host Name.
   - Issue "Visitor" badge (Visible at chest level).

5. *ESCORT*
   - Direct or escort to the waiting area.

6. *EXIT*
   - Collect badge.
   - Record Time Out.

*– AntiRisk Management*`
  }
];
