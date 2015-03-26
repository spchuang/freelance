(function(){
    var app = angular.module('store-directives', []);

    app.directive("productDescription", function() {
        return {
            restrict: 'E',
            template: "<div>hello</div>"
        };
    });
})();
