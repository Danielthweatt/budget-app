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
        $('#' + $(this).data('target-modal')).addClass('is-active');
    });

    //Close modal targeted by data attribute on any element with .close-modal class and 
    //empty modal inputs
    $('.close-modal').click(function() {
        $('#' + $(this).data('target-modal')).removeClass('is-active').find('input[type!=\'submit\']').val('');
    });
});