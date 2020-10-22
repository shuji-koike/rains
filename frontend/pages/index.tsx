import * as React from "react";
import router, { useRouter } from "next/router";
import {
  Search,
  Names,
  groups,
  groupValues,
  values,
  defaultValues,
  validate,
} from "../form/search";
import { Radio } from "../ui/atoms/Radio";
import { Select } from "../ui/atoms/Select";
import { Checkbox } from "../ui/atoms/Checkbox";
import { TextInput } from "../ui/atoms/TextInput";
import { searchReins } from "../app/functions";
import { AuthForm, Auth } from "../app/components/AuthForm";

interface Result {
  body: string;
}

export default function index() {
  const { query: routeQuery } = useRouter();
  const [auth, setAuth] = React.useState<Auth>({});
  const [query, setQuery] = React.useState<Partial<Search>>({
    ...defaultValues,
    ...routeQuery,
  });
  React.useEffect(() => {
    if (Object.keys(query)) router.replace({ query: {} });
  }, [query]);
  const [hits, setHits] = React.useState("");
  return (
    <main>
      <AuthForm
        state={auth}
        onChange={(state) => setAuth({ ...auth, ...state })}
      />
      <SearchForm
        query={query}
        onChange={setQuery}
        onSubmit={async () => {
          if (!validate(query)) throw Error();
          router.replace({ query });
          const {
            data: { form, body },
          } = await searchReins({ ...auth, ...query });
          const doc = new DOMParser().parseFromString(body, "text/html");
          console.log(form, doc);
          setHits(body);
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: hits }}></div>
    </main>
  );
}

export const SearchForm: React.FC<{
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
  onSubmit?: () => void | Promise<void>;
}> = ({ query, onChange, onSubmit }) => {
  return (
    <form name="search">
      <基本条件 query={query} onChange={onChange} />
      <所在地_沿線 query={query} onChange={onChange} />
      <価格_面積等 query={query} onChange={onChange} />
      <その他検索項目 query={query} onChange={onChange} />
      <button type="button" onClick={() => onSubmit?.()}>
        検索
      </button>
      <button type="button" onClick={() => onChange({})}>
        リセット
      </button>
    </form>
  );
};

export const 所在地_沿線: React.FC<{
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
}> = React.memo(({ query, onChange }) => {
  return (
    <fieldset>
      <legend>所在地_沿線</legend>
      <fieldset>
        <legend>都道府県名</legend>
        <TextInput
          name={Names.都道府県名}
          value={query[Names.都道府県名] ?? "東京都"}
          onChange={(value) =>
            onChange({ ...query, [Names.都道府県名]: value })
          }
        />
      </fieldset>
    </fieldset>
  );
});

export const 価格_面積等: React.FC<{
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
}> = React.memo(({ query, onChange }) => {
  return (
    <fieldset>
      <legend>価格_面積等</legend>
      <fieldset>
        <legend>価格</legend>
        <TextInput
          name={Names.価格_From}
          value={query[Names.価格_From] || ""}
          onChange={(value) => onChange({ ...query, [Names.価格_From]: value })}
        />
        <span>~</span>
        <TextInput
          name={Names.価格_To}
          value={query[Names.価格_To] || ""}
          onChange={(value) => onChange({ ...query, [Names.価格_To]: value })}
        />
        <span>万円</span>
      </fieldset>
    </fieldset>
  );
});

