<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>
          <xsl:value-of select="/rss/channel/title" />
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          :root {
            color-scheme: light;
            --bg: #eef3e8;
            --surface: #f8fbf5;
            --surface-strong: #dbe8d1;
            --border-light: #ffffff;
            --border-dark: #3d5038;
            --text: #1c2917;
            --muted: #5b7054;
            --accent: #295f3a;
            --accent-soft: #d5e9d7;
            --link: #003ea8;
            --shadow: rgba(20, 36, 18, 0.18);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            font-family: "Verdana", "Geneva", sans-serif;
            color: var(--text);
            background:
              radial-gradient(circle at top left, rgba(255, 255, 255, 0.8), transparent 24%),
              linear-gradient(180deg, #dbeccf 0%, var(--bg) 28%, #d5e1ca 100%);
          }

          a {
            color: var(--link);
          }

          .shell {
            width: min(100%, 980px);
            margin: 0 auto;
            padding: 32px 20px 48px;
          }

          .window {
            border: 2px solid;
            border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light);
            background: var(--surface);
            box-shadow: 8px 8px 0 var(--shadow);
          }

          .titlebar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 10px;
            color: #f4fff6;
            background: linear-gradient(90deg, #1d4e32 0%, #5b8f55 100%);
            border-bottom: 2px solid #24361f;
          }

          .titlebar strong {
            font-size: 14px;
            letter-spacing: 0.02em;
          }

          .chrome {
            display: inline-flex;
            gap: 6px;
            flex-shrink: 0;
          }

          .chrome span {
            width: 16px;
            height: 16px;
            border: 2px solid;
            border-color: #eaffea #1f301c #1f301c #eaffea;
            background: #d8ecd4;
          }

          .content {
            padding: 18px;
          }

          .intro {
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.9fr);
            gap: 16px;
            margin-bottom: 18px;
          }

          .panel {
            padding: 16px;
            border: 2px solid;
            border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(219, 232, 209, 0.55));
          }

          h1,
          h2,
          p {
            margin-top: 0;
          }

          h1 {
            margin-bottom: 10px;
            font-size: clamp(28px, 4vw, 42px);
            line-height: 1;
          }

          h2 {
            margin-bottom: 12px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .lede,
          .meta,
          .empty {
            color: var(--muted);
            line-height: 1.6;
          }

          .feed-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 14px;
          }

          .button {
            display: inline-block;
            padding: 8px 12px;
            border: 2px solid;
            border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light);
            background: var(--surface-strong);
            color: var(--text);
            text-decoration: none;
            font-weight: 700;
          }

          .button.secondary {
            background: var(--accent-soft);
          }

          .items {
            display: grid;
            gap: 12px;
          }

          .item {
            padding: 14px;
            border: 2px solid;
            border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light);
            background: #fcfef9;
          }

          .item-top {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 8px;
          }

          .item-title {
            font-size: 20px;
            font-weight: 700;
            text-decoration: none;
          }

          .item-date {
            color: var(--muted);
            white-space: nowrap;
            font-size: 13px;
          }

          .item-description {
            margin-bottom: 10px;
            line-height: 1.6;
          }

          .categories {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .categories li {
            padding: 4px 8px;
            background: var(--accent-soft);
            border: 1px solid #88a686;
            font-size: 12px;
            text-transform: lowercase;
          }

          .footer {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px dashed #7f9675;
            color: var(--muted);
            font-size: 13px;
          }

          code {
            padding: 1px 4px;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid #a0b79c;
          }

          @media (max-width: 700px) {
            .shell {
              padding-inline: 12px;
            }

            .intro {
              grid-template-columns: 1fr;
            }

            .item-top {
              display: block;
            }

            .item-date {
              display: block;
              margin-top: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="shell">
          <div class="window">
            <div class="titlebar">
              <strong>
                <xsl:value-of select="/rss/channel/title" />
              </strong>
              <div class="chrome" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="content">
              <div class="intro">
                <section class="panel">
                  <h1>
                    <xsl:value-of select="/rss/channel/title" />
                  </h1>
                  <p class="lede">
                    <xsl:value-of select="/rss/channel/description" />
                  </p>
                  <div class="feed-actions">
                    <a class="button secondary">
                      <xsl:attribute name="href">
                        <xsl:value-of select="/rss/channel/link" />
                      </xsl:attribute>
                      Visit site
                    </a>
                    <a class="button">
                      <xsl:attribute name="href">
                        <xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href" />
                      </xsl:attribute>
                      Copy feed URL
                    </a>
                  </div>
                </section>

                <aside class="panel">
                  <h2>How to use this</h2>
                  <p class="meta">
                    This page is a styled view of the RSS feed. Paste the feed URL into your reader, or open the page source if you want the raw XML.
                  </p>
                  <p class="meta">
                    Updated:
                    <xsl:text> </xsl:text>
                    <xsl:value-of select="/rss/channel/lastBuildDate" />
                  </p>
                  <p class="meta">
                    Format:
                    <xsl:text> </xsl:text>
                    <code>RSS 2.0 + XSL</code>
                  </p>
                </aside>
              </div>

              <section class="items">
                <xsl:choose>
                  <xsl:when test="count(/rss/channel/item) &gt; 0">
                    <xsl:for-each select="/rss/channel/item">
                      <article class="item">
                        <div class="item-top">
                          <a class="item-title">
                            <xsl:attribute name="href">
                              <xsl:value-of select="link" />
                            </xsl:attribute>
                            <xsl:value-of select="title" />
                          </a>
                          <time class="item-date">
                            <xsl:value-of select="pubDate" />
                          </time>
                        </div>

                        <p class="item-description">
                          <xsl:value-of select="description" />
                        </p>

                        <xsl:if test="count(category) &gt; 0">
                          <ul class="categories">
                            <xsl:for-each select="category">
                              <li>
                                <xsl:value-of select="." />
                              </li>
                            </xsl:for-each>
                          </ul>
                        </xsl:if>
                      </article>
                    </xsl:for-each>
                  </xsl:when>
                  <xsl:otherwise>
                    <p class="empty">This feed does not contain any items yet.</p>
                  </xsl:otherwise>
                </xsl:choose>
              </section>

              <p class="footer">
                RSS readers still get the original XML. Browsers get this playful retro shell on top.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>