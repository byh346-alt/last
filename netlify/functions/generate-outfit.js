// Google Gemini 라이브러리를 가져옵니다.
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
  try {
    // 1. Netlify 환경 변수에서 API 키를 안전하게 가져옵니다.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 2. 프론트엔드(index.html)에서 보낸 '온도(temp)' 값을 받습니다.
    const temp = event.queryStringParameters.temp;

    // 3. Gemini에게 보낼 프롬프트(명령어)를 만듭니다.
    const prompt = `
      당신은 날씨 기반 패션 어드바이저입니다.
      현재 평균 기온은 ${temp}°C 입니다.
      이 날씨에 어울리는 옷차림을 구체적이고 친절하게 추천해주세요.
    `;

    // 4. Gemini API 호출
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outfitText = response.text();

    // 5. 성공적인 답변을 프론트엔드로 다시 보냅니다.
    return {
      statusCode: 200,
      body: JSON.stringify({ outfit: outfitText }),
    };

  } catch (error) {
    console.error("Gemini API 오류:", error);
    // 6. 오류 발생 시 오류 메시지를 보냅니다.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI 추천을 생성하는 데 실패했습니다." }),
    };
  }
};