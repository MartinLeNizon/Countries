<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	
		<xsl:template match="/">
			<HTML>
				<BODY bgcolor="#FFFFCC">
					<H1>Bibliographie</H1>
					<element_a_recuperer>
						<ul>
							<xsl:apply-templates select="//BibRef"/>
						</ul>
					</element_a_recuperer>
				</BODY>
			</HTML>
		</xsl:template>
		<xsl:template match="BibRef">
			<LI>
				<xsl:value-of select=".//Author"/>:
  		                             <xsl:value-of select=".//Title"/>.     
 		              </LI>
		</xsl:template>
	
</xsl:stylesheet>
