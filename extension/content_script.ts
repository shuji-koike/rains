import Tesseract from "tesseract.js";

// https://developer.chrome.com/extensions/content_scripts

unCaptcha();
replaceStaleToken();

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

function replaceStaleToken() {
  const selector = "input[name='org.apache.struts.taglib.html.TOKEN']";
  const token = document.querySelector<HTMLInputElement>(selector)?.value;
  if (token) {
    const tokens: string[] = JSON.parse(
      sessionStorage.getItem("rains-tokens") || "[]"
    );
    if (tokens.includes(token))
      [...document.querySelectorAll<HTMLInputElement>(selector)].forEach(
        (e) => (e.value = tokens[tokens.length - 1])
      );
    else tokens.push(token);
    sessionStorage.setItem("rains-tokens", JSON.stringify(tokens));
  }
}

document
  .querySelectorAll(
    "body > table > tbody > tr > td > form:nth-child(6) > table:nth-child(30) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1)"
  )
  .forEach((e) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.addEventListener("change", (e) => {
      document.getElementsByName("bkknId1").forEach((e) => {
        if (e instanceof HTMLInputElement) e.checked = input.checked;
      });
    });
    e.appendChild(input);
  });

document.getElementsByName("zmnbtn_lower").forEach((e) => {
  const button = document.createElement("button");
  button.type = "button";
  button.innerText = "図面を全件取得する";
  button.addEventListener("click", () => {
    const inputs = [
      ...document.getElementsByName("bkknId1"),
      ...document.getElementsByName("bkknId2"),
    ]
      .filter(isHTMLInputElement)
      .filter((e) => e.checked);
    for (let i = 0; i < inputs.length; i += 20) {
      download("/reins/bkkn/KG010_004.do", {
        bkknId: inputs.slice(i, i + 20).map((e) => e.value),
        bkknBngu: inputs
          .slice(i, i + 20)
          .map((e) => e.parentElement?.querySelector("input[name=bkknBngu1]"))
          .filter(isHTMLInputElement)
          .map((e) => e.value),
        kduFlg: "1",
        knskFlg: Array(inputs.slice(i, i + 20).length).fill("0"),
        r: Math.random().toString().substring(2),
      });
    }
  });
  e.parentElement?.append(button);
});

function download(url: string, data: Record<string, string | string[]>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data))
    params.set(key, Array.isArray(value) ? value.join(",") : value);
  window.open(url + "?" + params.toString());
}

function isHTMLInputElement(x: unknown): x is HTMLInputElement {
  return x instanceof HTMLInputElement;
}

document.getElementsByName("bkknShbt1").forEach((e) => {
  if (e instanceof HTMLSelectElement && !e.value) e.value = "03";
});
document.getElementsByName("tdfkMi1").forEach((e) => {
  if (e instanceof HTMLInputElement && !e.value) e.value = "東京都";
});
