'use strict';
(function (window) {
  var angular = window.angular;
  var module = angular.module('pgApexApp.page');

  function ManageNavigationRegionController($scope, $location, $routeParams, regionService, templateService, navigationService, formErrorService) {
    this.$scope = $scope;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.regionService = regionService;
    this.templateService = templateService;
    this.navigationService = navigationService;
    this.formErrorService = formErrorService;

    this.init();
  }

  ManageNavigationRegionController.prototype.init = function() {
    this.$scope.mode = this.isCreatePage() ? 'create' : 'edit';
    this.$scope.region = {};
    this.$scope.regionTemplates = [];
    this.$scope.navigationTemplates = [];
    this.$scope.navigations = [];
    this.$scope.formError = this.formErrorService.empty();
    
    this.$scope.saveRegion = this.saveRegion.bind(this);
    this.initRegionTemplates();
    this.initNavigationTemplates();
    this.initNavigations();
    this.loadRegion();
  };

  ManageNavigationRegionController.prototype.initRegionTemplates = function() {
    this.templateService.getRegionTemplates().then(function (response) {
      this.$scope.regionTemplates = response.getDataOrDefault([]);
    }.bind(this));
  };

  ManageNavigationRegionController.prototype.initNavigationTemplates = function() {
    this.templateService.getNavigationTemplates().then(function (response) {
      this.$scope.navigationTemplates = response.getDataOrDefault([]);
    }.bind(this));
  };

  ManageNavigationRegionController.prototype.initNavigations = function() {
    this.navigationService.getNavigations(this.getApplicationId()).then(function (response) {
      this.$scope.navigations = response.getDataOrDefault([]);
    }.bind(this));
  };

  ManageNavigationRegionController.prototype.isCreatePage = function() {
    return this.$location.path().endsWith('/create');
  };

  ManageNavigationRegionController.prototype.isEditPage = function() {
    return this.$location.path().endsWith('/edit');
  };

  ManageNavigationRegionController.prototype.getDisplayPoint = function() {
    return this.$routeParams.displayPoint || null;
  };
  
  ManageNavigationRegionController.prototype.getPageId = function() {
    return this.$routeParams.pageId || null;
  };
  
  ManageNavigationRegionController.prototype.getRegionId = function() {
    return this.$routeParams.regionId || null;
  };
  
  ManageNavigationRegionController.prototype.getApplicationId = function() {
    return this.$routeParams.applicationId || null;
  };

  ManageNavigationRegionController.prototype.saveRegion = function() {
    this.regionService.saveNavigationRegion(
      this.getPageId(),
      this.getDisplayPoint(),
      this.getRegionId(),
      this.$scope.region.name,
      this.$scope.region.sequence,
      this.$scope.region.regionTemplate,
      this.$scope.region.navigationTemplate,
      this.$scope.region.navigationType,
      this.$scope.region.navigation,
      this.$scope.region.repeatLastLevel
    ).then(this.handleSaveResponse.bind(this));
  };

  ManageNavigationRegionController.prototype.handleSaveResponse = function(response) {
    if (!response.hasErrors()) {
      this.$location.path('/application-builder/app/' + this.getApplicationId()
                        + '/pages/' + this.getPageId() + '/regions');
      return;
    } else {
      this.$scope.formError = this.formErrorService.parseApiResponse(response);
    }
  };

  ManageNavigationRegionController.prototype.loadRegion = function() {
    if (!this.isEditPage()) { return; }
    this.regionService.getNavigationRegion(this.getRegionId()).then(function (response) {
      this.$scope.region = response.getDataOrDefault({});
    }.bind(this));
  };

  function init() {
    module.controller('pgApexApp.region.ManageNavigationRegionController',
      ['$scope', '$location', '$routeParams', 'regionService',
      'templateService', 'navigationService', 'formErrorService', ManageNavigationRegionController]);
  }

  init();
})(window);