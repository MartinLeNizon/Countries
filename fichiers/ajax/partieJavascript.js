var currencyEnable = false;

function changePageBackgroundAndButtonTextColor(pageBgColor, buttonTextColor) {
    document.body.style.background = pageBgColor;
    document.getElementById("myButton1").style.color = buttonTextColor;
}

function resetBackground() {
    document.body.style.background = 'white';
}

function infosCountry(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, paramXSL_type_reference, idInfosEspace, currencyEnable) {

    // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone 
    var xslDocument = chargerHttpXML(xslDocumentUrl);

	//création d'un processuer XSL
    var xsltProcessor = new XSLTProcessor();

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);

	//passage du paramètre à la feuille de style
	xsltProcessor.setParameter("", "param_ref_type", paramXSL_type_reference);

    //passage du paramètre à la feuille de style
	xsltProcessor.setParameter("", "param_ref_type2", currencyEnable);

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Création du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(idInfosEspace);
    
	// insérer l'élement transformé dans la page html
    elementHtmlParent.innerHTML=newXmlDocument.getElementsByTagName(baliseElementARecuperer)[0].innerHTML;
}

function displaySvgDrawing(xmlDocumentUrl, espace_drawing) {

    // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Serialize the XML into a string
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(espace_drawing);
    
	// ins�rer l'�lement transform� dans la page html
    elementHtmlParent.innerHTML=svgString;
}

function makeSvgClickable(espace_drawing, espace_infos, element_clickable) {
    // Get the SVG element
    var svgElement = document.getElementById(espace_drawing);

    // Get all circle, rectangle, and path elements in the SVG
    var clickableElements = svgElement.querySelectorAll('circle, rect, path');

    // Attach a click event listener to each element
    clickableElements.forEach(function(element) {
        element.addEventListener('click', function() {
            // Get the value of the "title" attribute
            var title = element.getAttribute(element_clickable);
            var elementHtmlParent = window.document.getElementById(espace_infos);
            elementHtmlParent.innerHTML = title;
        });
    });
}

function infosCountryOnMouseOver(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, idEspace, currencyEnable) {

    // infosCountry(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, paramXSL_type_reference, idEspace)


    // Get the SVG element
    var svgElement = document.getElementById("espace_svg_map");

    // Get all path elements in the SVG
    var clickableElements = svgElement.querySelectorAll('path');

    // Attach a click event listener to each element
    clickableElements.forEach(function(element) {
        element.addEventListener('mouseover', function() {
            infosCountry(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, this.getAttribute('countryname'), idEspace, currencyEnable);
            element.classList.remove('land');
            element.setAttribute("fill", "red")
        });
        
        element.addEventListener('mouseleave', function() {
            var elementHtmlParent = window.document.getElementById("country_name");
            elementHtmlParent.innerHTML = "";
            elementHtmlParent = window.document.getElementById("country_capital");
            elementHtmlParent.innerHTML = "";
            elementHtmlParent = window.document.getElementById("country_spoken_languages");
            elementHtmlParent.innerHTML = "";
            elementHtmlParent = window.document.getElementById("country_flag");
            elementHtmlParent.innerHTML = "";
            if (currencyEnable) {
                elementHtmlParent = window.document.getElementById("country_currency");
                elementHtmlParent.innerHTML = "";
            }
            element.classList.remove('land');
            element.setAttribute("fill", "#CCCCCC")

        });
    });
}

function autoComplete() {
}

function addCurrency() {
    currencyEnable = true;
}

function colorLanguage() {

}




























//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function recupererPremierEnfantDeTypeElement(n) {
    var x = n.firstChild;
    while (x.nodeType != 1) { // Test if x is an element node (and not a text node or other)
        x = x.nextSibling;
    }
    return x;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change le contenu de l'�lement avec l'id "nom" avec la chaine de caract�res en param�tre	  
function setNom(nom) {
    var elementHtmlARemplir = window.document.getElementById("id_nom_a_remplacer");
    elementHtmlARemplir.innerHTML = nom;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant � l'URL relative donn� dans le param�treet le retourne
function chargerHttpXML(xmlDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
// Charge le fichier JSON se trouvant � l'URL donn�e en param�tre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    // chargement du fichier JSON � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
    httpAjax.open('GET', jsonDocumentUrl, false);
    httpAjax.send();

    var responseData = eval("(" + httpAjax.responseText + ")");

    return responseData;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton2_ajaxEmployees(xmlDocumentUrl) {


    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    //extraction des noms � partir du document XML (avec une feuille de style ou en javascript)
    var lesNoms = xmlDocument.getElementsByTagName("LastName");

    // Parcours de la liste des noms avec une boucle for et 
    // construction d'une chaine de charact�res contenant les noms s�par�s par des espaces 
    // Pour avoir la longueur d'une liste : attribut 'length'
    // Acc�s au texte d'un noeud "LastName" : NOM_NOEUD.firstChild.nodeValue
    var chaineDesNoms = "";
    for (i = 0; i < lesNoms.length; i++) {
        if (i > 0) {
            chaineDesNoms = chaineDesNoms + ", ";
        }
        chaineDesNoms = chaineDesNoms + lesNoms[i].firstChild.nodeValue + " ";
    }


    // Appel (ou recopie) de la fonction setNom(...) ou bien autre fa�on de modifier le texte de l'�l�ment "span"
    setNom(chaineDesNoms);



}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton3_ajaxBibliographie(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer) {

    // Chargement du fichier XSL � l'aide de XMLHttpRequest synchrone 
    var xslDocument = chargerHttpXML(xslDocumentUrl);

	//cr�ation d'un processuer XSL
    var xsltProcessor = new XSLTProcessor();

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);

    // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Cr�ation du document XML transform� par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById("id_element_a_remplacer");
    
	// ins�rer l'�lement transform� dans la page html
    elementHtmlParent.innerHTML=newXmlDocument.getElementsByTagName(baliseElementARecuperer)[0].innerHTML;
	

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxBibliographieAvecParametres(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, paramXSL_type_reference) {

    // Chargement du fichier XSL � l'aide de XMLHttpRequest synchrone 
    var xslDocument = chargerHttpXML(xslDocumentUrl);

	//cr�ation d'un processuer XSL
    var xsltProcessor = new XSLTProcessor();

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);
	
	//passage du param�tre � la feuille de style
	xsltProcessor.setParameter("", "param_ref_type",paramXSL_type_reference);

    // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Cr�ation du document XML transform� par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById("id_element_a_remplacer");
    
	// ins�rer l'�lement transform� dans la page html
    elementHtmlParent.innerHTML=newXmlDocument.getElementsByTagName(baliseElementARecuperer)[0].innerHTML;
	

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxEmployeesTableau(xmlDocumentUrl, xslDocumentUrl) {
    //commenter la ligne suivante qui affiche la bo�te de dialogue!
    alert("Fonction � compl�ter...");
}