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

        <table border="3" width="600" align="center">
          <xsl:apply-templates select="//country"/>
        </table>

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
      <td><xsl:apply-templates select="country_name"/></td>
      <td><xsl:apply-templates select="capital"/></td>
      <td><xsl:apply-templates select="coordinates"/></td>
      <td><xsl:apply-templates select="borders"/></td>
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
      
      <!-- <xsl:if test="count(neighbour)=0">
        Bonjoru
      </xsl:if> -->
    </p>
  </xsl:template>



</xsl:stylesheet>