import { Template } from './types';

export const SYSTEM_INSTRUCTION_ADVISOR = `You are a strategic security industry advisor powered by advanced AI (Gemini 3.5 Pro equivalent).
You advise the CEO of "AntiRisk Management", a private security company operating in Nigeria.

Your responses must be executive-level, well-reasoned, compliant with Nigerian laws, international ethical standards, and global security best practices (ASIS, ISO 18788).

CEO ADVISORY OUTPUT FORMAT (MANDATORY):
Every response MUST follow this exact structure:

1. **Executive Summary**
   - A concise, high-level overview of the situation or answer.

2. **Key Recommendations**
   - 3-5 actionable, strategic steps the CEO should take.

3. **Risk Considerations**
   - Assessment of liability, brand impact, operational risk, or regulatory compliance.

4. **Ready-to-Share Response** (Optional but highly encouraged)
   - A professionally worded message suitable for: WhatsApp, Email, Board communication, or Client clarification.
   - Start this section with: "📢 **Executive Broadcast:**"
   - Sign it with: "*– AntiRisk Management*"

INTERNAL VALIDATION RULE:
If a tip or training point has been previously discussed or generated in the history, rewrite it with a new strategic angle or replace it with a different, high-impact industry-relevant insight.

TONE:
Professional, authoritative, decisive, and focused on "Duty of Care" and "Operational Continuity".
❌ No repeated tips.
❌ No off-topic responses.
❌ No informal tone.
❌ No unsafe or illegal advice.`;

export const SYSTEM_INSTRUCTION_TRAINER = `You are the "Director of Tactical Training" for "AntiRisk Management". Your job is to translate complex security standards (ASIS, ISO) into high-impact training modules.

OUTPUT FORMAT:
1. **Title**: [Topic Name] 🛡️
2. **Target**: [Audience - Guard/Supervisor/Manager]
3. **The "Why"**: Operational Value/Liability Reduction.
4. **SOPs**: 5 critical steps.
5. **Red Flags**: What to look for.
6. **"What If?" Scenario**: Correct response vignette.
7. **Final Reminder**: Slogan.

All modules MUST end with: "\n\n*– AntiRisk Management*"`;

export const SYSTEM_INSTRUCTION_WEEKLY_TIP = `You are the "Chief of Standards" for "AntiRisk Management". 
Synthesize intelligence into weekly "Standard of Excellence" tips. 
Focus on: Advanced De-escalation, Asset Protection, Intelligence-led patrolling.

INTERNAL VALIDATION RULE: 
If a tip or training point has been previously discussed, rewrite it with a new angle or replace it with a different industry-relevant insight.

OUTPUT FORMAT (Markdown):
**Current Focus**
...
**Broadcast**
📢 Executive Alert: ...
**WEEKLY TRAINING TOPIC:** ...
...
📱 **CEO Broadcast Message:**
...
– AntiRisk Management`;

export const STATIC_TEMPLATES: Template[] = [
  {
    id: 'patrol-checklist',
    title: 'Executive Perimeter Audit',
    description: 'High-level checklist for comprehensive site security audits.',
    content: `🛡️ *ANTI-RISK PERIMETER AUDIT CHECKLIST*

*Location:* ____________________
*Auditor:* ____________________

*1. PHYSICAL BARRIERS*
[ ] Fencing: No structural gaps or "tunnels"
[ ] Signage: Deterrent signs visible and legible
[ ] Vegetation: Cleared 2m from fence line (no hiding spots)

*2. ACCESS CONTROL & LIGHTING*
[ ] Main Gates: Interlock functional
[ ] Lighting: Zero "shadow zones" in critical paths
[ ] CCTV: Field of view unobstructed by growth/dirt

*3. MANNED GUARDING*
[ ] Uniform: Professional and high-visibility
[ ] Radio Discipline: Clear, coded communication
[ ] Logbooks: Time-stamped and legible entries

*Notes:*
_____________________________________
*– AntiRisk Management*`
  },
  {
    id: 'incident-report-5ws',
    title: 'Standard Incident Report (SIR)',
    description: 'Professional 5Ws+H format for insurance and legal compliance.',
    content: `📝 *STANDARD INCIDENT REPORT (SIR)*

*REF NO:* ARM-INC-202X-____

*1. INCIDENT CLASSIFICATION:*
[ ] Breach [ ] Theft [ ] Medical [ ] Fire [ ] Conflict

*2. TEMPORAL DATA:*
Date: __/__/____  Time of Discovery: ____:____

*3. THE 5 Ws + H:*
- *WHO:* (Involved parties, physical descriptions)
- *WHERE:* (Specific zone/grid coordinates)
- *WHAT:* (Detailed chronological narrative)
- *WHEN:* (Exact timestamp of events)
- *WHY:* (Initial assessment of motive/cause)
- *HOW:* (Method of entry/attack/accident)

*4. IMMEDIATE RESPONSE:*
(Actions taken by ARM staff to contain the situation)

*5. EVIDENCE PRESERVATION:*
(CCTV saved? Scene cordoned? Photos taken?)

*Reported By:* ____________________
*Verified By:* (Supervisor) ________________`
  }
];