import Tesseract from "tesseract.js";

// https://developer.chrome.com/extensions/content_scripts

unCaptcha();

export async function unCaptcha() {
  const img = document.querySelector(
    "img[src='/reins/ktgyoumu/KG001_001JcaptchaAction.do']"
  );
  if (!(img instanceof HTMLImageElement)) return;
  const {
    data: { text },
  } = await Tesseract.recognize(getImageData(img), "eng");
  if (!/(\d{6})/.test(text)) return;
  const input = document.querySelector("input[name='kywrd']");
  if (!(input instanceof HTMLInputElement)) return;
  input.value = text;
}

export function getImageData(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d")?.drawImage(img, 0, 0);
  return new Buffer(
    canvas.toDataURL("image/png").replace("data:image/png;base64,", ""),
    "base64"
  );
}
