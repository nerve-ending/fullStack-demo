import * as React from "react";
import * as styles from "./index.module.css";
import { StaticImage } from "gatsby-plugin-image";

const CATEGORIES = {
  "忽略正面（Ignoring the Positive）": "#3b82f6",

  "过度一般化（Overgeneralization）": "#16a34a",

  "过于悲观（Catastrophizing）": "#ef4444",

  "情感化推理（Emotional Reasoning）": "#eab308",

  "过度悲观（Overly Pessimistic）": "#14b8a6",

  "黑白思维（All-or-Nothing Thinking）": "#f97316",

  "过度个人化（Personalization）": "#8b5cf6",
};

export default function Optimism() {
  const [hidden, setHidden] = React.useState(true);
  const [dataArray, setDataArray] = React.useState([]);
  const [text, setText] = React.useState("");
  const [category, setCategory] = React.useState(
    "情感化推理（Emotional Reasoning）"
  );
  const [source, setSource] = React.useState("");

  React.useEffect(() => {
    async function loadFacts() {
      const res = await fetch(
        "https://vvgmvpuzmopcasdkbmol.supabase.co/rest/v1/words",
        {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z212cHV6bW9wY2FzZGtibW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM1NzY3MzcsImV4cCI6MjAxOTE1MjczN30.T_x4J2uX2lJgyvXxv6dquFkMvcD743-ZR1ZKBuzI4HE",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z212cHV6bW9wY2FzZGtibW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM1NzY3MzcsImV4cCI6MjAxOTE1MjczN30.T_x4J2uX2lJgyvXxv6dquFkMvcD743-ZR1ZKBuzI4HE",
          },
        }
      );
      const data = await res.json();
      setDataArray(data);
    }
    loadFacts();
  }, []);

  function handleClick() {
    if (hidden) {
      setHidden(false);
    } else {
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
        <form className={styles.factForm}>
          <input
            type="text"
            placeholder="与世界分享一个事实"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <span>200</span>
          <input
            type="text"
            placeholder="Trustworthy source..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <select
            name=""
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          >
            Post
          </button>
        </form>
      )}

      <main className={styles.main}>
        <aside>
          <ul>
            {Object.keys(CATEGORIES).map((item: any) => {
              return (
                <li key={item} className={styles.category}>
                  <button
                    className={`${styles.btn} ${styles.btnCategory}`}
                    // @ts-ignore
                    style={{ backgroundColor: CATEGORIES[item] }}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

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
                      <button>👍 {votesInteresting}</button>
                      <button>😳 {votesMindblowing}</button>
                      <button>⛔ {votesFalse}</button>
                    </div>
                  </li>
                );
              })}
          </ul>
          <p>Build by zdl</p>
        </section>
      </main>
    </div>
  );
}