export const 基本条件: React.FC<{
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
}> = React.memo(({ query, onChange }) => {
  return (
    <fieldset>
      <legend>基本条件</legend>
      <fieldset>
        <legend>対象区分</legend>
        <Radio
          name={Names.対象区分}
          options={values.対象区分}
          value={query[Names.対象区分] || values.対象区分.在庫}
          onChange={(value) => onChange({ ...query, [Names.対象区分]: value })}
        />
        <label>
          <Checkbox
            name={Names.自社登録物件のみ}
            value="1"
            checked={query[Names.自社登録物件のみ] === "1"}
            onChange={(value) =>
              onChange({ ...query, [Names.自社登録物件のみ]: value })
            }
          />
          <span>自社登録物件のみ</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>並び順</legend>
        <Radio
          name={Names.並び順}
          value={query[Names.並び順] || values.並び順.指定なし}
          onChange={(value) => onChange({ ...query, [Names.並び順]: value })}
          options={values.並び順}
        />
      </fieldset>
      <fieldset>
        <legend>物件種別・物件種目</legend>
        {[0, 1].map((i) => (
          <物件種目 key={i} index={i} query={query} onChange={onChange} />
        ))}
      </fieldset>
      <fieldset>
        <legend>土地権利借地権種類</legend>
        <Radio
          name={Names.土地権利借地権種類}
          options={values.土地権利借地権種類}
          value={
            query[Names.土地権利借地権種類] ||
            values.土地権利借地権種類.指定なし
          }
          onChange={(value) =>
            onChange({ ...query, [Names.土地権利借地権種類]: value })
          }
        />
      </fieldset>
      <fieldset>
        <legend>その他条件</legend>
        <label>
          <Checkbox
            name={Names.図面ありのみ}
            value="1"
            checked={query[Names.図面ありのみ] === "1"}
            onChange={(value) =>
              onChange({ ...query, [Names.図面ありのみ]: value })
            }
          />
          <span>図面ありのみ</span>
        </label>
        <label>
          <Checkbox
            name={Names.物件画像ありのみ}
            value="1"
            checked={query[Names.物件画像ありのみ] === "1"}
            onChange={(value) =>
              onChange({ ...query, [Names.物件画像ありのみ]: value })
            }
          />
          <span>物件画像ありのみ</span>
        </label>
        <label>
          <Checkbox
            name={Names.財務局物件のみ}
            value="1"
            checked={query[Names.財務局物件のみ] === "1"}
            onChange={(value) =>
              onChange({ ...query, [Names.財務局物件のみ]: value })
            }
          />
          <span>財務局物件のみ</span>
        </label>
        <label>
          <Checkbox
            name={Names.オークションのみ}
            value="1"
            checked={query[Names.オークションのみ] === "1"}
            onChange={(value) =>
              onChange({ ...query, [Names.オークションのみ]: value })
            }
          />
          <span>オークションのみ</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>商号の有無</legend>
        <Radio
          name={Names.商号の有無}
          options={values.商号の有無}
          value={query[Names.商号の有無] || values.商号の有無.商号あり}
          onChange={(value) =>
            onChange({ ...query, [Names.商号の有無]: value })
          }
        />
      </fieldset>
      <fieldset>
        <legend>取引状況</legend>
        <Radio
          name={Names.取引状況}
          options={values.取引状況}
          value={query[Names.取引状況] || values.取引状況.指定なし}
          onChange={(value) => onChange({ ...query, [Names.取引状況]: value })}
        />
      </fieldset>
    </fieldset>
  );
});

const 物件種目: React.FC<{
  index: number;
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
}> = React.memo(({ index: i, query, onChange }) => {
  return (
    <section>
      <Select
        name={groups.物件種別[i]}
        value={query[groups.物件種別[i]]}
        onChange={(value) =>
          onChange({
            ...query,
            [groups.物件種別[i]]: value,
            [groups.物件種目[i]]: "",
          })
        }
        options={groupValues.物件種別}
      />
      <Select
        name={groups.物件種目[i]}
        value={query[groups.物件種目[i]]}
        onChange={(value) =>
          onChange({ ...query, [groups.物件種目[i]]: value })
        }
        options={groupValues.物件種目[query[groups.物件種別[i]] || ""]}
      />
    </section>
  );
});

const その他検索項目: React.FC<{
  query: Partial<Search>;
  onChange: React.Dispatch<React.SetStateAction<Partial<Search>>>;
}> = React.memo(({ query, onChange }) => {
  return (
    <fieldset>
      <legend>その他検索項目</legend>
      <fieldset>
        <legend>在庫のみ</legend>
        <label>登録年月日</label>
        <Radio
          name={Names.登録年月日}
          value={query[Names.登録年月日] || values.登録年月日.指定なし}
          onChange={(value) =>
            onChange({ ...query, [Names.登録年月日]: value })
          }
          options={values.登録年月日}
        />
        <br />
        <label>変更年月日</label>
        <Radio
          name={Names.変更年月日}
          value={query[Names.変更年月日] || values.変更年月日.指定なし}
          onChange={(value) =>
            onChange({ ...query, [Names.変更年月日]: value })
          }
          options={values.変更年月日}
        />
      </fieldset>
      <fieldset>
        <legend>成約のみ</legend>
        <label>成約年月日</label>
        <Radio
          name={Names.成約年月日}
          value={query[Names.成約年月日] || values.成約年月日["１年以内"]}
          onChange={(value) =>
            onChange({ ...query, [Names.成約年月日]: value })
          }
          options={values.成約年月日}
        />
        <br />
        <label>成約登録年月日</label>
        <Radio
          name={Names.成約登録年月日}
          value={query[Names.成約登録年月日] || values.成約登録年月日.指定なし}
          onChange={(value) =>
            onChange({ ...query, [Names.成約登録年月日]: value })
          }
          options={values.成約登録年月日}
        />
      </fieldset>
    </fieldset>
  );
});
