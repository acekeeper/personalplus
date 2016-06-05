app.service('backendService', function ($http) {

  // ================ Candidate API ================ //
  
  // Get all candidates
  this.getCandidates = function () {
    return $http({
      url: 'api/candidates',
      method: 'GET'
    }).then(function (response){return response.data})
  };

  // Add new candidate
  this.addCandidate = function (candidate) {
    return $http({
      url: 'api/candidate',
      method: 'POST',
      data: {
        candidate: candidate
      }
    }).then(function (response){return response.data})
  };

  // Delete candidate by ID
  this.deleteCandidate = function (_id) {
    return $http({
      url: 'api/candidate/' + _id,
      method: 'DELETE'
    }).then(function (response){return response.data})
  };

  // Update candidate by ID
  this.updateCandidate = function (_id, candidate) {
    return $http({
      url: 'api/candidate/' + _id,
      method: 'PUT',
      data:{
        candidate: candidate
      }
    }).then(function (response){return response.data})
  };

  
  // ================ Interview API ================ //

  // Get all meetings
  this.getInterviews = function () {
    return $http({
      url: 'api/interviews',
      method: 'GET'
    }).then(function (response){return response.data})
  };

  // Add new meeting
  this.addInterview = function (interview) {
    return $http({
      url: 'api/interview',
      method: 'POST',
      data: {
        interview: interview
      }
    }).then(function (response){return response.data})
  };

  // Delete meeting by ID
  this.deleteInterview = function (_id) {
    return $http({
      url: 'api/interview/' + _id,
      method: 'DELETE'
    }).then(function (response){return response.data})
  };

  // Update meeting by ID
  this.updateInterview = function (_id, interview) {
    return $http({
      url: 'api/interview/' + _id,
      method: 'PUT',
      data:{
        interview: interview
      }
    }).then(function (response){return response.data})
  };


  // ================ External Import ================ //
  this.getExternalCV = function (id) {
    return $http({
      url: 'api/getExternalCV',
      method: 'GET',
      params: {
        id: id
      }
    }).then(function (response){return response.data})
  };
  
  
  
});