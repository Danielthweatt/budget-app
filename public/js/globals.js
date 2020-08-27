//Scripts for every page
$(document).ready(function() {
    //Toggle display of navbar menu on touch devices
    //https://bulma.io/documentation/components/navbar#navbarJsExample
    //Check for click events on the navbar burger icon
    $('.navbar-burger').click(function() {
        //Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });

    //Open modal targeted by data attribute on any element with .open-modal class
    $('.open-modal').click(function() {
        var targetModal = $(this).data('target-modal');

        $('#' + targetModal).addClass('is-active');
    });

    //Close modal targeted by data attribute on any element with .close-modal class
    $('.close-modal').click(function() {
        var targetModal = $(this).data('target-modal');

        $('#' + targetModal).removeClass('is-active');
    });
});