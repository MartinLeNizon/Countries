<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="param_ref_type"/>
	
		<xsl:template match="/">
			<HTML>
				<BODY>
					<H1>infos du Pays Recherché</H1>
					<element_a_recuperer>
                        <xsl:value-of select="//country[country_codes/cca2 = $param_ref_type]/country_name/common_name"/>
                        <span>, </span>
                        <xsl:value-of select="//country[country_codes/cca2 = $param_ref_type]/capital"/>
					</element_a_recuperer>
				</BODY>
			</HTML>
		</xsl:template>
	
</xsl:stylesheet>


