var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

AOS.init({
    delay: 300, // values from 0 to 3000, with step 50ms
    duration: 1000,
    once: true
});

$().ready(function () {

    $("#print").click(function () {
        window.print();
    })

    $("#pdf").click(function () {
        generatePDF();
    })


    //$("#name").val(window.innerWidth);
    if (isMobile.any()) {
        console.log("Mobile")
        //detectOrientation();
        /*if(window.innerHeight > window.innerWidth){
            $("#rotate_landscape").css("display", "flex")
            $("#body").hide()
        }
        else
        {
            $("#rotate_landscape").css("display", "none")
            $("#body").show()
        }*/
    }

    // Listen for orientation changes
    window.addEventListener("orientationchange", function () {
        // Announce the new orientation number
        detectOrientation();
    }, false);
    //detectOrientation();

    function detectOrientation() {
        console.log(window.matchMedia("(orientation: portrait)"));
        if (window.matchMedia("(orientation: portrait)").matches) {
            // you're in PORTRAIT mode
            $("#rotate_landscape").css("display", "none")
            $("#body").show()
        } else {
            // you're in LANDSCAPE mode
            $("#rotate_landscape").css("display", "flex")
            $("#body").hide()

        }
    }

    function formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        return day + ' ' + '/' + ' ' + monthIndex + ' ' + '/' + ' ' + year;
    }

    $('textarea').each(function (e) {
        $(this).val(localStorage.getItem($(this).attr("id")));
    });
    $('textarea').keyup(function (e) {
        //console.log($(this).attr("id"), $(this).val());
        localStorage.setItem($(this).attr("id"), $(this).val());
    })

    $('textarea').autoHeight();
})
function generatePDF() {

    var response = [];
    $('.response').each(function (e) {
        var ques = ($(this).find(".question").text().replace(/  /g, ''));
        var ans = $.trim($(this).find("textarea").val());
        response.push({
            ques: ques,
            ans: ans
        });
    });

    var doc = new jsPDF();
    var x, y;
    x = 15; y = 0;

    //https://www.base64-image.de/
    var img1_height = 194;
    doc.addImage(img1, 'JPEG', 0, 0, 210, img1_height);

    y += img1_height;


    doc.setFont('helvetica')
    doc.setTextColor(27, 112, 147);
    doc.setFontSize(12);
    var splitText = doc.splitTextToSize(response[0].ques, 170);
    doc.text(x, y, splitText);

    y += (splitText.length * 4)
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    var splitText = doc.splitTextToSize(response[0].ans, 170);
    y = checkpageHeight(doc, y, splitText.length * 4)
    doc.text(x, y, splitText);

    y += (splitText.length * 4)
    doc.setTextColor(27, 112, 147);
    doc.setFontSize(12);
    var splitText = doc.splitTextToSize(response[1].ques, 170);
    y = checkpageHeight(doc, y, splitText.length * 4)
    doc.text(x, y, splitText);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    y += (splitText.length * 4)
    var splitText = doc.splitTextToSize(response[1].ans, 170);
    doc.text(x, y, splitText);

    y += (splitText.length * 4)


    y = checkpageHeight(doc, y, 93)
    //doc.addPage();
    //y = 20;
    doc.addImage(img2, 'png', 0, y, 210, 93);
    y += 93;

    doc.setTextColor(27, 112, 147);
    doc.setFontSize(12);
    var splitText = doc.splitTextToSize(response[2].ques, 170);
    doc.text(x, y, splitText);
    
    y += (splitText.length * 4)
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    var splitText = doc.splitTextToSize(response[2].ans, 170);
    y = checkpageHeight(doc, y, splitText.length * 4)
    doc.text(x, y, splitText);

    y += (splitText.length * 4)
    doc.setTextColor(27, 112, 147);
    doc.setFontSize(12);
    var splitText = doc.splitTextToSize(response[3].ques, 170);
    y = checkpageHeight(doc, y, splitText.length * 4)
    doc.text(x, y, splitText);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    y += (splitText.length * 4)
    var splitText = doc.splitTextToSize(response[3].ans, 170);
    y = checkpageHeight(doc, y, splitText.length * 4)
    doc.text(x, y, splitText);

    doc.save("clientx.pdf");


    /*var elementHTML = $("#content").html();
    console.log(elementHTML);
    var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    }

    var margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };

    doc.fromHTML(elementHTML, 0, 0, {
        'width': 100, // max width of content on PDF
        'elementHandlers': specialElementHandlers
    },
        function (p) { doc.save('clientx.pdf'); },
        margin);*/

}
function checkpageHeight(pdf, y, newY){
    //console.log(y + newY);
    if(y + newY > 260){
        pdf.addPage();
        return 20;
    }
    return y;
}
function trim(t) {
    return jQuery.trim(t.replace(/[\t\n/   /]+/g, ' '));
}
function getImageFromCanvas(canvas, pdf) {

    var imgData = canvas.toDataURL("image/jpeg");
    //var pdf = new jsPDF();
    var pageWidth = pdf.internal.pageSize.width;
    var pageHeight = pdf.internal.pageSize.height;
    var imageWidth = canvas.width;
    var imageHeight = canvas.height;

    var ratio = imageWidth / imageHeight >= pageWidth / pageHeight ? pageWidth / imageWidth : pageHeight / imageHeight;
    //ratio = 0.19;
    //pdf = new jsPDF(this.state.orientation, undefined, format);
    //pdf.addImage(imgData, 'JPEG', 0, 0, imageWidth * ratio, imageHeight * ratio);

    return {
        imgData: imgData,
        imageWidth: imageWidth * ratio,
        imageHeight: imageHeight * ratio
    }

    console.log(pageWidth, pageHeight, imageWidth, imageHeight, ratio)
    //  pdf.save("invoice.pdf");

}



jQuery.fn.extend({
    autoHeight: function () {
        function autoHeight_(element) {
            return jQuery(element)
                .css({ 'height': 'auto', 'overflow-y': 'hidden' })
                .height(element.scrollHeight);
        }
        return this.each(function () {
            autoHeight_(this).on('input', function () {
                autoHeight_(this);
            });
        });
    }
});

