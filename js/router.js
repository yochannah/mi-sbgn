//routing thanks to https://cdnjs.com/libraries/backbone.js/tutorials/what-is-a-router
export default function router(initViewer) {
    var AppRouter = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute"
    }
    
});

this.appRouter = new AppRouter;

this.appRouter.on('route:defaultRoute', function (complex) {
        if (complex) {
            console.log("navigating", complex);
            //navigate to the fragment in the url
            initViewer(complex);
        } else {
            //use a default
            initViewer(currentComplex);
        }
    });


Backbone.history.start();

return this;
}



router.prototype.navigate = function(whereTo) {
    this.appRouter.navigate(whereTo,{trigger:true});
    window.location.reload();
}