<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body { font-family: Arial, sans-serif; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 10px 0; }
          strong { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <ul>
          <xsl:for-each select="urlset/url">
            <li>
              <strong><xsl:value-of select="loc" /></strong><br/>
              <span>Changefreq: <xsl:value-of select="changefreq" /></span><br/>
              <span>Priority: <xsl:value-of select="priority" /></span>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
