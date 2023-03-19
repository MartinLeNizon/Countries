var currencyEnable = false;
var country1;
var country2;
var oneOrTwo = 1;

function changePageBackgroundAndButtonTextColor(pageBgColor, buttonTextColor) {
    document.body.style.background = pageBgColor;
    document.getElementById("myButton1").style.color = buttonTextColor;
}

function resetBackground() {
    document.body.style.background = 'white';
}

function infosCountry(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, paramXSL_type_reference, idInfosEspace, id, currencyEnable) {

    // Chargement du fichier XSL à l'aide de XMLHttpRequest synchrone 
    var xslDocument = chargerHttpXML(xslDocumentUrl);

	//création d'un processuer XSL
    var xsltProcessor = new XSLTProcessor();

    // Importation du .xsl
    xsltProcessor.importStylesheet(xslDocument);

	// Passage du paramètre à la feuille de style
	xsltProcessor.setParameter("", "param_ref_type", paramXSL_type_reference);

    // Passage du paramètre à la feuille de style
	xsltProcessor.setParameter("", "param_ref_type2", currencyEnable);

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Création du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    // Recherche du parent (dont l'id est "here") de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(idInfosEspace);
    
	// Insérer l'élement transformé dans la page html
    elementHtmlParent.innerHTML=newXmlDocument.getElementsByTagName(baliseElementARecuperer)[0].innerHTML;

    // Remplir la colonne Currency si besoin
    if (currencyEnable) {
        var jsonDocumentUrl = "https://restcountries.com/v2/alpha/" + id;
        var jsonDocument = chargerHttpJSON(jsonDocumentUrl);
        var elementHtmlParent = window.document.getElementById("country_currency");
        elementHtmlParent.innerHTML=jsonDocument.currencies[0].name;
    }

    

}

function displaySvgDrawing(xmlDocumentUrl, espace_drawing) {

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Serialiser le XML dans un string
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(xmlDocument);

    // Recherche du parent de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(espace_drawing);
    
	// Insérer l'élément transformé dans la page html
    elementHtmlParent.innerHTML=svgString;
}

function makeSvgClickable(espace_drawing, espace_infos, element_clickable) {
    // Récupérer le SVG element
    var svgElement = document.getElementById(espace_drawing);

    // Récupérer tous les cercles, rectangles et path éléments dans le SVG
    var clickableElements = svgElement.querySelectorAll('circle, rect, path');

    // Ajouter un click event listener à chaque élément
    clickableElements.forEach(function(element) {
        element.addEventListener('click', function() {
            // Récupérer la valeur de l'attribut à afficher
            var title = element.getAttribute(element_clickable);
            var elementHtmlParent = window.document.getElementById(espace_infos);
            elementHtmlParent.innerHTML = "Name : " +title;
        });
    });
}

function infosCountryOnMouseOver(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, espaceId, currencyEnable) {

    // Récupérer le SVG element
    var svgElement = document.getElementById("espace_svg_map");

    // Récupérer tous les path éléments dans le SVG
    var clickableElements = svgElement.querySelectorAll('path');

    //Remettre la map originale
    clickableElements.forEach(function(element) {
        element.classList.remove('land');
        element.setAttribute("fill", "#CCCCCC");
        element.setAttribute("opacity", 1);
    });

    // Ajouter un mouseover et mouseleave event listener à chaque élément
    clickableElements.forEach(function(element) {
        element.addEventListener('mouseover', function() {
            infosCountry(xmlDocumentUrl, xslDocumentUrl, baliseElementARecuperer, this.getAttribute('countryname'), espaceId, this.getAttribute('id'), currencyEnable);
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
            element.setAttribute("fill", "#CCCCCC")

        });
    });
}

function autoComplete(textAreaId, datalistId) {

    // Ne pas trier les suggestions

    const input = document.getElementById(textAreaId);
    input.setAttribute("list", datalistId);
}

