<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="param_ref_type" select="toto"/>
	
	<xsl:template match="/">
		<HTML>
			<BODY bgcolor="#FFFFCC">
				<H1>Bibliographie</H1>
				<element_a_recuperer>
					<ul><!-- on cherche les références bibliographiques dont la balise contient la valeur du paramètre-->
						<xsl:apply-templates select="//BibRef/*[contains(local-name(),$param_ref_type)]/.."/>
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
