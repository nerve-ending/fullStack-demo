import * as React from "react";
import * as styles from "./index.module.scss";
import { StaticImage } from "gatsby-plugin-image";
import supabase from "../../supabase.js";

const CATEGORIES = {
  黑白思维: "#3b82f6",

  等差数列概括: "#16a34a",

  消极有色眼镜: "#ef4444",

  贬损自己优点: "#eab308",

  结果验证: "#14b8a6",

  应该陈述: "#f97316",

  归己化: "#8b5cf6",
};

// const CATEGORIES = {
//   要么一切要么全无: "#002FA7",
//   过于概括: "#81D8CF",
//   心灵过滤: "#003152",
//   贬损积极: "#B05923",
//   跳跃式结论: "#E60000",
//   夸大与夸小: "#900021",
//   情绪推理: "#FBD26A",
//   应该陈述: "#8F4B28",
//   贴标签与标签不当: "#01847F",
//   归己化: "#40E0D0",
// };

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
          <StaticImage src="../../images/purple-eye.png" alt="Talking Aloud" />
          <h1>Talking Aloud</h1>
        </div>
        <button
          className={`${styles.btnShare} ${styles.btnLarge} ${styles.btnOpen}`}
          onClick={() => {
            handleClick();
          }}
        >
          {hidden ? "分享一个事实" : "关闭"}
        </button>
      </header>

      {!hidden && (
        <form className={styles.factForm} onSubmit={handleSubmit}>
          <input
            className={styles.shareInput}
            type="text"
            placeholder="与世界分享一个事实"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUpLoading}
          />
          <span>{200 - textLength}</span>
          <input
            className={styles.url}
            type="text"
            placeholder="来源"
            value={source}
            onChange={(e: { target: { value: any } }) =>
              setSource(e.target.value)
            }
            disabled={isUpLoading}
          />
          <select
            className={styles.shareInput}
            name=""
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isUpLoading}
          >
            <option value="finance">选一个类别</option>
            {Object.keys(CATEGORIES).map((item) => {
              return (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              );
            })}
          </select>
          <button
            className={`${styles.btnShare} ${styles.btnLarge} ${styles.btnOpen}`}
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
                <button
                  className={`${styles.btnAll} ${styles.btnAllCategories}`}
                >
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
                    const isDisputed =
                      votesInteresting + votesMindblowing < votesFalse;
                    return (
                      <li key={id} className={styles.fact}>
                        <p>
                          {isDisputed ? (
                            <span className={styles.disputed}>[⛔ 争议]</span>
                          ) : null}
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
            </section>
          )}
        </main>
      )}
    </div>
  );
}
