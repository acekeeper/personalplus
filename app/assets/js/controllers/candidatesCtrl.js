app.controller('CandidatesController',
    ['$scope', '$window', '$aside', '$alert', 'PlaceholderTextService', 'backendService','candidates',
        function ($scope, $window, $aside, $alert, PlaceholderTextService, backendService, candidates) {

    // preload all candidates from db
    $scope.candidates = candidates;

    // settings
    $scope.settings = {
        name: 'candidates',
        cmd: 'Add'
    };

    // ============== Candidate CRUD ============== //

    $scope.editItem = function (item) {
        if (item) {
            item.editing = true;
            $scope.item = item;
            $scope.settings.cmd = 'Edit';
            $scope.showIfNotEmpty();
            showForm();
        }
    };

    $scope.viewItem = function (item) {
        if (item) {
            item.editing = false;
            $scope.item = item;
            $scope.settings.cmd = 'View';
            $scope.showIfNotEmpty();
            showForm();
        }
    };

    $scope.createItem = function () {
        var item = {
            editing: true
        };
        $scope.item = item;
        $scope.settings.cmd = 'New';
        showForm();
    };


    //Add new candidate
    $scope.addCandidate = function (candidate) {
        backendService.addCandidate(candidate).then(function (response) {
            if (response) {
                $scope.candidates = response;
                hideForm();
                addCandidateAlert.show();
            }

        })
    };
    $scope.deleteCandidate = function (_id) {
        backendService.deleteCandidate(_id).then(function (response) {
            console.log(response);
            $scope.candidates = response;
            deleteCandidateAlert.show();
        })
    };

    $scope.updateCandidate = function (_id, candidate) {
        backendService.updateCandidate(_id, candidate).then(function (response) {
            if (response.ok) {
                updateCandidateAlert.show();
                hideForm()
            }
            else {
                errorAlert.show();
            }

        })
    };

    // External Import
    $scope.getExternalCV = function (id) {
        backendService.getExternalCV(id).then(function (response) {
            if (response.name) {
                console.log(response);
                $scope.item = response;
                $scope.item.editing = true;

                if ($scope.item.info) {
                    $scope.item.info.forEach(function (item) {
                        switch (item.title) {
                            case "Образование":
                                $scope.item.education = item.subtitles;

                                break;
                            case "Опыт работы":
                                $scope.item.workExp = item.subtitles;

                                break;
                            case "Профессиональные навыки":
                                $scope.item.skills = item.subtitles;

                                break;
                            case "Дополнительная информация":
                                $scope.item.additional = item.subtitles;

                                break;
                                $scope.showIfNotEmpty();
                        }
                    })
                }
                delete $scope.item.info;
                console.log($scope.item);

                $scope.educationNewVisible = $scope.workExpNewVisible = $scope.skillsNewVisible = $scope.additionalNewVisible = false;
                addExternalCandidateAlert.show();
                $scope.closeImport();
            }
        })
    };

    // ================ View decorators =================== //
    $scope.toggle = function (area) {
        if (!$scope.item[area] || !$scope.item[area].length) {
            $scope.item[area] = [];
            $scope[area + 'NewVisible'] = true;
        }
        $scope[area + 'Visible'] = !$scope[area + 'Visible'];
    };
    $scope.showNewInfo = function (area) {
        $scope[area + 'NewVisible'] = true;
    };

    $scope.addNewInfo = function (area) {
        $scope.item[area].push($scope[area + 'New']);
        $scope[area + 'NewVisible'] = false;
        $scope[area + 'New'] = {}
    };
    $scope.discardNewInfo = function (area) {
        $scope[area + 'New'] = {title: '', content: ''};
        $scope[area + 'NewVisible'] = false;
    };

    $scope.openImport = function () {
        $scope.import = true;
    };
    $scope.closeImport = function () {
        $scope.import = false;
    };

    $scope.showIfNotEmpty = function () {
        if ($scope.item.education && $scope.item.education.length) {
            $scope.educationVisible = true;
        }
        if ($scope.item.workExp && $scope.item.workExp.length) {
            $scope.workExpVisible = true;
        }
        if ($scope.item.skills && $scope.item.skills.length) {
            $scope.skillsVisible = true;
        }
        if ($scope.item.additional && $scope.item.additional.length) {
            $scope.additionalVisible = true;
        }
    };

    $scope.educationVisible = $scope.workExpVisible = $scope.skillsVisible = $scope.additionalVisible = false;
    $scope.educationNewVisible = $scope.workExpNewVisible = $scope.skillsNewVisible = $scope.additionalNewVisible = false;
    $scope.educationNew = {title: '', content: ''};
    $scope.workExpNew = {title: '', content: ''};
    $scope.skillsNew = {title: '', content: ''};
    $scope.additionalNew = {title: '', content: ''};

    $scope.$on('$destroy', function () {
        hideForm();
    });


    // =============== Partial views and alerts ============ //
    // Aside
    var formTpl = $aside({
        scope: $scope,
        templateUrl: 'assets/tpl/partials/candidate-form.html',
        show: false,
        placement: 'left',
        backdrop: false,
        animation: 'am-slide-left'
    });

    var showForm = function () {
        angular.element('.tooltip').remove();
        formTpl.show();
    };

    var hideForm = function () {
        formTpl.hide();
    };

    // Alerts
    var addCandidateAlert = $alert({
        content: 'Претендент успішно доданий!',
        type: 'success'
    });

    var addExternalCandidateAlert = $alert({
        content: 'Претендент імпортований!',
        type: 'success'
    });

    var deleteCandidateAlert = $alert({
        content: 'Претендент видалений!',
        type: 'success'
    });

    var updateCandidateAlert = $alert({
        content: 'Претендент оновлений!',
        type: 'success'
    });

    var errorAlert = $alert({
        content: 'Вибачте, сталася помилка! Спробуйте пізніше!',
        type: 'error'
    });


}]);
