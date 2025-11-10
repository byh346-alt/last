exports.handler = async function (event, context) {
  try {
    // 1. 함수가 실행되자마자 로그를 찍습니다.
    console.log("Netlify 함수가 성공적으로 호출되었습니다!");
    console.log("전달받은 온도:", event.queryStringParameters.temp);

    // 2. AI 대신 임시 성공 메시지를 보냅니다.
    const fakeOutfitText = "진단 모드: 함수가 살아있습니다. AI 연결을 확인하세요.";

    return {
      statusCode: 200,
      body: JSON.stringify({ outfit: fakeOutfitText }),
    };

  } catch (error) {
    // 3. 만약 이 간단한 코드조차 실패하면 로그를 찍습니다.
    console.error("진단 중 알 수 없는 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "진단 중 오류 발생." }),
    };
  }
};