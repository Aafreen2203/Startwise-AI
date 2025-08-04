interface StartwiseRequest {
  startup_idea: string;
  industry?: string;
  target_audience?: string;
  uploaded_file?: File;
}

interface StartwiseResponse {
  text?: string;
  message?: string;
  error?: string;
  json?: any;
  data?: any;
}

interface StartupEvaluationResult {
  uniquenessCheck: string;
  techStackRecommendation: string;
  pitchGeneration: string;
  similarStartups: string;
  improvementSuggestions: string;
  successProbability: string;
}

const FLOWISE_API_URL =
  "http://localhost:3000/api/v1/prediction/ef70d4dd-adea-47c3-9e1c-217214805adc";

export class StartwiseAIService {
  static async evaluateStartupIdea(request: StartwiseRequest): Promise<string> {
    try {
      // Format the comprehensive evaluation prompt for the AI agent
      const prompt = this.formatEvaluationPrompt(request);

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

      const data: StartwiseResponse = await response.json();

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
      console.error("StartwiseAI API Error:", error);

      // Return a fallback response if the API is not available
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        return this.getFallbackEvaluationResponse(request);
      }

      throw error;
    }
  }

  private static formatEvaluationPrompt(request: StartwiseRequest): string {
    let prompt = `You are StartwiseAI, an expert startup evaluation agent. Analyze the following startup idea comprehensively using RAG (Retrieval-Augmented Generation) principles and provide a detailed evaluation.

**Startup Idea to Evaluate:** ${request.startup_idea}`;

    if (request.industry) {
      prompt += `\n**Industry:** ${request.industry}`;
    }

    if (request.target_audience) {
      prompt += `\n**Target Audience:** ${request.target_audience}`;
    }

    prompt += `

Please provide a comprehensive startup evaluation covering these 6 essential sections. Structure your response with clear section headers:

## 1. Uniqueness Check
Analyze the uniqueness of this startup idea by:
- Identifying existing competitors and similar solutions in the market
- Highlighting what makes this idea different or novel
- Explaining unique value propositions or innovative approaches
- Assessing market saturation and differentiation opportunities

## 2. Tech Stack Recommendation
Recommend a comprehensive technology stack including:
- Frontend technologies (frameworks, libraries)
- Backend architecture and technologies
- Database solutions
- Third-party APIs and services
- Development tools and deployment platforms
- Consider scalability, cost, and team expertise requirements

## 3. Pitch Generation
Create a compelling elevator pitch that includes:
- Problem statement and market pain point
- Solution overview and key features
- Target market and customer segments
- Competitive advantages and unique selling points
- Business model and revenue streams
- Make it investor-ready and concise (2-3 sentences)

## 4. Similar Startups
Identify and analyze similar startups/companies:
- List 3-5 direct or indirect competitors
- Explain their business models and approaches
- Highlight their successes and failures
- Identify market gaps they haven't addressed
- Provide insights on market timing and positioning

## 5. Improvement Suggestions
Provide actionable recommendations to strengthen the idea:
- Feature enhancements or additions
- Market positioning improvements
- Technology upgrades or alternatives
- Partnership opportunities
- Monetization strategy refinements
- User experience optimizations

## 6. Success Probability & Market Stats
Provide data-driven insights including:
- Industry failure/success rates and statistics
- Market size and growth projections
- Key success factors for this type of startup
- Timeline estimates for development and market entry
- Funding requirements and investment landscape
- Risk assessment and mitigation strategies

Please ensure each section is detailed, actionable, and based on current market knowledge. Use specific examples and data where possible.`;

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
    // Define the expected evaluation sections
    const expectedSections = [
      "Uniqueness Check",
      "Tech Stack Recommendation",
      "Pitch Generation",
      "Similar Startups",
      "Improvement Suggestions",
      "Success Probability & Market Stats",
      "Success Probability",
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

  private static getFallbackEvaluationResponse(
    request: StartwiseRequest
  ): string {
    return `# StartwiseAI Evaluation: ${request.startup_idea}

## Uniqueness Check
While analyzing your startup idea "${request.startup_idea}", there are likely existing solutions in the ${request.industry || "market"} space. However, your specific approach and target focus on ${request.target_audience || "your chosen audience"} may offer unique differentiation opportunities. Consider researching competitors to identify gaps in their offerings and position your solution to fill those specific needs.

## Tech Stack Recommendation
For a startup in ${request.industry || "this sector"}, consider this modern tech stack:

**Frontend:** React.js with TypeScript, Tailwind CSS for styling, and GSAP for animations
**Backend:** Node.js with Express or Python with FastAPI
**Database:** PostgreSQL for relational data, Redis for caching
**APIs:** RESTful APIs with JWT authentication
**Deployment:** Docker containers on AWS/Vercel/Railway
**Analytics:** Mixpanel or Google Analytics for user tracking
**Payment:** Stripe for payment processing (if applicable)

## Pitch Generation
"${request.startup_idea}" addresses a significant pain point in the ${request.industry || "market"} by providing an innovative solution that ${request.target_audience || "users"} desperately need. Our unique approach combines cutting-edge technology with user-centric design to deliver measurable value and capture a significant share of this growing market.

## Similar Startups
Several companies operate in adjacent spaces, though none may address your exact approach:
- **Direct competitors:** Research companies solving similar problems
- **Indirect competitors:** Traditional solutions your startup would replace
- **Adjacent players:** Companies serving similar audiences with different solutions
- **Success stories:** Learn from successful exits in your industry
- **Market gaps:** Identify underserved segments these companies miss

## Improvement Suggestions
To strengthen your startup idea:
- **Market Validation:** Conduct user interviews to validate core assumptions
- **MVP Development:** Build a minimal viable product to test core hypotheses
- **Partnership Strategy:** Identify key industry partnerships for distribution
- **Technology Enhancement:** Consider AI/ML integration for competitive advantage
- **User Experience:** Focus on seamless onboarding and user retention
- **Monetization:** Explore multiple revenue streams beyond primary model

## Success Probability & Market Stats
**Industry Context:** The ${request.industry || "technology"} sector shows promising growth trends with increasing market demand.

**Success Factors:**
- Strong product-market fit (crucial for 85% of successful startups)
- Experienced founding team with relevant expertise
- Adequate funding for 18-24 month runway
- Clear customer acquisition strategy
- Scalable business model

**Risk Assessment:**
- **High Risk:** Competitive market with established players
- **Medium Risk:** Technology complexity and development challenges
- **Low Risk:** Clear value proposition with validated demand

**Timeline:** Expect 6-12 months for MVP development, 12-18 months for market traction.

**Funding:** Consider $100K-500K for initial development, $1M-5M for Series A scaling.

*Note: This is a demo evaluation. In production, StartwiseAI would access real-time market data, competitor analysis, and industry reports to provide more specific insights.*`;
  }

  // Legacy method for backward compatibility
  static async generatePitchDeck(request: StartwiseRequest): Promise<string> {
    return this.evaluateStartupIdea(request);
  }
}
