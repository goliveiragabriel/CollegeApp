$(function () {
    $(document).ready(function () {
        Metronic.init(); // init metronic core componets
        Layout.init(); // init layout
        Demo.init(); // init demo features 
        Index.init();
        Index.initDashboardDaterange();
        Index.initCalendar(); // init index page's custom scripts
        Index.initCharts(); // init index page's custom scripts
        Index.initChat();
        Index.initMiniCharts();
        Index.initIntro();
        Tasks.initDashboardWidget();
        // instancing datepicker
        $(".date-picker").datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true,
            dateFormat: 'yyyy-dd-mm'

        });

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "5000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        /**
        Handling notifications
        **/
        $.ajax({
            type: "GET",
            dataType: 'JSON',
            url: "/LogEvents/GetNotifications",
            success: function (data) {
                console.log(data);
                $.each(data["notification"], function (index, element) {
                    if (element.State == "Modified") {
                        toastr.info("The user " + element.Value + " has been modified", element.State);
                    }
                    if (element.State == "Added") {
                        toastr.success("The user " + element.Value + " has been created", element.State);
                    }
                    if (element.State == "Deleted") {
                        toastr.error("The user " + element.Value + " has been deleted", element.State);
                    }
                });
                $.ajax({
                    url: "/LogEvents/Save",
                    data: { events: data["notification"] },
                    type: "POST"
                });
            }
        });
        /**
        Clear input hiddnes
        **/
        $("input[type='reset']").click(function (e) {
            $(e.target.form).find("input[type='hidden']").val("");

        });
    });
});
