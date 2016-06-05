app.controller('SearchCVController', ['$scope', '$sce', '$http', 'iframeUrl', function($scope, $sce, $http, iframeUrl){
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };
 $scope.iframeUrl = iframeUrl;
    $scope.idCV = '';
    $scope.parseCandidate = function () {
        console.log(angular.element($("iframe")[0].contentWindow.location.href));
        // console.log(angular.element($('.photo')));
    };

    $scope.formData = 'give me that punk';

    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http({
            method: 'POST',
            url: 'api/todos',
            data: {'todo':'xxx'}
        }).success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getById = function() {
        $http({
            method: 'GET',
            url: '/scrape'
        }).success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



}]);
