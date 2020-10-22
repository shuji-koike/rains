import cheerio from "cheerio";
import got from "got";
import { CookieJar } from "tough-cookie";
import Tesseract from "tesseract.js";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const TOKEN_NAME = "org.apache.struts.taglib.html.TOKEN";

type Response = {
  [TOKEN_NAME]: string;
  randomID?: string;
  form?: Record<string, unknown>;
  rawBody?: Buffer;
  body?: string;
  $?: cheerio.Root;
};

type Session = {
  cookieJar: CookieJar;
  [TOKEN_NAME]: string;
};

export async function login(
  cookieJar: CookieJar,
  usrId: string,
  inpswrd: string
): Promise<Response> {
  const url = {
    base: "https://system.reins.jp",
    login: "https://system.reins.jp/reins/ktgyoumu/KG001_001.do",
  };
  const $ = cheerio.load((await got(url.login, { cookieJar })).body);
  const $form = $("form[name='TT_UsrForm']");
  const { statusCode, statusMessage, rawBody } = await got.post(
    url.base + $form.attr("action")?.replace(/;jsessionid=.{38}/, ""),
    {
      cookieJar,
      form: {
        [TOKEN_NAME]: $form.find(`input[name='${TOKEN_NAME}']`).attr("value"),
        usrId,
        inpswrd,
        kywrd: await capcha(
          (
            await got(url.base + $form.find("img").attr("src")!, {
              cookieJar,
            })
          ).rawBody
        ),
        s_check: "on",
      },
    }
  );
  if (statusCode !== 200)
    throw Error(`http error ${statusCode} ${statusMessage}`);
  else {
    const $ = cheerio.load(rawBody);
    return {
      [TOKEN_NAME]: scrapeToken($),
      rawBody,
    };
  }
}

export async function capcha(img: Buffer) {
  const normalize = (s: string | null | undefined) =>
    s?.replace(/\s/g, "").trim().slice(0, 6) || "";
  if (process.env.NODE_ENV === "development")
    return normalize((await Tesseract.recognize(img, "eng")).data.text);
  else {
    const [
      { fullTextAnnotation },
    ] = await new ImageAnnotatorClient().annotateImage({
      image: { content: img },
      features: [{ type: "TEXT_DETECTION" }],
    });
    return normalize(fullTextAnnotation?.text);
  }
}

export async function search(
  user: string,
  pass: string,
  form: Record<string, unknown>
) {
  const cookieJar = new CookieJar();
  const session = await login(cookieJar, user, pass);
  return await BK001_002({ cookieJar, ...session }, form);
}

export async function BK001_001({
  cookieJar,
  ...session
}: Session): Promise<Response> {
  const { body, rawBody } = await got.post(
    "https://system.reins.jp/reins/ktgyoumu/BK001_001.do",
    {
      cookieJar,
      searchParams: {
        r: Math.random().toString().substring(2),
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        [TOKEN_NAME]: session[TOKEN_NAME],
        ybdshShrKbn: "6",
        x: "77",
        y: "26",
      },
    }
  );
  const $ = cheerio.load(rawBody);
  return {
    [TOKEN_NAME]: scrapeToken($),
    randomID: $("input[name='randomID']").attr("value"),
    rawBody,
    body,
  };
}

