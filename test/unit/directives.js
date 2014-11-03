'use strict'

describe('directives', function() {
    var $compile;
    var $rootScope;

    beforeEach(module('BWProgress'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('progressIndicator', function() {

        it('should create svg', function() {
            $rootScope.expected = 0.4;
            $rootScope.actual = 0.4;

            var element = $compile('<progress-indicator expected="expected" actual="actual"></progress-indicator>')($rootScope);
            $rootScope.$digest();

            expect(element.find('svg').length).toBe(1);
        });

        it('shows progress percentage', function() {
            $rootScope.expected = 0.4;
            $rootScope.actual = 0.3;

            var element = $compile('<progress-indicator expected="expected" actual="actual"></progress-indicator>')($rootScope);
            $rootScope.$digest();

            expect(element.html()).toContain('30<tspan>%</tspan>');
        });
    });
});

