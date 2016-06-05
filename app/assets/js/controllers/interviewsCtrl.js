app.controller('InterviewsController', ['$scope',  '$alert', 'todoService', 'backendService','candidates', 'interviews',
  function($scope, $alert, todoService, backendService, candidates, interviews){
  // $scope.todoService = new todoService($scope);
  $scope.settings={
    name: 'interviews'
  };
  $scope.candidates = candidates;
  $scope.interviews = interviews;

  $scope.interview = {
    candidate: '',
    date: '',
    time: '',
    comment: '',
    done: false
  };

  //Add new interview
  $scope.addInterview = function (interview) {
    backendService.addInterview(interview).then(function (response) {
      if (response) {
        $scope.interviews = response;
        addInterviewAlert.show();
      }

    })
  };

    $scope.deleteInterview = function (_id) {
      backendService.deleteInterview(_id).then(function (response) {
        if(response&&!response.error){
          $scope.interviews = response;
          deleteInterviewAlert.show();
        }
        else {
          errorAlert.show();
        }
      })
    };

    $scope.updateInterview = function (_id, interview) {
      interview.edit = false;
      backendService.updateInterview(_id, interview).then(function (response) {
        if (response&&!response.error) {
          updateInterviewAlert.show();
        }
        else {
          errorAlert.show();
        }

      })
    };

  // =============== Partial views and alerts ============ //
  // Alerts
  var addInterviewAlert = $alert({
    content: 'Співбесіда успішно додана!',
    type: 'success'
  });
  

  var deleteInterviewAlert = $alert({
    content: 'Співбесіда видалена!',
    type: 'success'
  });

  var updateInterviewAlert = $alert({
    content: 'Співбесіда оновлена!',
    type: 'success'
  });

  var errorAlert = $alert({
    content: 'Вибачте, сталася помилка! Спробуйте пізніше!',
    type: 'error'
  });
  
  
}]);