function autoCompleteOptimized(textAreaId, datalistId) {

    // Trier les suggestions
    // Par exemple : on suggérera  FI au lieu de AF quand l'utilisateur écrit F

    const input = document.getElementById(textAreaId);
    input.setAttribute("list", datalistId);

    const dataList = document.getElementById(datalistId);
    const options = Array.from(dataList.options);

    input.addEventListener("input", function() {
        const inputValue = input.value.toLowerCase();

        options.sort(function(a, b) {
            const aVal = a.value.toLowerCase();
            const bVal = b.value.toLowerCase();

            const aIndex = aVal.indexOf(inputValue);
            const bIndex = bVal.indexOf(inputValue);

            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            } else if (aIndex !== -1) {
                return -1;
            } else if (bIndex !== -1) {
                return 1;
            } else {
                return 0;
            }
        });

        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild);
        }

        options.forEach(function(option) {
            dataList.appendChild(option);
        });
    });
}

function addCurrency() {
    currencyEnable = true;
}

function colorLanguage(textId, xmlDocumentUrl) {
    // Récupérer le SVG element
    var svgElement = document.getElementById("espace_svg_map");

    // Récupérer tous les path éléments dans le SVG
    var colorElements = svgElement.querySelectorAll('path');

    //Remettre la map originale
    colorElements.forEach(function(element) {
        element.classList.remove('land');
        element.setAttribute("fill", "#CCCCCC")
        element.setAttribute("opacity", 1);
    });

    var countryCode = document.getElementById(textId).value;
    
    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Utilser XPath pour extraire des informations du document XML
    var xpathExpression = "//country[languages/* = //country[country_codes/cca2='" + countryCode + "']/languages/*]/country_name/common_name";
    var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    var countriesSelected = [];

    for (var i = 0; i < xpathResult.snapshotLength; i++) {
        var countrySelected = xpathResult.snapshotItem(i).textContent;
        countriesSelected.push(countrySelected);
    }

    //Coloier en bleu les éléments 
    colorElements.forEach(function(element) {
        if(countriesSelected.includes(element.getAttribute('countryname'))) {
            element.classList.remove('land');
            element.setAttribute("fill", "blue")
        }
    });
}

function randomCountry(espace_country) {

    elementHtmlParent = window.document.getElementById("result_answer");
    elementHtmlParent.innerHTML="";

    var svgElement = document.getElementById("espace_svg_map");

    var countries = svgElement.querySelectorAll('path');

    var randomIndex = Math.floor(Math.random() * countries.length);

    var randomCountry = countries[randomIndex].getAttribute("countryname");

    // Recherche du parent de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(espace_country);
    
	// insérer l'élement transformé dans la page html
    elementHtmlParent.innerHTML="Game : Try to find... " + randomCountry;

    // Ajouter un click event listener à chaque pays
    countries.forEach(function(element) {
        element.addEventListener('click', function() {
        elementHtmlParent = window.document.getElementById("result_answer");
            if(this.getAttribute('countryname') == randomCountry) {
                elementHtmlParent.innerHTML="Result : True";
            } else {
                elementHtmlParent.innerHTML="Result : False";
            }
        });
    });
}

function findCountry(latitudeId, longitudeId, answerId){

    var latitude = document.getElementById(latitudeId).value;
    var longitude = document.getElementById(longitudeId).value;
    
    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML("../countriesTP.xml");

    var xpathExpression = "//country[coordinates/@lat = " + latitude + " and coordinates/@long = " + longitude + "]/country_name/common_name";
   
    var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
    var result = xpathResult.stringValue;
    
    // Recherche du parent de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(answerId);

    if(result) {
        // Insérer l'élement transformé dans la page html
        elementHtmlParent.innerHTML = result;
    } else {
        elementHtmlParent.innerHTML = "No country found";
    }

}

function calculateDistance(distanceId) {

    getCountriesCoord('espace_svg_map', 'countryname', distanceId);

}

