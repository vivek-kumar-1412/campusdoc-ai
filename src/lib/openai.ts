/**
 * OpenRouter AI Service Layer for CampusDoc AI
 *
 * Uses OpenRouter's free-tier models for AI-powered features:
 * chat, document generation, grammar correction, legal analysis,
 * and summarization.
 */

const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const API_KEY = "sk-b728619c50834ac78090fb35ae2f78f2";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * The system prompt that gives the AI full context about CampusDoc AI.
 */
export const SYSTEM_PROMPT = `You are DocuGen AI Assistant — an expert AI embedded within the CampusDoc AI platform, a document automation tool designed for Indian startups, incubation centers, and academic institutions.

Your Capabilities:
1. **Document Generation**: You can help create professional legal documents including:
   - Memorandum of Understanding (MoU)
   - Invoices (with GST calculations)
   - Work Orders
   - Purchase Orders
   You know Indian legal standards and ensure all generated documents include proper clauses.

2. **Grammar & Language Correction**: When a user shares text, you:
   - Fix all grammatical, spelling, and punctuation errors
   - Improve sentence structure and clarity
   - Maintain the original meaning and legal intent
   - Show changes clearly with "Original → Corrected" format

3. **Legal Analysis**: When reviewing documents, you check for these commonly missing clauses:
   - Indemnification clause
   - Termination / Exit clause
   - Force Majeure clause
   - Jurisdiction & Governing Law (Indian law)
   - Intellectual Property (IP) Rights
   - Dispute Resolution / Arbitration
   - Confidentiality / Non-Disclosure
   - Limitation of Liability
   - Payment Terms & Penalties
   - Amendment / Modification procedures
   - Notices & Communication
   - Representations & Warranties

4. **Document Summarization**: When summarizing, you provide:
   - **Key Parties** involved
   - **Purpose** of the document (1-2 lines)
   - **Key Terms & Obligations** (bullet points)
   - **Financial Details** (amounts, payment schedules)
   - **Timeline & Duration**
   - **Critical Clauses** present/missing
   - **Risk Assessment** (Low / Medium / High)

5. **Platform Guidance**: You know the CampusDoc AI platform features:
   - Dashboard with document statistics
   - Create Document page (AI-powered generation)
   - My Documents (browse, edit, manage)
   - Templates (upload and use custom templates)
   - History (document version tracking)

Tone: Professional yet friendly. Use markdown formatting (bold, bullet points, headers) for well-structured responses. Always be helpful and thorough.

When generating documents, use Indian legal conventions (₹ for currency, Indian contract law references, GST compliance).`;

/**
 * Send a conversation to OpenRouter and get a response.
 * Uses the OpenAI-compatible API format.
 */
export async function chatWithAI(
  messages: ChatMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<string> {
  const apiKey = API_KEY;

  const allMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.error?.message ||
      `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data: OpenRouterResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("No response received from AI.");
  }

  return data.choices[0].message.content;
}

/**
 * Analyze a document for grammar issues, missing legal clauses,
 * and generate a structured summary.
 */
export async function analyzeDocument(content: string): Promise<string> {
  const analysisPrompt = `Please analyze the following document comprehensively. Provide your analysis in this EXACT format:

## 📝 Document Summary
Provide a concise summary of the document (3-5 sentences).

## ✅ Grammar & Language Review
List any grammatical errors, spelling mistakes, or unclear phrasing found. Show each as:
- **Original:** "..."  →  **Corrected:** "..."

If no issues found, state "No grammatical issues detected."

## ⚖️ Legal Completeness Analysis
Review the document against essential legal clauses. For each, indicate:
- ✅ **Present**: [clause name] — brief note
- ❌ **Missing**: [clause name] — why it matters

Essential clauses to check: Indemnification, Termination, Force Majeure, Jurisdiction, IP Rights, Dispute Resolution, Confidentiality, Limitation of Liability, Payment Terms, Amendment Procedures, Notices, Warranties.

## 📊 Risk Assessment
- **Overall Risk Level**: Low / Medium / High
- **Key Risks**: bullet points of main concerns

## 💡 Recommendations
Numbered list of specific improvements to strengthen this document.

---
Here is the document to analyze:

${content}`;

  return chatWithAI([{ role: "user", content: analysisPrompt }]);
}

/**
 * Generate a complete legal document using AI.
 */
export async function generateDocumentWithAI(
  type: string,
  details: {
    startupName: string;
    projectDetails: string;
    partiesInvolved: string;
    date: string;
    amount?: string;
  }
): Promise<string> {
  const typeLabels: Record<string, string> = {
    mou: "Memorandum of Understanding (MoU)",
    invoice: "Invoice",
    "work-order": "Work Order",
    "purchase-order": "Purchase Order",
  };

  const docTypeLabel = typeLabels[type] || type;

  const generationPrompt = `Generate a complete, professionally formatted **${docTypeLabel}** with the following details:

- **Startup / Company Name**: ${details.startupName}
- **Other Parties Involved**: ${details.partiesInvolved}
- **Project Details**: ${details.projectDetails}
- **Date**: ${details.date}
${details.amount ? `- **Amount**: ₹${details.amount}` : ""}

Requirements:
1. Use proper Indian legal conventions and terminology
2. Include ALL essential legal clauses (indemnification, termination, force majeure, jurisdiction, IP rights, dispute resolution, confidentiality, etc.)
3. Include GST calculations where applicable
4. Use professional formatting with numbered sections
5. Include signature blocks for all parties
6. Make it legally comprehensive and ready to use

Generate the complete document text:`;

  return chatWithAI([{ role: "user", content: generationPrompt }]);
}
