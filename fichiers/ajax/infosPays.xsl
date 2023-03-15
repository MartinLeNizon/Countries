<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="param_ref_type"/>
    <xsl:param name="param_ref_type2"/>
	
		<xsl:template match="/">
			<HTML>
				<BODY>
					<element_a_recuperer>                      

                        <table border="3" width="100%" align="center">
                            <th>name</th>
                            <th>capital</th>
                            <th>languages spoken</th>
                            <th>flag</th>
                            <xsl:if test="$param_ref_type2 = true()">
                                <th>currency</th>
                            </xsl:if> 
                            <tr>
                                <td id="country_name"><xsl:value-of select="//country[country_name/common_name = $param_ref_type]/country_name/common_name"/></td>
                                <td id="country_capital"><xsl:value-of select="//country[country_name/common_name = $param_ref_type]/capital"/></td>
                                <td id="country_spoken_languages">
                                    <xsl:for-each select="//country[country_name/common_name = $param_ref_type]/languages/*">
                                        <xsl:value-of select="current()"/> (<xsl:value-of select="name()"/>)
                                        <xsl:if test="not(position()=last())">
                                            <span>, </span>
                                        </xsl:if>
                                    </xsl:for-each>
                                </td>
                                <td id="country_flag">
                                    <img src="http://www.geonames.org/flags/x/{translate(//country[country_name/common_name = $param_ref_type]/country_codes/cca2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')}.gif" alt="{.} flag" width="60" height="40" />
                                </td>
                                <xsl:if test="$param_ref_type2 = true()">
                                    <td id="country_currency"><xsl:value-of select="//country[country_name/common_name = $param_ref_type]/currency"/></td>
                                </xsl:if>  
                            </tr>
                        </table>

                        <br/>
                        <br/>
					</element_a_recuperer>
				</BODY>
			</HTML>
		</xsl:template>
	
</xsl:stylesheet>


