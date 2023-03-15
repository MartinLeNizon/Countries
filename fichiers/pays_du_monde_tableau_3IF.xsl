<?xml version = "1.0" encoding = "UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />

  <xsl:template match="/"> 
    <html> 
      <head> 
        <title> 
            <p>Countries of the world</p>
        </title> 
      </head> 

      
      <body style="background-color:white;"> 
        <h1>Information about the countries</h1> 
        <xsl:apply-templates select="//metadonnees" />
        <p>Styled by: Mathis NGUYEN, Martin NIZON (B3427)</p>

        <p>Countries where more than 2 languages are spoken:</p>
        <xsl:for-each select="//country[count(languages/descendant::*) &gt; 2]">
          <p>
            <xsl:value-of select="country_name/common_name"/>: 
            <xsl:for-each select="languages/*">
              <xsl:value-of select="current()"/> (<xsl:value-of select="name()"/>)
              <xsl:if test="not(position()=last())">
                <span>, </span>
              </xsl:if>
            </xsl:for-each>
          </p>
       
        </xsl:for-each>

        
        <xsl:variable name="max-neighbor-count">
          <xsl:for-each select="//country">
            <xsl:sort select="count(borders/neighbour)" data-type="number" order="descending"/>
            <xsl:if test="position() = 1">
              <xsl:copy-of select="count(borders/neighbour)"/>
            </xsl:if>
          </xsl:for-each>
        </xsl:variable>

        
        <p>
          Countries having the most neighbors (with <xsl:value-of select="$max-neighbor-count"/> neighbors):
          <xsl:for-each select="//country">
            <xsl:if test="count(borders/neighbour) = $max-neighbor-count">
                <xsl:value-of select="country_name/common_name"/>             
            </xsl:if>
          </xsl:for-each>

         
        </p>


        <xsl:apply-templates select="//countries" />

      </body> 
    </html> 
  </xsl:template>
  

  <xsl:template match="metadonnees">
    <p style="text-align:center; color:green;">
      Objectif : <xsl:value-of select="objectif" />
    </p><hr/>
  </xsl:template>


  <xsl:template match="countries">

    <xsl:for-each select="country/infosContinent/continent">
      <xsl:if test="not(. = preceding::continent)">
        <xsl:variable name="current-continent" select="."/>
        <h3>Countries of the continent <xsl:value-of select="."/> by subregions:</h3>

        <xsl:for-each select="../../../country/infosContinent/subregion">
          <xsl:if test="not(. = preceding::subregion) and ../continent=$current-continent">
            <xsl:variable name="current-subregion" select="."/>
            <h4><xsl:value-of select="."/> (<xsl:value-of select="count(//country[infosContinent/subregion=$current-subregion])"/> pays)</h4>

            <table border="3" width="600" align="center">
              <tr>
                <th>N°</th>
                <th>Name</th>
                <th>Capital</th>
                <th>Coordinates</th>
                <th>Neighbors</th>
                <th>Flag</th>
                <th>Spoken Language(s)</th>
              </tr>
              <xsl:for-each select="//country">
                <xsl:if test="infosContinent/subregion = $current-subregion">
                  <xsl:apply-templates select="."/>
                </xsl:if>
              </xsl:for-each>
            </table>
            
          </xsl:if>
        </xsl:for-each>

      </xsl:if>
    </xsl:for-each>

      


  </xsl:template>


  <xsl:template match="country">
    <tr>
      <td><xsl:value-of select="count(preceding-sibling::country)+1"/></td>
      <td><xsl:apply-templates select="country_name" /></td>
      <td><xsl:apply-templates select="capital" /></td>
      <td><xsl:apply-templates select="coordinates" /></td>
      <td>
        <xsl:apply-templates select="borders" />
        <xsl:if test="(count(borders)=0) and landlocked='false'">
          Island
        </xsl:if>
      </td>
      <td><xsl:apply-templates select="country_codes/cca2" /></td>
      <td><xsl:apply-templates select="languages" /></td>
    </tr>
  </xsl:template>


  <xsl:template match="country_name">
    <p>
      <span style="color:green">
        <xsl:value-of select="offic_name" />
      </span>
       (<xsl:value-of select="common_name" />) 
    </p>
    <xsl:if test="string-length(native_name[@lang='fra']/offic_name) &gt; 0">
      <p style="color:blue">
        Nom Français : 
        <xsl:value-of select="native_name[@lang='fra']/offic_name" />
      </p>
    </xsl:if>
  </xsl:template>


  <xsl:template match="capital">
    <p>
      <xsl:value-of select="." />
    </p>
  </xsl:template>
  

  <xsl:template match="coordinates">
    <p>
      Latitude : <xsl:value-of select="@lat" />
      <br/>
      Longitude : <xsl:value-of select="@long" />
    </p>
  </xsl:template>


  <xsl:template match="borders">
    <p>
      <xsl:for-each select="//country[ country_codes/cca3 = current()/neighbour ]/country_name/common_name">
        <xsl:value-of select="." />
        <xsl:if test="not(position()=last())">
          <span>, </span>
        </xsl:if>
      </xsl:for-each>
      
    </p>
  </xsl:template>


  <xsl:template match="country_codes/cca2">
      <img src="http://www.geonames.org/flags/x/{translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')}.gif" alt="{.} flag" width="60" height="40" />
  </xsl:template>


  <xsl:template match="languages">
    <p>
      <xsl:for-each select="descendant::*">
        <xsl:value-of select="." />
        <xsl:if test="not(position()=last())">
          <span>, </span>
        </xsl:if>
      </xsl:for-each>
    </p>
  </xsl:template>



</xsl:stylesheet>