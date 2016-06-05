// routes
// app.config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/', {
//     templateUrl: 'assets/tpl/dashboard.html'
//   }).when('/:folder/:tpl', {
//       templateUrl: function(attr){
//         return 'assets/tpl/' + attr.folder + '/' + attr.tpl + '.html';
//       }
//     }).when('/:tpl', {
//       templateUrl: function(attr){
//         return 'assets/tpl/' + attr.tpl + '.html';
//       }
//     }).otherwise({ redirectTo: '/' });
// }])
//

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state("dashboard", {
                url: "/",
                templateUrl: "assets/tpl/dashboard.html",
                controller: "DashboardController"
            })
            .state("candidates", {
                url: "/candidates",
                templateUrl: "assets/tpl/candidates.html",
                controller: "CandidatesController",
                resolve: {
                    candidates: ['backendService', function (backendService) {
                        return backendService.getCandidates();
                    }]
                }
            })
            .state("interviews", {
                url: "/interviews",
                templateUrl: "assets/tpl/interviews.html",
                controller: "InterviewsController",
                resolve: {
                    candidates: ['backendService', function (backendService) {
                        return backendService.getCandidates();
                    }],
                    interviews: ['backendService', function (backendService) {
                        return backendService.getInterviews();
                    }]
                }
            })

    }])


    // loading bar settings
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 300;
    }])

    // defaults for date picker
    .config(['$datepickerProvider', function ($datepickerProvider) {
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'dd MMMM yyyy',
            iconLeft: 'md md-chevron-left',
            iconRight: 'md md-chevron-right',
            autoclose: true,
        });
    }])

    // defaults for date picker
    .config(['$timepickerProvider', function ($timepickerProvider) {
        angular.extend($timepickerProvider.defaults, {
            timeFormat: 'HH:mm',
            iconUp: 'md md-expand-less',
            iconDown: 'md md-expand-more',
            hourStep: 1,
            minuteStep: 1,
            arrowBehavior: 'picker',
            modelTimeFormat: 'HH:mm'
        });
    }])

    // disable nganimate with adding class
    .config(['$animateProvider', function ($animateProvider) {
        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
    }])

    // set default settings for alerts
    .config(function ($alertProvider) {
        angular.extend($alertProvider.defaults, {
            title: '',
            placement: 'top-right',
            container: '.alert-container-top-right',
            duration: 3,
            show: false
        });
    })

    // set constants
    .run(['$rootScope', 'APP', function ($rootScope, APP) {
        $rootScope.APP = APP;
    }]);
