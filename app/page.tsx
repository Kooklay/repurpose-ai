export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="glow" aria-hidden />

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">
            <span className="logo-mark">R</span>
            Repurpose.ai
          </a>
          <nav className="nav-links">
            <a href="#features">Возможности</a>
            <a href="#pricing">Цены</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a href="/login" className="btn-ghost">Войти</a>
            <a href="/signup" className="btn-primary">Начать бесплатно</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="badge">3 бесплатные генерации — без карты</div>
          <h1 className="hero-title">
            Одно видео{" "}
            <span className="hero-title-accent">
              → контент на неделю вперёд
            </span>
          </h1>
          <p className="hero-subtitle">
            Вставь ссылку на YouTube, статью или подкаст. Получи 30+ готовых
            постов для X, LinkedIn, TikTok, Telegram и email — за 60 секунд.
          </p>
          <form className="hero-form" action="/auth/redirect" method="get">
            <input
              type="url"
              name="source"
              placeholder="https://youtube.com/watch?v=..."
              className="hero-input"
            />
            <button type="submit" className="hero-button">
              Сгенерировать
            </button>
          </form>
          <p className="hero-hint">
            Без карты · Без регистрации · Результат сразу
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">
            Ты тратишь <span className="section-title-accent">8 часов в неделю</span>{" "}
            на адаптацию контента
          </h2>
          <div className="grid-3">
            {[
              { num: "8ч", text: "уходит на переписывание одного видео под 5 платформ" },
              { num: "3–5", text: "каналов ведёт соло-маркетолог одновременно" },
              { num: "5 000 ₽", text: "стоят конкуренты — Opus Clip, Repurpose.io, Castmagic" },
            ].map((item) => (
              <div key={item.num} className="card card-center">
                <div className="card-num">{item.num}</div>
                <p className="card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Три шага. Шестьдесят секунд.</h2>
          <div className="grid-3">
            {[
              { n: "01", title: "Вставь ссылку", text: "YouTube, статья, подкаст — любая ссылка или просто текст." },
              { n: "02", title: "Выбери платформы", text: "X, LinkedIn, TikTok, Telegram, email. Тональность — экспертная, дружеская или провокационная." },
              { n: "03", title: "Забирай контент", text: "30+ готовых единиц. Копируй, редактируй, публикуй." },
            ].map((step) => (
              <div key={step.n} className="card card-hover">
                <div className="card-num-tag">{step.n}</div>
                <h3 className="card-title">{step.title}</h3>
                <p className="card-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="press">
        <div className="press-inner">
          <p className="press-title">О нас пишут</p>
          <div className="press-logos">
            <span className="press-logo">Product Hunt</span>
            <span className="press-logo">Indie Hackers</span>
            <span className="press-logo">TechCrunch</span>
            <span className="press-logo">Hacker News</span>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">
            Так выглядит <span className="section-title-accent">результат</span>
          </h2>
          <div className="demo-posts">
            <div className="demo-post">
              <div className="demo-post-head">
                <div className="demo-post-avatar">АК</div>
                <div>
                  <div className="demo-post-user">Алексей Козлов</div>
                  <div className="demo-post-handle">@alexkozlov</div>
                </div>
                <span className="demo-post-badge demo-post-badge-x">X</span>
              </div>
              <p className="demo-post-text">
                {`Большинство маркетологов тратят 80% времени на рутину и только 20% — на стратегию.

Переверните это соотношение. Автоматизируйте репурпозинг — и высвободите 8 часов в неделю.

Что бы вы сделали с этими часами?`}
              </p>
              <div className="demo-post-footer">
                <span>💬 24</span>
                <span>🔁 47</span>
                <span>❤️ 312</span>
              </div>
            </div>

            <div className="demo-post">
              <div className="demo-post-head">
                <div className="demo-post-avatar">МС</div>
                <div>
                  <div className="demo-post-user">Мария Соколова</div>
                  <div className="demo-post-handle">Контент-стратег</div>
                </div>
                <span className="demo-post-badge demo-post-badge-li">in</span>
              </div>
              <p className="demo-post-text">
                {`За последние 3 месяца я протестировала 12 инструментов для репурпозинга.

7 из них — перегруженные и сложные. 4 — слишком дорогие. И только 1 подошёл для solo-режима.

Что важно, если вы работаете один:
→ Одно поле ввода вместо 10 настроек
→ Результат за 60 секунд, а не за 6 минут
→ Цена, а не подписка на год вперёд

Инструменты должны работать на вас, а не наоборот.`}
              </p>
              <div className="demo-post-footer">
                <span>💬 89</span>
                <span>🔁 134</span>
                <span>❤️ 891</span>
              </div>
            </div>

            <div className="demo-post">
              <div className="demo-post-head">
                <div className="demo-post-avatar">DR</div>
                <div>
                  <div className="demo-post-user">Дмитрий Р.</div>
                  <div className="demo-post-handle">канал «Рост»</div>
                </div>
                <span className="demo-post-badge demo-post-badge-tg">TG</span>
              </div>
              <p className="demo-post-text">
                {`Вчера записал 40-минутный подкаст.

Через 2 минуты получил:
• 5 постов для X
• 3 поста для LinkedIn  
• 2 сценария для Reels
• 1 email-рассылку
• 3 поста для Telegram

Раньше на это уходил весь вечер.

Сейчас — кофе допить не успел.`}
              </p>
              <div className="demo-post-footer">
                <span>👁 2.4K</span>
                <span>❤️ 187</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="section-inner">
          <h2 className="section-title">Всё, что нужно соло-мейкеру</h2>
          <div className="grid-3-cards">
            {[
              { icon: "⚡", title: "Один клик", text: "Не нужно настраивать пайплайны и шаблоны." },
              { icon: "🌍", title: "Мультиязычность", text: "12 языков из коробки." },
              { icon: "🎯", title: "Тональность", text: "Экспертная, дружеская или провокационная." },
              { icon: "📦", title: "Экспорт в Notion", text: "Или скачивание как .md одним кликом." },
              { icon: "💸", title: "790 ₽ вместо 5 000 ₽", text: "В 6 раз дешевле конкурентов." },
              { icon: "🔒", title: "Твои данные — твои", text: "Не обучаем модели на твоём контенте." },
            ].map((f) => (
              <div key={f.title} className="card card-hover">
                <div className="card-icon">{f.icon}</div>
                <h3 className="card-title">{f.title}</h3>
                <p className="card-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section">
        <div className="section-inner">
          <h2 className="section-title">Простая цена. Без сюрпризов.</h2>
          <div className="pricing-grid">
            <div className="price-card">
              <h3 className="price-name">Free</h3>
              <div className="price-value"><strong>0 ₽</strong><span>/мес</span></div>
              <p className="price-desc">Попробовать без карты</p>
              <ul className="price-features">
                <li>3 генерации всего</li>
                <li>Все платформы</li>
                <li>Без экспорта</li>
              </ul>
              <a href="/signup" className="price-btn">Начать</a>
            </div>

            <div className="price-card price-card-featured">
              <span className="price-tag">Популярный</span>
              <h3 className="price-name price-name-accent">Pro</h3>
              <div className="price-value"><strong>790 ₽</strong><span>/мес</span></div>
              <p className="price-desc">Для соло-мейкеров</p>
              <ul className="price-features">
                <li>100 генераций в месяц</li>
                <li>Экспорт в Notion и .md</li>
                <li>Мультиязычность</li>
                <li>Приоритетная поддержка</li>
              </ul>
              <a href="/signup?plan=pro" className="price-btn-primary">Оформить Pro</a>
            </div>

            <div className="price-card">
              <h3 className="price-name">Agency</h3>
              <div className="price-value"><strong>2 490 ₽</strong><span>/мес</span></div>
              <p className="price-desc">Для фрилансеров с клиентами</p>
              <ul className="price-features">
                <li>500 генераций в месяц</li>
                <li>API-доступ</li>
                <li>White-label отчёты</li>
              </ul>
              <a href="/signup?plan=agency" className="price-btn">Оформить Agency</a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">
            Что говорят <span className="section-title-accent">пользователи</span>
          </h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                Раньше я тратила весь вторник на адаптацию одного видео. Сейчас
                это 3 минуты. Просто вставила ссылку — и получила весь контент
                на неделю. Это меняет правила игры.
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">ЕВ</div>
                <div>
                  <div className="testimonial-name">Елена Волкова</div>
                  <div className="testimonial-role">Коуч, 8K подписчиков</div>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                Пробовал Opus Clip и Repurpose.io — оба требовали столько
                настройки, что проще было написать всё самому. Здесь одно поле
                ввода. Вставил, получил, опубликовал. Ровно то, что нужно
                соло-маркетологу.
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">МП</div>
                <div>
                  <div className="testimonial-name">Максим Петров</div>
                  <div className="testimonial-role">Solo-маркетолог</div>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                За 790 ₽ получаю то, за что раньше
                платила 5 000 ₽ и всё равно дописывала
                руками. Мультиязычность — отдельный кайф: веду
                каналы на русском и английском, генерирую параллельно.
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">АС</div>
                <div>
                  <div className="testimonial-name">Анна Смирнова</div>
                  <div className="testimonial-role">Инфобизнес, 2 канала</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="section-inner">
          <h2 className="section-title">Частые вопросы</h2>
          <div className="faq-list">
            {[
              { q: "Работает ли с русскоязычными видео?", a: "Да. Whisper отлично транскрибирует русский, украинский, казахский." },
              { q: "Что если видео длинное — 2 часа?", a: "Берём первые 15 минут — оптимальный объём для репурпозинга." },
              { q: "Можно отменить подписку?", a: "Да, в один клик в личном кабинете." },
              { q: "Вы обучаете модели на моём контенте?", a: "Нет. OpenAI API не использует данные из API для обучения." },
            ].map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-cta">
            <h2>Готов сэкономить 8 часов в неделю?</h2>
            <a href="/signup">Попробовать бесплатно</a>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Repurpose.ai</span>
            <nav className="footer-links">
              <a href="/privacy">Конфиденциальность</a>
              <a href="/terms">Условия</a>
              <a href="mailto:hello@repurpose.ai">hello@repurpose.ai</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}