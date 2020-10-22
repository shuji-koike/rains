export enum Names {
  // 基本条件
  対象区分 = "zkSyKbn",
  自社登録物件のみ = "zshBkFlg",
  並び順 = "stJyk",
  物件種別１ = "bkknShbt1",
  物件種別２ = "bkknShbt2",
  物件種目１ = "bkknShmkDispList1",
  物件種目２ = "bkknShmkDispList2",
  新築中古区分 = "shtkChkKbnShti",
  土地権利借地権種類 = "shkcknShriSti",
  図面ありのみ = "zmumKbn",
  物件画像ありのみ = "gzumKbn",
  財務局物件のみ = "zmkyBkknKskFlg",
  オークションのみ = "okshKskFlg",
  商号の有無 = "shgUmKbn",
  取引状況 = "trhkJyukyu",
  // 所在地・沿線
  都道府県名 = "tdfkMi1",
  所在地名１ = "shzicmi1_1",
  所在地名２ = "shzicmi2_1",
  所在地名２_一致条件 = "shzicJyk_1",
  建物名 = "ttmnmi_1",
  建物名_一致条件 = "ttmnJyk_1",
  //価格・面積等
  価格_From = "kkkuCnryuFrom",
  価格_To = "kkkuCnryuTo",
  築年月_YearFrom = "cknngtYearFrom",
  築年月_MonthFrom = "cknngtMonthFrom",
  築年月_YearTo = "cknngtYearTo",
  築年月_MonthTo = "cknngtMonthTo",
  //その他検索項目
  登録年月日 = "turkKknFlg",
  変更年月日 = "hcKknFlg",
  成約年月日 = "siykKknFlg",
  成約登録年月日 = "siykTurkKknFlg",
}

export type Search = Readonly<{
  [Names.対象区分]: 対象区分;
  [Names.自社登録物件のみ]: "1" | undefined; //TODO
  [Names.並び順]: 並び順;
  [Names.物件種別１]: 物件種別;
  [Names.物件種目１]: 物件種別種目値;
  [Names.物件種別２]: 物件種別;
  [Names.物件種目２]: 物件種別種目値;
  [Names.新築中古区分]: 新築中古区分;
  [Names.土地権利借地権種類]: 土地権利借地権種類;
  [Names.図面ありのみ]: "1" | undefined;
  [Names.物件画像ありのみ]: "1" | undefined;
  [Names.財務局物件のみ]: "1" | undefined;
  [Names.オークションのみ]: "1" | undefined;
  [Names.商号の有無]: 商号の有無;
  [Names.取引状況]: 取引状況;
  [Names.都道府県名]: string;
  [Names.所在地名１]: string;
  [Names.所在地名２]: string;
  [Names.所在地名２_一致条件]: 一致条件;
  [Names.建物名]: string;
  [Names.建物名_一致条件]: 一致条件;
  //価格・面積等
  [Names.価格_From]: string;
  [Names.価格_To]: string;
  [Names.築年月_YearFrom]: string;
  [Names.築年月_MonthFrom]: typeof Month[number];
  [Names.築年月_YearTo]: string;
  [Names.築年月_MonthTo]: typeof Month[number];
  //その他検索項目
  [Names.登録年月日]: string;
  [Names.変更年月日]: string;
  [Names.成約年月日]: string;
  [Names.成約登録年月日]: string;
}>;

type 物件種別種目 = typeof groupValues.物件種目[物件種別];
type 物件種別種目値 = 物件種別種目[keyof 物件種別種目] | string; //FIXME

export const groups = {
  物件種別: [Names.物件種別１, Names.物件種別２],
  物件種目: [Names.物件種目１, Names.物件種目２],
} as const;

enum 物件種別 {
  未選択 = "",
  売土地 = "01",
  売一戸建 = "02",
  売マンション = "03",
  売外全 = "04",
  売外一 = "05",
}

export const groupValues = {
  物件種別,
  物件種目: {
    [物件種別.未選択]: {},
    [物件種別.売土地]: {
      未選択: "",
      売地: "01",
      借地権: "02",
      底地権: "03",
    },
    [物件種別.売一戸建]: {
      未選択: "",
      新築戸建: "01",
      中古戸建: "02",
      新築テラス: "03",
      中古テラス: "04",
    },
    [物件種別.売マンション]: {
      未選択: "",
      新築マンション: "01",
      中古マンション: "02",
      新築タウン: "07",
      中古タウン: "08",
      新築リゾート: "09",
      中古リゾート: "10",
      その他: "99",
    },
    [物件種別.売外全]: {
      未選択: "",
      店舗: "01",
      店舗付住宅: "02",
      住宅付店舗: "03",
      事務所: "04",
      店舗事務所: "05",
      ビル: "06",
      工場: "07",
      マンション: "08",
      倉庫: "09",
      アパート: "10",
      寮: "11",
      旅館: "12",
      ホテル: "13",
      別荘: "14",
      リゾート: "15",
      文化住宅: "16",
      その他: "99",
    },
    [物件種別.売外一]: {
      未選択: "",
      店舗: "01",
      事務所: "02",
      店舗事務所: "03",
      その他: "99",
    },
  },
} as const;

enum 対象区分 {
  在庫 = "1",
  成約 = "2",
}

enum 並び順 {
  指定なし = "",
  物件番号 = "0",
  物件種目 = "1",
  所在地 = "2",
  沿線駅 = "3",
}

enum 新築中古区分 {
  指定なし = "0",
  新築 = "1",
  中古 = "",
}

enum 土地権利借地権種類 {
  指定なし = "0",
  所有権のみ = "1",
  借地権のみ = "2",
}

enum 商号の有無 {
  商号あり = "1",
  商号なし = "0",
}

enum 取引状況 {
  指定なし = "0",
  公開中のみ = "1",
  書面による購入申込みありのみ = "2",
  売主都合で一時紹介停止中のみ = "3",
}

enum 登録年月日 {
  指定なし = "1",
  "３日以内" = "2",
  "１週間以内" = "3",
  "１ヶ月以内" = "4",
  日付を指定 = "5",
}
const 変更年月日 = 登録年月日;

enum 成約年月日 {
  "１年以内" = "6",
  "３日以内" = "2",
  "１週間以内" = "3",
  "１ヶ月以内" = "4",
  指定なし = "1",
  日付を指定 = "5",
}

enum 成約登録年月日 {
  指定なし = "1",
  "１年以内" = "6",
  "３日以内" = "2",
  "１週間以内" = "3",
  "１ヶ月以内" = "4",
  日付を指定 = "5",
}

const Month = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "02",
] as const;

enum 一致条件 {
  前方 = "1",
  部分 = "2",
}

export const values = {
  対象区分,
  並び順,
  物件種別１: groupValues.物件種別,
  物件種別２: groupValues.物件種別,
  物件種目１: groupValues.物件種目,
  物件種目２: groupValues.物件種目,
  新築中古区分,
  土地権利借地権種類,
  商号の有無,
  取引状況,
  登録年月日: 登録年月日,
  変更年月日: 変更年月日,
  成約年月日: 成約年月日,
  成約登録年月日: 成約登録年月日,
} as const;

export const defaultValues = {
  [Names.物件種別１]: groupValues.物件種別.売マンション,
  [Names.物件種目１]:
    groupValues.物件種目[values.物件種別１.売マンション].中古マンション,
};

export function validate(x: unknown): x is Partial<Search> {
  const values: string[] = Object.values(Names);
  return (
    x &&
    typeof x === "object" &&
    Object.entries(x).every(
      ([k, v]) => values.includes(k) && typeof v === "string"
    )
  );
}
