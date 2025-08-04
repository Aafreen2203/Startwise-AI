interface FlowiseRequest {
  startup_idea: string;
  industry?: string;
  target_audience?: string;
  uploaded_file?: File;
}

interface FlowiseResponse {
  text?: string;
  message?: string;
  error?: string;
  json?: any;
  data?: any;
}

const FLOWISE_API_URL =
  "http://localhost:3000/api/v1/prediction/ef70d4dd-adea-47c3-9e1c-217214805adc";

export class FlowiseService {
  static async generatePitchDeck(request: FlowiseRequest): Promise<string> {
    try {
      // Format the question/prompt for the AI agent
      const prompt = this.formatPrompt(request);

      // Prepare the request payload
      const payload = {
        question: prompt,
        uploads: request.uploaded_file
          ? [await this.fileToBase64(request.uploaded_file)]
          : undefined,
      };

      const response = await fetch(FLOWISE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FlowiseResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Extract the actual content, filtering out thinking processes
      let content =
        data.text || data.message || data.data || "No content generated";

      // If content is an object, try to extract the text
      if (typeof content === "object") {
        content = JSON.stringify(content, null, 2);
      }

      // Clean up the response by removing thinking processes and meta information
      content = this.cleanResponse(content);

      return content;
    } catch (error) {
      console.error("Flowise API Error:", error);

      // Return a fallback response if the API is not available
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        return this.getFallbackResponse(request);
      }

      throw error;
    }
  }

  private static formatPrompt(request: FlowiseRequest): string {
    let prompt = `Create a comprehensive investor-ready pitch deck for the following startup idea. Please structure the response with clear sections covering all 10 essential elements:

**Startup Idea:** ${request.startup_idea}`;

    if (request.industry) {
      prompt += `\n**Industry:** ${request.industry}`;
    }

    if (request.target_audience) {
      prompt += `\n**Target Audience:** ${request.target_audience}`;
    }

    prompt += `

Please provide a detailed pitch deck covering these 10 sections. Format each section clearly with the section name as a header:

1. **Problem** - What problem does this startup solve? Include market pain points and customer frustrations.

2. **Solution** - How does the startup solve this problem? What's unique about the approach?

3. **Market Opportunity** - What's the size of the market? Include TAM, SAM, and SOM if possible.

4. **Product** - Describe the product/service in detail. What are the key features and benefits?

5. **Business Model** - How will the company make money? What's the revenue model?

6. **Competitive Advantage** - What makes this startup different from competitors? What's the moat?

7. **Go-To-Market Strategy** - How will the startup acquire customers? What's the sales and marketing plan?

8. **Team** - Who are the key team members? What expertise do they bring?

9. **Financials** - What are the financial projections? Include revenue, costs, and key metrics.

10. **Funding Ask** - How much funding is needed? What will it be used for? What's the timeline?

Please provide comprehensive, detailed content for each section that would be suitable for presentation to investors. Ensure each section is clearly labeled and well-structured.`;

    return prompt;
  }

  private static cleanResponse(content: string): string {
    // Remove thinking process indicators and meta information
    let cleaned = content;

    // Remove thinking process blocks
    cleaned = cleaned.replace(/```thinking[\s\S]*?```/gi, "");
    cleaned = cleaned.replace(/\[thinking\][\s\S]*?\[\/thinking\]/gi, "");
    cleaned = cleaned.replace(
      /\*\*thinking\*\*[\s\S]*?\*\*\/thinking\*\*/gi,
      ""
    );

    // Remove system messages
    cleaned = cleaned.replace(/system:/gi, "");
    cleaned = cleaned.replace(/assistant:/gi, "");
    cleaned = cleaned.replace(/user:/gi, "");

    // Remove excessive whitespace and newlines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();

    // Ensure we have properly formatted sections
    cleaned = this.formatSections(cleaned);

    return cleaned;
  }