export async function BK001_002(
  { cookieJar, ...session }: Session,
  query: Record<string, unknown>
): Promise<Response> {
  const form = {
    [TOKEN_NAME]: (await BK001_001({ cookieJar, ...session }))[TOKEN_NAME],
    contextPath: "/rains",
    event: "forward_searchbabi",
    ...values,
    ...query,
  };
  const { body, rawBody } = await got.post(
    "https://system.reins.jp/reins/bkkn/BK001_002.do",
    {
      cookieJar,
      searchParams: {
        r: Math.random().toString().substring(2),
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      form,
    }
  );
  const $ = cheerio.load(rawBody);
  return {
    [TOKEN_NAME]: scrapeToken($),
    form,
    body,
  };
}

export function scrapeToken(root: cheerio.Root): string {
  const token = root(`input[name='${TOKEN_NAME}']`).attr("value");
  if (!token) throw Error();
  return token;
}

const values = Object.freeze({
  bbTtKbn: "1",
  zkSyKbn: "1",
  stateMode: "",
  stWttBg: "",
  hzMi: "",
  stJyk: "",
  bkknShmk1: "",
  bkknShmk2: "",
  bkknShbt1: "03", //FIXME
  bkknShmkDispList1: "",
  bkknShbt2: "",
  bkknShmkDispList2: "",
  shtkChkKbnShti: "0",
  shkcknShriSti: "0",
  trhkJyukyu: "0",
  shzicmi1_1: "",
  shzicmi2_1: "",
  ttmnmi_1: "",
  tdfkMi2: "",
  shzicmi1_2: "",
  shzicmi2_2: "",
  ttmnmi_2: "",
  tdfkMi3: "",
  shzicmi1_3: "",
  shzicmi2_3: "",
  ttmnmi_3: "",
  ensnmi1: "",
  ekmiFrom1: "",
  ekmiTo1: "",
  thNyrkt1: "",
  thMbKbn1: "",
  krmKm1: "",
  bsB1: "",
  ensnmi2: "",
  ekmiFrom2: "",
  ekmiTo2: "",
  thNyrkt2: "",
  thMbKbn2: "",
  krmKm2: "",
  bsB2: "",
  ensnmi3: "",
  ekmiFrom3: "",
  ekmiTo3: "",
  thNyrkt3: "",
  thMbKbn3: "",
  krmKm3: "",
  bsB3: "",
  bsRsmi: "",
  bsTmiSh: "",
  tihNyrkt: "",
  tihMbKbn: "",
  sotKtu: "",
  sotKtuNyrkt: "",
  sotKtuMbKbn: "",
  kkkuCnryuFrom: "",
  kkkuCnryuTo: "",
  siykKkkuCnryuFrom: "",
  siykKkkuCnryuTo: "",
  tbTnkFrom: "",
  tbTnkTo: "",
  siykTbTnkFrom: "",
  siykTbTnkTo: "",
  tcMnskFrom: "",
  tcMnskTo: "",
  ttmnMnskFrom: "",
  ttmnMnskTo: "",
  snyuMnskFrom: "",
  snyuMnskTo: "",
  mdrHysuFrom: "",
  mdrHysuTo: "",
  shzikiFrom: "",
  shzikiTo: "",
  blcnyHuku: "",
  stdoHuku: "",
  stdoJyukyu: "",
  stdoStmn: "",
  stdoFkin: "",
  tskikk: "",
  yutCik: "",
  sitkYut: "",
  ktcJok: "",
  chushjyuZih: "",
  cknngtYearFrom: "",
  cknngtMonthFrom: "",
  cknngtYearTo: "",
  cknngtMonthTo: "",
  kjkrngGgFrom: "R",
  kjkrngYearFrom: "",
  kjkrngMonthFrom: "",
  kjkrngGgTo: "R",
  kjkrngYearTo: "",
  kjkrngMonthTo: "",
  optId: "",
  strStbJok: "",
  bk1: "",
  shuhnKnkyu: "",
  turkNngppGgFrom: "R",
  turkNngppNenFrom: "",
  turkNngppGatuFrom: "",
  turkNngppHiFrom: "",
  turkNngppGgTo: "R",
  turkNngppNenTo: "",
  turkNngppGatuTo: "",
  turkNngppHiTo: "",
  hnkuNngppGgFrom: "R",
  hnkuNngppNenFrom: "",
  hnkuNngppGatuFrom: "",
  hnkuNngppHiFrom: "",
  hnkuNngppGgTo: "R",
  hnkuNngppNenTo: "",
  hnkuNngppGatuTo: "",
  hnkuNngppHiTo: "",
  siykKknFlg: "6",
  siykNngppGgFrom: "R",
  siykNngppNenFrom: "",
  siykNngppGatuFrom: "",
  siykNngppHiFrom: "",
  siykNngppGgTo: "R",
  siykNngppNenTo: "",
  siykNngppGatuTo: "",
  siykNngppHiTo: "",
  siykTurkNngppGgFrom: "R",
  siykTurkNngppNenFrom: "",
  siykTurkNngppGatuFrom: "",
  siykTurkNngppHiFrom: "",
  siykTurkNngppGgTo: "R",
  siykTurkNngppNenTo: "",
  siykTurkNngppGatuTo: "",
  siykTurkNngppHiTo: "",
  seniMotFlg: "",
  seniGenGamenID: "GBK001_001",
});
