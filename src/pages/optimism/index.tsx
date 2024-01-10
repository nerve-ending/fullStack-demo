import * as React from "react";
import * as styles from "./index.module.css";
import { StaticImage } from "gatsby-plugin-image";
import supabase from "../../supabase.js";

const CATEGORIES = {
  "忽略正面（Ignoring the Positive）": "#3b82f6",

  "过度一般化（Overgeneralization）": "#16a34a",

  "过于悲观（Catastrophizing）": "#ef4444",

  "情感化推理（Emotional Reasoning）": "#eab308",

  "过度悲观（Overly Pessimistic）": "#14b8a6",

  "黑白思维（All-or-Nothing Thinking）": "#f97316",

  "过度个人化（Personalization）": "#8b5cf6",
};

function isValidHttpUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export default function Optimism() {
  const [hidden, setHidden] = React.useState(true);
  const [dataArray, setDataArray] = React.useState([]);
  const [text, setText] = React.useState("");
  const [category, setCategory] = React.useState(
    "情感化推理（Emotional Reasoning）"
  );
  const [source, setSource] = React.useState("http://example.com");
  const textLength = text.length;
  const [facts, setFacts] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState("all");
  const [isUpLoading, setIsUpLoading] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    async function loadFacts() {
      setIsLoading(true);

      let query = supabase.from("words").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }
      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);
      if (!error) {
        setDataArray(facts);
      } else alert("数据获取失败...");
      setIsLoading(false);
    }
    loadFacts();
  }, [currentCategory]);

  function handleClick() {
    if (hidden) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  }

  async function handleVote(item: any) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("words")
      .update({ votesInteresting: item.votesInteresting + 1 })
      .eq("id", item.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      setDataArray((words: any) => {
        return words.map((f: any) =>
          f.id === item.id ? updatedFact[0] : f
        ) as any;
      });
    }
  }

  async function handleVoteFalse(item: any) {
    setIsUpLoading(true);
    const { data: updatedFact, error } = await supabase
      .from("words")
      .update({ votesFalse: item.votesFalse + 1 })
      .eq("id", item.id)
      .select();
    setIsLoading(false);

    if (!error) {
      setDataArray((words: any) => {
        return words.map((f: any) =>
          f.id === item.id ? updatedFact[0] : f
        ) as any;
      });
    }
  }

  async function handleMindBlow(item: any) {
    setIsUpLoading(true);
    const { data: updatedFact, error } = await supabase
      .from("words")
      .update({ votesMindblowing: item.votesMindblowing + 1 })
      .eq("id", item.id)
      .select();
    setIsLoading(false);

    if (!error) {
      setDataArray((words: any) => {
        return words.map((f: any) =>
          f.id === item.id ? updatedFact[0] : f
        ) as any;
      });
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      setIsUpLoading(true);

      const { data: newFact, error } = await supabase
        .from("words")
        .insert([{ text, source, category }])
        .select();
      setIsUpLoading(false);

      setFacts((facts: any) => [newFact[0], ...facts]);

      setText("");
      setSource("");
      setCategory("");

      setHidden(true);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <StaticImage
            src="../../images/instagram.png"
            alt="Today I Learned Logo"
          />
          <h1>Today I Learned</h1>
        </div>
        <button
          className={`${styles.btn} ${styles.btnLarge} ${styles.btnOpen}`}
          onClick={() => {
            handleClick();
          }}
        >
          {hidden ? "share a fact" : "close"}
        </button>
      </header>

      {!hidden && (
        <form className={styles.factForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="与世界分享一个事实"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUpLoading}
          />
          <span>{200 - textLength}</span>
          <input
            type="text"
            placeholder="Trustworthy source..."
            value={source}
            onChange={(e: { target: { value: any } }) =>
              setSource(e.target.value)
            }
            disabled={isUpLoading}
          />
          <select
            name=""
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isUpLoading}
          >
            <option value="finance">Choose category</option>
            {Object.keys(CATEGORIES).map((item) => {
              return (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              );
            })}
          </select>
          <button
            className={`${styles.btn} ${styles.btnLarge} ${styles.btnOpen}`}
            disabled={isUpLoading}
          >
            Post
          </button>
        </form>
      )}

      {isLoading ? (
        <p className={styles.message}>Loading...</p>
      ) : (
        <main className={styles.main}>
          <aside>
            <ul>
              <li
                key="all"
                className={styles.category}
                onClick={() => setCurrentCategory("all")}
              >
                <button className={`${styles.btn} ${styles.btnAllCategories}`}>
                  All
                </button>
              </li>
              {Object.keys(CATEGORIES).map((item: any) => {
                return (
                  <li key={item} className={styles.category}>
                    <button
                      className={`${styles.btn} ${styles.btnCategory}`}
                      // @ts-ignore
                      style={{ backgroundColor: CATEGORIES[item] }}
                      onClick={() => setCurrentCategory(item)}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {dataArray.length === 0 ? (
            <p className={styles.message}>分类下没有facts，创建一个吧✌</p>
          ) : (
            <section>
              <ul>
                {dataArray.length > 0 &&
                  dataArray.map((item) => {
                    const {
                      id,
                      text,
                      source,
                      category,
                      votesInteresting,
                      votesMindblowing,
                      votesFalse,
                    } = item;
                    return (
                      <li key={id} className={styles.fact}>
                        <p>
                          {text}
                          <a
                            className={styles.source}
                            href="https://www.taobao.com/"
                            target="_blank"
                          >
                            {`(${source})`}
                          </a>
                        </p>

                        <span
                          className={styles.tag}
                          style={{
                            backgroundColor:
                              (category && CATEGORIES[category]) || "#000",
                          }}
                        >
                          {category}
                        </span>
                        <div className={styles.voteButtons}>
                          <button
                            onClick={() => handleVote(item)}
                            disabled={isUpdating}
                          >
                            👍 {votesInteresting}
                          </button>
                          <button
                            onClick={() => handleMindBlow(item)}
                            disabled={isUpdating}
                          >
                            😳 {votesMindblowing}
                          </button>
                          <button
                            onClick={() => handleVoteFalse(item)}
                            disabled={isUpdating}
                          >
                            ⛔ {votesFalse}
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <p>Build by zdl</p>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
