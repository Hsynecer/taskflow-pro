import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { taskTitle } = await req.json();

   
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Sen bir proje yöneticisi asistanısın. Bana verilen şu ana görevi, uygulanabilir en fazla 3 küçük alt göreve (subtask) böl: "${taskTitle}". Lütfen cevabını başka hiçbir açıklama, madde işareti veya numara kullanmadan, aralarında sadece virgül olan düz bir metin olarak ver. Örnek format: Alt Görev 1, Alt Görev 2, Alt Görev 3`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const aiSuggestions = responseText.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    return NextResponse.json({ suggestions: aiSuggestions });
  } catch (error: any) {
    console.error('Yapay Zeka Hatası:', error.message);
    return NextResponse.json({ error: 'Alt görevler üretilemedi.' }, { status: 500 });
  }
}


