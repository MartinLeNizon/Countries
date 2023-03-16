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
        <xsl:apply-templates select="//metadonnees"/>
        <p>Styled by: Mathis NGUYEN, Martin NIZON (B3427)</p>

        <hr/>
        <p> Countries where more than 2 languages are spoken:</p>
          <xsl:for-each select="//country[count(languages/*) &gt; 2]">
            <li> -
              <xsl:value-of select="./country_name/common_name"/>
              :
                <xsl:for-each select="./languages/*">
                  <xsl:value-of select="."/>
                  (<xsl:value-of select="name()"/>)
                  <xsl:if test="not(position()=last())">
                    <span>, </span>
                  </xsl:if>
                </xsl:for-each>
            </li>
          </xsl:for-each>

        <p> Countries having the most neighbours:
          <xsl:for-each select="//country">
            <xsl:sort select="count(borders/neighbour)" data-type="number" order="descending"/>
            <xsl:if test="position() = 1">
              <xsl:value-of select="./country_name/common_name"/> 
              with <xsl:value-of select="count(borders/neighbour)"/>
              neighbours
            </xsl:if>
          </xsl:for-each>
        </p>


        <xsl:for-each select="//continent[not(text()=preceding::continent/text())]">
          <xsl:if test="string-length(current()) &gt; 0">
            <h3> Pays du continent :
            <xsl:value-of select="current()"/>
            par sous régions : </h3>

            <xsl:for-each select="//infosContinent[continent = current()]/subregion[not(text()=preceding::subregion/text())]">
              <h4> 
              <xsl:value-of select="current()"/>
              (<xsl:value-of select="count(//country[infosContinent/subregion = current()])"/> pays) </h4>
                  <table border="3" width="100%" align="center">
                    <th>N°</th>
                    <th>Name</th>
                    <th>Capital</th>
                    <th>Coordinates</th>
                    <th>Neighbour</th>
                    <th>Flag</th>
                    <th>Spoken languages</th>
                    <xsl:apply-templates select="//country[infosContinent/subregion = current()]"/>
                  </table>
            </xsl:for-each>
          </xsl:if>
        </xsl:for-each>
        

        

      </body> 
    </html> 
  </xsl:template>

  

  <xsl:template match="metadonnees">
    <p style="text-align:center; color:green;">
      Objectif : <xsl:value-of select="objectif"/>
    </p><hr/>
  </xsl:template>


  <xsl:template match="country">
    <tr>
      <td><xsl:value-of select="position()"/></td>
      <td><xsl:apply-templates select="country_name"/></td>
      <td><xsl:apply-templates select="capital"/></td>
      <td><xsl:apply-templates select="coordinates"/></td>
      <td>
        <xsl:apply-templates select="borders"/>
        <xsl:if test="count(borders)=0 and landlocked ='false'">
        <p>Island</p>
        </xsl:if>
      </td>
      <td><xsl:apply-templates select="country_codes"/></td>
      <td><xsl:apply-templates select="languages"/></td>
    </tr>
  </xsl:template>


  <xsl:template match="country_name">
    <p>
      <span style="color:green">
        <xsl:value-of select="offic_name"/>
      </span>
       (<xsl:value-of select="common_name"/>) 
    </p>
    <xsl:if test="string-length(native_name[@lang='fra']/offic_name) &gt; 0">
      <p style="color:blue">
        Nom Français : 
        <xsl:value-of select="native_name[@lang='fra']/offic_name"/>
      </p>
    </xsl:if>
  </xsl:template>


  <xsl:template match="capital">
    <p>
      <xsl:value-of select="."/>
    </p>
  </xsl:template>
  

  <xsl:template match="coordinates">
    <p>
      Latitude : <xsl:value-of select="@lat"/>
      <br/>
      Longitude : <xsl:value-of select="@long"/>
    </p>
  </xsl:template>


  <xsl:template match="borders">
    <p>
      <xsl:for-each select="//country[ country_codes/cca3 = current()/neighbour ]/country_name/common_name">
        <xsl:value-of select="."/>
        <xsl:if test="not(position()=last())">
          <span>, </span>
        </xsl:if>
      </xsl:for-each>
    </p>
  </xsl:template>

  <xsl:template match="country_codes">
    <xsl:variable name="cca2m" select="translate(cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
    <img src="http://geonames.org/flags/x/{$cca2m}.gif" alt="" height="40" width="60">
    </img>
  </xsl:template>

  <xsl:template match="languages">
    <p>
      <xsl:for-each select="current()/child::*">
        <xsl:value-of select="."/>
        <xsl:if test="not(position()=last())">
          <span>, </span>
        </xsl:if>
      </xsl:for-each>
      
    </p>
  </xsl:template>





</xsl:stylesheet>