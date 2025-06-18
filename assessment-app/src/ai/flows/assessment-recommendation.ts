// src/ai/flows/assessment-recommendation.ts
'use server';

/**
 * @fileOverview Provides assessment recommendations based on user history.
 *
 * - assessmentRecommendation - A function that returns recommended assessments.
 * - AssessmentRecommendationInput - The input type for the assessmentRecommendation function.
 * - AssessmentRecommendationOutput - The return type for the assessmentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessmentRecommendationInputSchema = z.object({
  userHistory: z
    .array(z.object({
      assessmentCategory: z.string().describe('The category of the assessment taken (e.g., AI/ML, Web Development).'),
      score: z.number().describe('The score achieved on the assessment (0-100).'),
      interests: z.string().describe('The stated interests of the user')
    }))
    .describe('The user assessment history, including category and score.'),
  availableAssessments: z.array(z.object({
    assessmentCategory: z.string().describe('The category of the available assessment.'),
    assessmentTitle: z.string().describe('The title of the available assessment.'),
  })).describe('A list of available assessments and their categories.'),
});

export type AssessmentRecommendationInput = z.infer<typeof AssessmentRecommendationInputSchema>;

const AssessmentRecommendationOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('Recommended assessments based on user history and interests.'),
});

export type AssessmentRecommendationOutput = z.infer<typeof AssessmentRecommendationOutputSchema>;

export async function assessmentRecommendation(input: AssessmentRecommendationInput): Promise<AssessmentRecommendationOutput> {
  return assessmentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessmentRecommendationPrompt',
  input: {schema: AssessmentRecommendationInputSchema},
  output: {schema: AssessmentRecommendationOutputSchema},
  prompt: `Based on the user's assessment history and stated interests, recommend assessments.

User Assessment History:
{{#each userHistory}}
- Category: {{this.assessmentCategory}}, Score: {{this.score}}, Interests: {{this.interests}}
{{/each}}

Available Assessments:
{{#each availableAssessments}}
- Category: {{this.assessmentCategory}}, Title: {{this.assessmentTitle}}
{{/each}}

Given the user's past performance and stated interests, recommend the assessments most relevant to them. Focus on assessments where the user has performed well in similar categories or expressed explicit interest. Return only the titles of the recommended assessments.
`,  
});

const assessmentRecommendationFlow = ai.defineFlow(
  {
    name: 'assessmentRecommendationFlow',
    inputSchema: AssessmentRecommendationInputSchema,
    outputSchema: AssessmentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
