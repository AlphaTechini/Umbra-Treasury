import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	if (!env.GEMINI_API_KEY) {
		return json({ error: 'AI capabilities are currently offline. Please check system configuration.' }, { status: 503 });
	}

	try {
		const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
		const result = await genAI.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: `You are Umbra Oracle, a precise financial treasury agent.
Generate 3 concise, highly professional financial insights for an institutional treasury dashboard.
Format: A JSON array of strings.
The insights should sound smart, data-driven, and institutional.
Keep each insight under 20 words.`
						}
					]
				}
			]
		});

		const insightsText = result.text ?? '';
		const jsonMatch = insightsText.match(/\[.*\]/s);
		const insights = jsonMatch
			? JSON.parse(jsonMatch[0])
			: [
					'Yield optimization suggested for idle USD reserves.',
					'Volatility dampening observed in major liquidity pools.',
					'Q4 hedging strategy alignment recommended.'
				];

		return json({ insights });
	} catch (error) {
		console.error('Gemini Error:', error);
		return json({ error: 'Failed to generate insights' }, { status: 500 });
	}
};
