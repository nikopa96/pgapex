'use strict';
(function (window) {
  var angular = window.angular;
  var module = angular.module('pgApexApp');

  function FormErrorService() {
    this.parseApiResponse = function (apiResponse) {
      var formError = new FormError(apiResponse);
      formError.parseApiResponse();
      return formError;
    }

    this.empty = function () {
      return new FormError(null);
    }
  }

  function FormError(apiResponse) {
    this.apiResponse = apiResponse;
    this.errors = {};
  }

  FormError.prototype.parseApiResponse = function() {
    if (this.apiResponse == null || !this.apiResponse.hasErrors()) { return; }
    var self = this;
    this.apiResponse.getPointers().forEach(function(pointer) {
      var fieldName = pointer.split('/').pop();
      self.errors[fieldName] = self.apiResponse.getErrorDetailsWhereSourcePointerIs(pointer);
    });
  };

  FormError.prototype.hasErrors = function(fieldName) {
    return this.errors.hasOwnProperty(fieldName);
  };

  FormError.prototype.getErrors = function(fieldName) {
    return this.hasErrors(fieldName) ? this.errors[fieldName] : [];
  };

  FormError.prototype.showErrors = function(formField, fieldName) {
    return (formField.$touched && formField.$invalid) || this.hasErrors(fieldName);
  }

  function init() {
    module.service('formErrorService', [FormErrorService]);
  }

  init();
})(window);