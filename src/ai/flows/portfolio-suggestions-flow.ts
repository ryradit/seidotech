'use server';
/**
 * @fileOverview An AI flow for generating portfolio project suggestions.
 *
 * - generatePortfolioSuggestions - A function that generates suggestions for a portfolio item.
 * - PortfolioSuggestionsInput - The input type for the function.
 * - PortfolioSuggestionsOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const PortfolioSuggestionsInputSchema = z.object({
  title: z.string().describe('The title of the project or the company name.'),
  category: z.string().describe('The type of service provided for the project.'),
});
export type PortfolioSuggestionsInput = z.infer<
  typeof PortfolioSuggestionsInputSchema
>;

const PortfolioSuggestionsOutputSchema = z.object({
  description: z.string().describe('A brief, professional project description in Indonesian.'),
  aiHint: z.string().describe('A 1-2 word hint in English for AI image generation, based on the project.'),
});
export type PortfolioSuggestionsOutput = z.infer<
  typeof PortfolioSuggestionsOutputSchema
>;

export async function generatePortfolioSuggestions(input: PortfolioSuggestionsInput): Promise<PortfolioSuggestionsOutput> {
  return portfolioSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioSuggestionsPrompt',
  input: { schema: PortfolioSuggestionsInputSchema },
  output: { schema: PortfolioSuggestionsOutputSchema },
  prompt: `You are an expert copywriter for an engineering and manufacturing company. Your task is to generate a project description and an AI image hint based on the project title and service category.

**Instructions:**
1.  **Description:** Write a concise and professional project description in **Bahasa Indonesia**. The description should highlight the service provided for the given company/project. Keep it to one or two sentences.
2.  **AI Hint:** Provide a simple 1-2 word hint in **English** that can be used to find a relevant stock photo for the project. This hint will be used for AI image search.

**Project Title/Company:** {{{title}}}
**Service Category:** {{{category}}}
`,
});

const portfolioSuggestionsFlow = ai.defineFlow(
  {
    name: 'portfolioSuggestionsFlow',
    inputSchema: PortfolioSuggestionsInputSchema,
    outputSchema: PortfolioSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