  private static formatSections(content: string): string {
    // Define the expected sections
    const expectedSections = [
      "Problem",
      "Solution",
      "Market Opportunity",
      "Product",
      "Business Model",
      "Competitive Advantage",
      "Go-To-Market Strategy",
      "Team",
      "Financials",
      "Funding Ask",
    ];

    // Split content by lines
    const lines = content.split("\n").filter((line) => line.trim());
    let formatted = "";
    let currentSection = "";
    let sectionContent = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if this line is a section header
      const sectionMatch = expectedSections.find((section) => {
        const regex = new RegExp(
          `^(\\d+\\.?\\s*)?(#{1,6}\\s*)?\\*\\*?${section}\\*\\*?:?\\s*$|^(\\d+\\.?\\s*)?${section}:?\\s*$`,
          "i"
        );
        return regex.test(trimmedLine);
      });

      if (sectionMatch) {
        // Save previous section if it exists
        if (currentSection && sectionContent.trim()) {
          formatted += `## ${currentSection}\n\n${sectionContent.trim()}\n\n`;
        }

        // Start new section
        currentSection = sectionMatch;
        sectionContent = "";
      } else if (trimmedLine && currentSection) {
        // Add content to current section
        sectionContent += trimmedLine + "\n";
      } else if (trimmedLine && !currentSection) {
        // Content before any section headers
        formatted += trimmedLine + "\n\n";
      }
    }

    // Add the last section
    if (currentSection && sectionContent.trim()) {
      formatted += `## ${currentSection}\n\n${sectionContent.trim()}\n\n`;
    }

    return formatted || content; // Return original if formatting fails
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static getFallbackResponse(request: FlowiseRequest): string {
    return `# Pitch Deck for ${request.startup_idea}

## Problem
The market faces significant challenges in ${request.industry || "this sector"}. Current solutions are inadequate, expensive, or difficult to use. ${request.target_audience || "Users"} struggle with inefficient processes, high costs, and poor user experiences. This creates a substantial opportunity for disruption.

## Solution
Our innovative approach leverages cutting-edge technology to solve these problems efficiently. We provide a user-friendly, cost-effective solution that addresses the core pain points while delivering exceptional value to ${request.target_audience || "our customers"}.

## Market Opportunity
The ${request.industry || "target"} market represents a multi-billion dollar opportunity with strong growth potential. Market research indicates significant demand for solutions like ours, with early adopters showing strong interest and willingness to pay.

## Product
Our product combines intuitive design with powerful functionality. Key features include automated workflows, real-time analytics, seamless integrations, and mobile accessibility. The user experience is designed to be simple yet comprehensive.

## Business Model
Revenue streams include subscription services, premium features, and enterprise licensing. Our scalable SaaS model ensures recurring revenue with high customer lifetime value and strong unit economics.

## Competitive Advantage
Our unique technology stack, experienced team, and first-mover advantage in specific market segments create strong competitive moats. We have proprietary algorithms and strong customer relationships that are difficult to replicate.

## Go-To-Market Strategy
Our multi-channel approach includes digital marketing, strategic partnerships, and direct sales. We'll start with early adopters in ${request.industry || "key sectors"}, then expand to broader markets through proven customer acquisition channels.

## Team
Our founding team brings decades of combined experience in technology, business development, and ${request.industry || "industry expertise"}. We have the skills and network necessary to execute on this vision successfully.

## Financials
Financial projections show strong growth potential with projected revenues of $1M in Year 1, scaling to $10M+ by Year 3. Key metrics include customer acquisition cost, lifetime value, and monthly recurring revenue growth.

## Funding Ask
We are seeking $2M in Series A funding to accelerate product development, expand our team, and scale our go-to-market efforts. This will enable us to capture market share and achieve profitability within 24 months.

*Note: This is a demo response. In production, this would be generated by the Flowise AI agent with more detailed, personalized content based on your specific startup idea.*`;
  }
}
