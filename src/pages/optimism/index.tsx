import * as React from "react";
import * as styles from "./index.module.css";
import { StaticImage } from "gatsby-plugin-image";

export default function Optimism() {
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
        <button>分享一个事实</button>
        {/* {<p>{posts}</p>} */}
      </header>

      <form className={styles.factForm}>
        <input type="text" placeholder="与世界分享一个事实" />
        <span>200</span>
        <input type="text" />
        <select name="" id="">
          <option value="">选择类别:</option>
          <option value="technology">Technology</option>
          <option value="science">Science</option>
          <option value="finance">Finance</option>
        </select>
        <button
          className={`${styles.btn} ${styles.btnLarge} ${styles.btnOpen}`}
        >
          Post
        </button>
      </form>

      <main className={styles.main}>
        <aside>
          <ul>
            <li className={styles.category}>
              <button className={`${styles.btn} ${styles.btnAllCategories}`}>
                All
              </button>
            </li>
            <li className={styles.category}>
              <button
                className={`${styles.btn} ${styles.btnCategory}`}
                style={{ backgroundColor: "#3b82f6" }}
              >
                Technology
              </button>
            </li>
            <li className={styles.category}>
              <button
                className={`${styles.btn} ${styles.btnCategory}`}
                style={{ backgroundColor: "#16a34a" }}
              >
                Science
              </button>
            </li>
          </ul>
        </aside>

        <section>
          <ul>
            <li className={styles.fact}>
              <p>
                React is being developed by Google(formerly facebook)
                <a
                  className={styles.source}
                  href="https://www.taobao.com/"
                  target="_blank"
                >
                  (Source)
                </a>
              </p>

              <span
                className={styles.tag}
                style={{ backgroundColor: "#3b82f6" }}
              >
                technology
              </span>
              <div className={styles.voteButtons}>
                <button>👍 24</button>
                <button>😳 9</button>
                <button>⛔ 4</button>
              </div>
            </li>
            <li className={styles.fact}>
              <p>
                React is being developed by Google(formerly facebook)
                <a
                  className={styles.source}
                  href="https://www.taobao.com/"
                  target="_blank"
                >
                  (Source)
                </a>
              </p>

              <span
                className={styles.tag}
                style={{ backgroundColor: "#eab308" }}
              >
                society
              </span>
              <div className={styles.voteButtons}>
                <button>👍 11</button>
                <button>😳 2</button>
                <button>⛔ 0</button>
              </div>
            </li>
          </ul>
          <p>Build by Jonas</p>
        </section>
      </main>
    </div>
  );
}
