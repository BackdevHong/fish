document.addEventListener("DOMContentLoaded", () => {
  let isTouchDown = false; // 터치 여부 확인 변수
  let isMouseDown = false; // 기존 마우스 눌림 여부 확인 변수
  const gaugeFill = document.getElementById("gauge-fill");
  const gauge = document.getElementById("gauge");
  const fish = document.getElementById("fish");
  const gaugeFill2 = document.getElementById("gauge-fill2"); // 두 번째 게이지
  let gaugePosition = 50; // 초록색 게이지의 초기 위치 (50%)
  const maxGaugePosition = 250; // 최대 위치 (최고 위치)
  const minGaugePosition = -150; // 최소 위치 (최저 위치)

  const minFishPosition = 0;
  const maxFishPosition = 1750;

  const gaugeSpeed = 5; // 게이지 속도
  let fishPosition = 0; // 물고기 초기 위치
  const fishSpeed = 25; // 물고기 속도 (물고기의 이동 속도)
  let fishDirection = 1; // 1이면 내려가고, -1이면 올라가는 방향

  const minGaugeFill2Height = 0; // 두 번째 게이지의 최소 높이 (0%)
  const maxGaugeFill2Height = 100; // 두 번째 게이지의 최대 높이 (100%)
  const gaugeFill2Speed = 1; // 두 번째 게이지 차오르는 속도 (0~100)

  let targetGaugeFill2Height = minGaugeFill2Height; // 두 번째 게이지의 목표 높이
  let currentGaugeFill2Height = minGaugeFill2Height; // 두 번째 게이지의 현재 높이

  // 텔레그램 미니 앱 환경 설정
  Telegram.WebApp.ready();

  // 마우스 눌렀을 때
  document.addEventListener("mousedown", () => {
    isMouseDown = true;
  });

  // 마우스 떼었을 때
  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  // 터치 시작 시 (마우스 클릭처럼 처리)
  document.addEventListener("touchstart", (e) => {
    isTouchDown = true;
    e.preventDefault(); // 터치로 인한 기본 동작 방지
  });

  // 터치 끝났을 때 (마우스 떼기처럼 처리)
  document.addEventListener("touchend", () => {
    isTouchDown = false;
  });

  // 게이지 업데이트
  function updateGauge() {
    // 게이지 움직임 처리 (마우스 클릭 시 위로 올라가거나, 떼면 내려감)
    if (isMouseDown || isTouchDown) {
      // 마우스 또는 터치로 눌렀을 때
      if (gaugePosition < maxGaugePosition) {
        gaugePosition += gaugeSpeed;
      }
    } else {
      if (gaugePosition > minGaugePosition) {
        gaugePosition -= gaugeSpeed;
      }
    }

    // 초록색 게이지 위치 변경
    gaugeFill.style.transform = `translateY(${100 - gaugePosition}%)`;

    // 물고기의 위치 업데이트 (물고기 방향에 따라 위아래로 움직임)
    if (fishDirection === 1) {
      if (fishPosition < maxFishPosition) {
        fishPosition += fishSpeed;
      } else {
        fishDirection = -1;
      }
    } else if (fishDirection === -1) {
      if (fishPosition > minFishPosition) {
        fishPosition -= fishSpeed;
      } else {
        fishDirection = 1;
      }
    }

    // 물고기 위치 업데이트 (translateY)
    fish.style.transform = `translateX(-50%) translateY(${fishPosition}%)`;

    const gaugeFillRect = gaugeFill.getBoundingClientRect();
    const fishRect = fish.getBoundingClientRect();

    const isOverlapping =
      fishRect.top < gaugeFillRect.bottom &&
      fishRect.bottom > gaugeFillRect.top &&
      fishRect.left < gaugeFillRect.right &&
      fishRect.right > gaugeFillRect.left;

    if (isOverlapping) {
      targetGaugeFill2Height = maxGaugeFill2Height; // 겹치면 두 번째 게이지가 최대값으로 차오름
    } else {
      targetGaugeFill2Height = minGaugeFill2Height; // 겹치지 않으면 두 번째 게이지가 최소값으로 내려감
    }

    // 두 번째 게이지의 높이를 서서히 변경 (서서히 차오르기 또는 내려가기)
    if (currentGaugeFill2Height < targetGaugeFill2Height) {
      currentGaugeFill2Height += gaugeFill2Speed; // 서서히 차오르기
    } else if (currentGaugeFill2Height > targetGaugeFill2Height) {
      currentGaugeFill2Height -= gaugeFill2Speed; // 서서히 내려가기
    }

    // 두 번째 게이지의 높이를 설정
    gaugeFill2.style.height = `${Math.min(
      Math.max(currentGaugeFill2Height, minGaugeFill2Height),
      maxGaugeFill2Height
    )}%`; // 0%~100% 사이로 유지되도록
  }

  // 텔레그램 미니 앱에서 게임을 시작합니다.
  setInterval(updateGauge, 20);
});
