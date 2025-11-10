// @google/generative-ai 라이브러리를 사용하지 않습니다.

exports.handler = async function (event, context) {
  
  // 1. Netlify 환경 변수에서 API 키를 가져옵니다.
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("Gemini API 키가 없습니다!");
    return { statusCode: 500, body: JSON.stringify({ error: "API 키가 설정되지 않았습니다." }) };
  }

  // 2. 프론트엔드에서 보낸 파라미터를 받습니다.
  const temp = event.queryStringParameters.temp;
  const location = event.queryStringParameters.location || '알 수 없음';

  // 3. ★★★ v1 (최신) 주소와 '사용 가능한' 모델 이름을 사용합니다. ★★★
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  
  // 4. Gemini에게 보낼 프롬프트를 만듭니다.
  const prompt = `
    당신은 날씨 기반 패션 어드바이저입니다.
    현재 위치는 "${location}"이고, 평균 기온은 ${temp}°C 입니다.
    이 날씨와 장소에 어울리는 옷차림을 구체적이고 친절하게 추천해주세요.
  `;

  // 5. Gemini API가 요구하는 JSON 요청 본문(Body) 형식
  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    // 6. 'fetch'를 사용해 Gemini API를 직접 호출합니다.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // API가 오류를 반환한 경우
      const errorData = await response.json();
      console.error("Gemini API Fetch 오류:", errorData);
      throw new Error(errorData.error.message || "Gemini API 요청 실패");
    }

    const data = await response.json();

    // 7. API 응답에서 텍스트를 추출합니다.
    const outfitText = data.candidates[0].content.parts[0].text;

    // 8. 성공적인 답변을 프론트엔드로 보냅니다.
    return {
      statusCode: 200,
      body: JSON.stringify({ outfit: outfitText }),
    };

  } catch (error) {
    console.error("핸들러 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "알 수 없는 오류 발생" }),
    };
  }
};