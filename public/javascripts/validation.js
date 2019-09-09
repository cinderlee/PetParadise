$(document).ready(function () {
    jQuery.validator.addMethod("alphanumeric", function(value, element) {
            return this.optional(element) || /^[A-Za-z]+[A-Za-z0-9]*$/.test(value);
    }, "Letters and numbers only <br/> Must start with a letter!");

    jQuery.validator.addMethod("alphaNumSpecial", function(value, element){
        const alpha = this.optional(element) || new RegExp('[A-Za-z]+').test(value);
        const num = this.optional(element) || new RegExp('[0-9]+').test(value);
        const special = this.optional(element) || new RegExp(`[!"#$%&'()*+,-./]+`).test(value);
        console.log(alpha, num, special)
        return alpha && num && special;
    }, `Must have at lease one letter. 
    <br/> Must have at least one a number.
    <br/> Must have at least one special character from: !"#$%&'()*+,-./`);

    $("#login").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required:true
            }
        }
    });

    $("#register").validate({
        rules: {
            username: {
                required: true,
                alphanumeric: true
            },
            password: {
                required: true,
                alphaNumSpecial: true,
                minlength: 8
            }
        }
    });

    $("#makePet").validate({
        rules: {
            name: {
                required: true,
                alphanumeric: true
            },
        }
    });
});