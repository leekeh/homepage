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