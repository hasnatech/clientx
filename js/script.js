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

    var doc = new jsPDF();

    var x, y;
    x = 20; y = 0;

    y += 40;
    doc.setFontType('bold');
    doc.setTextColor(27, 112, 147);
    doc.setFontSize(28);
    doc.text(x, y, "Client X Response");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    
    $('.response').each(function (e) {


        var ques = ($(this).find(".question").text().replace(/  /g,''));
        var ans = $.trim($(this).find("textarea").val());

        var splitTitle = doc.splitTextToSize(ans, 170);


        if (y + (splitTitle.length * 5) > 220) {
            y = 10;
            doc.addPage();
        }
       
 
        //console.log(ques);
        y += 10;
        doc.setFontType('bold');
        
        var splitQues = doc.splitTextToSize(ques, 170);
        doc.text(x, y, splitQues);
        y += (splitQues.length * 6)
        //doc.text(x, y, ques);

        //y += 20;
        doc.setFontType('normal');
        //doc.setFontSize(9);
      
        doc.text(x, y, splitTitle);
        y += (splitTitle.length * 5)

        

        //var dim = doc.getTextDimensions('Text');
        //console.log(dim);

        //y += 20;
        //doc.text('Hi How are you', x, y, 'right');

    });
    doc.save('clientx.pdf');


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