function getCountriesCoord(espace_drawing, element_clickable, distanceId) {

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML("../countriesTP.xml");

    // Récupérer le SVG element
    var svgElement = document.getElementById(espace_drawing);

    // Récupérer tous les path éléments dans le SVG
    var clickableElements = svgElement.querySelectorAll('path');
    
    var elementHtmlParent = window.document.getElementById(distanceId);
    

    // Ajouter un click event listener à chaque élément
    clickableElements.forEach(function(element) {
        element.addEventListener('click', function() {
            if(oneOrTwo === 1){
                oneOrTwo = 2;
                country1 = element.getAttribute(element_clickable);
                elementHtmlParent.innerHTML = "First Country: " + country1;
            } else {
                oneOrTwo = 1;
                country2 = element.getAttribute(element_clickable);

                elementHtmlParent.innerHTML += " ; Second Country: " + country2;

                var xpathExpression = "//country[country_name/common_name = '" + country1 + "']/coordinates/@lat";
                var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
                var lat1 = xpathResult.stringValue;

                var xpathExpression = "//country[country_name/common_name = '" + country1 + "']/coordinates/@long";
                var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
                var lon1 = xpathResult.stringValue;

                var xpathExpression = "//country[country_name/common_name = '" + country2 + "']/coordinates/@lat";
                var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
                var lat2 = xpathResult.stringValue;

                var xpathExpression = "//country[country_name/common_name = '" + country2 + "']/coordinates/@long";
                var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
                var lon2 = xpathResult.stringValue;

                dispDistance(distanceId, lat1, lon1, lat2, lon2)
            }
        });
    });
}

function dispDistance(distanceId, lat1, lon1, lat2, lon2){
    // Recherche du parent de l'élément à remplacer dans le document HTML courant
    var elementHtmlParent = window.document.getElementById(distanceId);
    elementHtmlParent.innerHTML += " ; Distance: " + haversine(lat1, lon1, lat2, lon2) + " km";
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // rayon moyen de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180.0; // différence de latitude en radians
    const dLon = (lon2 - lon1) * Math.PI / 180.0; // différence de longitude en radians
    const lat1Rad = lat1 * Math.PI / 180.0; // latitude du premier point en radians
    const lat2Rad = lat2 * Math.PI / 180.0; // latitude du deuxième point en radians
  
    const a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance en km
  
    return d;
}

function colorByArea(espace_drawing) {

    var xmlDocument = chargerHttpXML("../countriesTP.xml");
    

    // Récupérer le SVG element
    var svgElement = document.getElementById(espace_drawing);

    // Récupérer tous les path éléments dans le SVG
    var colorableElements = svgElement.querySelectorAll('path');

    // Ajouter un click event listener à chaque élément
    colorableElements.forEach(function(element) {
        var xpathExpression = "//country[country_codes/cca2 = '" + element.getAttribute('id') + "']/@area";  
        var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
        var area = Number(xpathResult.stringValue);

        element.classList.remove('land');
        element.setAttribute("fill", "#000000");

        element.setAttribute("opacity", area/17098242);

    });
}

function colorByDensity(espace_drawing) {

    var xmlDocument = chargerHttpXML("../countriesTP.xml");
    

    // Récupérer le SVG element
    var svgElement = document.getElementById(espace_drawing);

    // Récupérer tous les path éléments dans le SVG
    var colorableElements = svgElement.querySelectorAll('path');

    // Ajouter un click event listener à chaque élément
    colorableElements.forEach(function(element) {
        var xpathExpression = "//country[country_codes/cca2 = '" + element.getAttribute('id') + "']/@area";  
        var xpathResult = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.STRING_TYPE, null);
        var area = Number(xpathResult.stringValue);

        var jsonDocumentUrl = "https://restcountries.com/v2/alpha/" + element.getAttribute('id');
        var jsonDocument = chargerHttpJSON(jsonDocumentUrl);
        var population = jsonDocument.population;

        var density = population/area;

        element.classList.remove('land');
        element.setAttribute("fill", "#000000");

        element.setAttribute("opacity", density/345);   // Densité de l'Inde -> Si calculé en direct, trop de calcul (pour pas grand chose)

    });
}

//charge le fichier XML se trouvant à l'URL relative donné dans le paramètre et le retourne
function chargerHttpXML(xmlDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3ème paramètre est défini à false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}

// Charge le fichier JSON se trouvant à l'URL donnée en paramètre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    // chargement du fichier JSON à l'aide de XMLHttpRequest synchrone (le 3ème paramètre est défini à false)
    httpAjax.open('GET', jsonDocumentUrl, false);
    httpAjax.send();

    var responseData = eval("(" + httpAjax.responseText + ")");

    return responseData;
}