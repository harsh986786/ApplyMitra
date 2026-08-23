import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';
import { CASTE_CATEGORIES, CasteCategory, type CategoryFee } from '@/types';

const aiClient =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
      })
    : null;

function normalize(value: string = ''): string {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const body = await readBody(req);

    // AGAR AI SE AUTO-FILL KARWANA HAI
    if (body.useAi && body.name) {
      if (!aiClient) {
        return errorResponse(new Error('AI is not configured'), 'AI is not configured');
      }

      const prompt = `You are an expert Indian digital service and government form assistant. 
      Based on the service name "${body.name}", generate realistic and accurate fields for a service form in India.
      Return ONLY a valid JSON object with the following keys:
      - name: string (Clean official name)
      - category: string (e.g., "Govt Schemes", "Certificates", "Jobs", "Documents")
      - description: string (Short description)
      - eligibility: string (Short eligibility criteria)
      - fees: array of objects containing category, governmentFee, and convenienceFee numbers.
      - documentsRequired: array of strings
      `;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const textResponse = aiResponse.text || '{}';
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const generated = JSON.parse(cleanJson);

      const fees = CASTE_CATEGORIES.map((cat: string) => {
        const found = generated.fees?.find((x: any) => x.category === cat);
        return {
          category: cat,
          governmentFee: Number(found?.governmentFee ?? 50),
          convenienceFee: Number(found?.convenienceFee ?? 30),
        };
      });

      return json({
        success: true,
        data: {
          name: generated.name || body.name,
          category: generated.category || 'General',
          description: generated.description || '',
          eligibility: generated.eligibility || '',
          fees,
          documentsRequired: generated.documentsRequired || [],
        },
      });
    }

    const db = await getDb();
    const fee: CategoryFee[] = body.fees && Array.isArray(body.fees)
      ? CASTE_CATEGORIES.map((cat: CasteCategory) => {
          const f = body.fees.find((x: any) => x.category === cat);
          return {
            category: cat,
            governmentFee: Number(f?.governmentFee ?? 0),
            convenienceFee: Number(f?.convenienceFee ?? 100),
          };
        })
      : CASTE_CATEGORIES.map((cat: CasteCategory) => ({
          category: cat,
          governmentFee: 0,
          convenienceFee: 100,
        }));

    const newService = {
      name: body.name,
      slug: normalize(body.name),
      category: body.category || 'General',
      description: body.description || '',
      eligibility: body.eligibility || '',
      fee,
      documentsRequired: body.documentsRequired || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.SERVICES).insertOne(newService);
    return json({ success: true, id: result.insertedId });
  } catch (err) {
    return errorResponse(err, 'Failed to process service');
  }
}