'use strict';
(function (window) {
  var angular = window.angular;
  var module = angular.module('pgApexApp');

  function DatabaseService(apiService) {
    this.apiService = apiService;
  }

  DatabaseService.prototype.getSchemas = function () {
    return this.apiService.get('api/database/schemas.json');
  };

  function init() {
    module.service('databaseService', ['apiService', DatabaseService]);
  }

  init();
})(window);