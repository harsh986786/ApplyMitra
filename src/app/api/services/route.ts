import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody, normalize } from '@/server/utils';
import { GoogleGenAI } from '@google/genai';
import { CASTE_CATEGORIES, type CategoryFee, type CasteCategory } from '@/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET() {
  try {
    const db = await getDb();
    const services = await db.collection(COLLECTIONS.SERVICES).find({}).sort({ createdAt: -1 }).toArray();
    return json(services);
  } catch (err) {
    return errorResponse(err, 'Failed to load services');
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const body = await readBody(req);

    // 1. AI AUTO-FILL LOGIC (Review Mode: Direct DB save nahi hoga)
    if (body.useAi && body.name) {
      const prompt = `You are an expert Indian digital service and government form assistant. 
      Generate accurate, official, and detailed information for the Indian service/form titled: "${body.name}".
      
      Return ONLY a valid JSON object (no markdown, no backticks) with exact keys:
      - name: string (Official exact name of the form/exam/scheme)
      - category: string (Choose strictly one from: "Govt Schemes", "Certificates", "Jobs", "Exam", "Documents", "Pension", "Other")
      - description: string (Detailed 2-3 sentence overview of what this service is for)
      - eligibility: string (Clear eligibility criteria like age, qualification, or residency)
      - fees: array of objects containing category and governmentFee numbers:
        [
          {"category": "General", "governmentFee": 100},
          {"category": "OBC", "governmentFee": 100},
          {"category": "SC", "governmentFee": 0},
          {"category": "ST", "governmentFee": 0},
          {"category": "EWS", "governmentFee": 100},
          {"category": "PWD", "governmentFee": 0}
        ]
      - documentsRequired: array of strings (List of exact official required documents like "Aadhaar Card", "Class 10 Marksheet", "Income Certificate", etc.)
      `;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      const textResponse = aiResponse.text || '{}';
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const generated = JSON.parse(cleanJson);

      // Convenience Fee is ALWAYS locked to 100
      const fees = CASTE_CATEGORIES.map((cat: CasteCategory) => {
        const found = generated.fees?.find((x: any) => x.category === cat);
        return {
          category: cat,
          governmentFee: Number(found?.governmentFee ?? 0),
          convenienceFee: 100, // Fixed to 100 always
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
        }
      });
    }

    // 2. NORMAL MANUAL SAVE (Jab aap cross-check karke "Add service" button dabayenge)
    const db = await getDb();
    const fees: CategoryFee[] = (body.fees && Array.isArray(body.fees))
      ? CASTE_CATEGORIES.map((cat: CasteCategory) => {
          const f = body.fees.find((x: any) => x.category === cat);
          return {
            category: cat,
            governmentFee: Number(f?.governmentFee ?? 0),
            convenienceFee: 100, // Fixed to 100 always
          };
        })
      : CASTE_CATEGORIES.map((cat: CasteCategory) => ({ category: cat, governmentFee: 0, convenienceFee: 100 }));

    const newService = {
      name: body.name,
      slug: normalize(body.name),
      category: body.category || 'General',
      description: body.description || '',
      eligibility: body.eligibility || '',
      fees,
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