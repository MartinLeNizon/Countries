<?xml version="1.0" encoding="UTF-8"?>

<!-- New document created with EditiX at Fri Mar 17 15:42:42 CET 2017 -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:template match="/">
		<html>
			<head>
				<title>Countries of the world</title>
			</head>
			<body style="background-color:white;">
				<h1>Countries of the world</h1>
				<h2>Mise en forme par : </h2>
				<p>Mathis NGUYEN, Martin NIZON (B3427)</p>
				<xsl:apply-templates select="//metadonnees"/>
				<p>Continents (continents) :
					<xsl:for-each select="(//continent[not(text()=preceding::continent/text())])[position() &lt; count(//continent[not(self::*=../preceding::*)])+2]">
						<xsl:if test="node()">
							<xsl:value-of select="current()"/>
						</xsl:if>
						<xsl:if test="not(node())">
							No continent
						</xsl:if>
						(<xsl:value-of select="count(//country[continent=current()])"/> pays),
         					</xsl:for-each>
				</p>
				<p>
         					Le pays ayant le plus de voisins frontaliers est : 
         					
         					<xsl:for-each select="//country">
         						<xsl:sort select="count(borders)" data-type="number" order="descending"/>
         						<xsl:if test="position()=1">
         							<xsl:value-of select="name/common"/> (<xsl:value-of select="count(borders)"/>)
         						</xsl:if>
         					</xsl:for-each>
         					
         					
         				
    				 </p>
				<xsl:for-each select="(//continent[not(text()=preceding::continent/text())])[position() &lt; count(//continent[not(self::*=../preceding::*)])+2]">
					<xsl:variable name="tmpcontinent" select="current()"/>
					<br/>
					<h3>Pays du continent : <xsl:value-of select="current()"/> par sous-régions : </h3>
					<xsl:if test="$tmpcontinent!=''">
						<xsl:for-each select="//subcontinent[not(text()=preceding::subcontinent/text())]">
							<xsl:if test="current()/../continent = $tmpcontinent">
								<xsl:apply-templates select="current()"/>
							</xsl:if>
						</xsl:for-each>
					</xsl:if>
					<xsl:if test="$tmpcontinent=''">
						<xsl:apply-templates select="(//subcontinent[.=''])[position()&lt; 2]"/>
					</xsl:if>
				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="metadonnees">
		<p style="text-align:center; color:blue;">
			Objectif : <xsl:value-of select="objectif"/>
		</p>
		<hr/>
	</xsl:template>
	<xsl:template name="latlng">
		<xsl:text>Latitude : </xsl:text>
		<xsl:value-of select="latlng[1]"/>
		<br/>
		<xsl:text>Longitude : </xsl:text>
		<xsl:value-of select="latlng[2]"/>
	</xsl:template>
	<xsl:template match="//subcontinent">
		<h4>
			<xsl:value-of select="current()"/>
		</h4>
		<table border="3" width="600" align="center">
			<tr>
				<th>Num</th>
				<th>Nom</th>
				<th>Capitale</th>
				<th>Voisins</th>
				<th>Coordonnees</th>
				<th>Drapeau</th>
			</tr>
			<xsl:apply-templates select="//country[infosContinent/subcontinent=current()]"/>
		</table>
	</xsl:template>
	<xsl:template match="//country"><!-- <xsl:for-each select="//country"> -->
		<tr>
			<td>
				<xsl:value-of select="position()"/>
			</td>
			<td>
				<span style="color:green">
					<xsl:value-of select="name/common"/>
				</span>
				<xsl:text> (</xsl:text>
				<xsl:value-of select="name/official"/>
				<xsl:text>)</xsl:text>
				<br/>
				<xsl:if test="name/native_name/@lang = 'fra'">
					<span style="color:brown">
						<xsl:text> Nom français : </xsl:text>
						<xsl:value-of select="name/native_name[@lang='fra']/official"/>
					</span>
				</xsl:if>
			</td>
			<td>
				<xsl:value-of select="capital"/>
			</td>
			<td>
				<xsl:if test="count(borders) &gt; 0">
					<xsl:for-each select="borders">
						<xsl:value-of select="//country[cca3=current()]/name/common"/>
						<xsl:if test="position() != last() ">
							<xsl:text>, </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:if>
			</td>
			<td>
				<xsl:call-template name="latlng"/>
			</td>
			<td>
				<xsl:element name="img">
					<xsl:attribute name="src">
						<xsl:text>http://www.geonames.org/flags/x/</xsl:text>
						<xsl:value-of select="translate(cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')"/>
						<xsl:text>.gif</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="alt"/>
					<xsl:attribute name="height">40</xsl:attribute>
					<xsl:attribute name="width">60</xsl:attribute>
				</xsl:element>
			</td>
		</tr><!-- </xsl:for-each> -->
	</xsl:template>
</xsl:stylesheet>





<xsl:for-each-group select="country/infosContinent/continent" group-adjacent=".">
      <xsl:variable name="current-continent" select="."/>
      <xsl:for-each select="current-group()">
        <!-- This loop will only iterate once for each group of items with the same category -->
        <xsl:if test="position() = 1">
          <p><xsl:value-of select="$current-continent"/></p>
            <!-- <xsl:apply-templates select="."/> -->
        </xsl:if>
      </xsl:for-each>

      <!-- <xsl:if test="current()/tld"> -->

      <!-- <xsl:value-of select="current()/tld"/>
      <br/> -->
    </xsl:for-each-group>