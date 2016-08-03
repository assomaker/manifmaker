/**
 * Created by Kupletsky Sergey on 17.10.14.
 *
 * Material Sidebar (Profile menu)
 * Tested on Win8.1 with browsers: Chrome 37, Firefox 32, Opera 25, IE 11, Safari 5.1.7
 * You can use this sidebar in Bootstrap (v3) projects. HTML-markup like Navbar bootstrap component will make your work easier.
 * Dropdown menu and sidebar toggle button works with JQuery and Bootstrap.min.js
 *
 * https://codepen.io/zavoloklom/pen/dIgco
 */


class SideBar extends BlazeComponent {

    constructor() {
        super();
        /**
         * Created by Kupletsky Sergey on 08.09.14.
         *
         * Add JQuery animation to bootstrap dropdown elements.
         */
        // Add slidedown animation to dropdown
        $(document).on('show.bs.dropdown', '#sidebar .dropdown', function (e) {
            $(this).find('.dropdown-menu').first().stop(true, true).slideDown();

            //  Add slideup animation to dropdown
            $(this).one('hide.bs.dropdown', function (e) {
                $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
            });
        });
    }

    template() {
        return "sideBar"
    }

    events() {
        return [
            {
                "click .sidebar-toggle": this.toggleSideBar,
                "click .sidebar-overlay": this.onClickOverlay,
                "click a[href^='/']": this.toggleSideBar //all internal routes
            }
        ]
    }

    toggleSideBar() {
        var overlay = $('.sidebar-overlay');
        var sidebar = $('#sidebar');
        sidebar.toggleClass('open');
        if ((sidebar.hasClass('sidebar-fixed-left') || sidebar.hasClass('sidebar-fixed-right')) && sidebar.hasClass('open')) {
            overlay.addClass('active');
        } else {
            overlay.removeClass('active');
        }
    }

    onClickOverlay(e) {
        this.$(e.target).removeClass('active');
        this.$('#sidebar').removeClass('open');
    }


    onRendered() {
        var value = "sidebar-fixed-left"; //"", "sidebar-fixed-left", "sidebar-fixed-right", "sidebar-stacked"
        var sidebar = this.$('#sidebar');
        sidebar.addClass(value).addClass('open');
        if (value == 'sidebar-fixed-left' || value == 'sidebar-fixed-right') {
            this.$('.sidebar-overlay').addClass('active');
        }

        $('.navbar .sidebar-toggle').on("click", this.toggleSideBar);
    }
}

SideBar.register("SideBar");

