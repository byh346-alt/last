export default async function handler(req, res) {
  
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("Gemini API 키가 없습니다!");
    res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
    return;
  }

  // 1. 'condition' (날씨 상태) 파라미터를 추가로 받습니다.
  const temp = req.query.temp;
  const location = req.query.location || '알 수 없음';
  const condition = req.query.condition || '알 수 없음'; // (예: Clouds, Rain, Clear)

  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  
  // 2. ★★★ 프롬프트를 훨씬 더 똑똑하게 수정 ★★★
  const prompt = `
    당신은 전문 패션 어드바이저입니다.
    현재 위치는 "${location}" 입니다. (이 위치의 지리적 특성, 예를 들어 사막, 해변, 도시, 산악 지대 등을 고려하세요.)
    현재 기온은 ${temp}°C 이고, 날씨 상태는 "${condition}" (예: Clear, Clouds, Rain) 입니다.
    
    이 모든 정보(위치 특성, 기온, 날씨 상태)를 종합적으로 고려하여,
    가장 실용적이고 구체적인 옷차림을 3-4줄로 간결하게 추천해주세요.
    (예: "사막 기후"와 "도시 기후"는 같은 온도라도 다르게 추천해야 합니다.)
  `;

  const requestBody = {
    contents: [ { parts: [ { text: prompt } ] } ]
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Fetch 오류:", errorData);
      throw new Error(errorData.error.message || "Gemini API 요청 실패");
    }

    const data = await response.json();
    const outfitText = data.candidates[0].content.parts[0].text;

    res.status(200).json({ outfit: outfitText });

  } catch (error) {
    console.error("핸들러 오류:", error);
    res.status(500).json({ error: error.message || "알 수 없는 오류 발생" });
  }
}