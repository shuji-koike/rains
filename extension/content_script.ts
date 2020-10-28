import Tesseract from "tesseract.js";

// https://developer.chrome.com/extensions/content_scripts

unCaptcha();

export async function unCaptcha() {
  const img = document.querySelector(
    "img[src='/reins/ktgyoumu/KG001_001JcaptchaAction.do']"
  );
  if (!(img instanceof HTMLImageElement)) return;
  const canvas = document.createElement("canvas");
  canvas.getContext("2d")?.drawImage(img, 0, 0);
  const {
    data: { text },
  } = await Tesseract.recognize(canvas, "eng");
  if (!/(\d{6})/.test(text)) return;
  const input = document.querySelector("input[name='kywrd']");
  if (!(input instanceof HTMLInputElement)) return;
  input.value = text;
}

}
