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

        it('should turn green if actual is 100%', function(done) {
            $rootScope.expected = 1;
            $rootScope.actual = 1;

            var element = $compile('<progress-indicator expected="expected" actual="actual"></progress-indicator>')($rootScope);
            $rootScope.$digest();
            setTimeout(function() {
                expect(element[0].querySelector('.actual-arc').getAttribute('fill')).toEqual("#60cc00");
                done();
            }, 900)
        });

        it('draws half a circle when 50%', function(done) {
            $rootScope.expected = 1;
            $rootScope.actual = 0.5;

            var element = $compile('<progress-indicator expected="expected" actual="actual"></progress-indicator>')($rootScope);
            $rootScope.$digest();
            setTimeout(function() {
                expect(element[0].querySelector('.actual-arc').getAttribute('d')).toEqual("M5.939536975864663e-15,-97A97,97 0 1,1 5.939536975864663e-15,97L5.878304635907295e-15,96A96,96 0 1,0 5.878304635907295e-15,-96Z");
                done();
            }, 900)
        });

        it('should change size if size assigned', function() {
            $rootScope.expected = 1;
            $rootScope.actual = 0.5;
            var element = $compile('<progress-indicator expected="expected" actual="actual" size="500"></progress-indicator>')($rootScope);
            $rootScope.$digest();
            expect(element[0].querySelector('svg').getAttribute('width')).toBe("500");
            expect(element[0].querySelector('svg').getAttribute('height')).toBe("500");
        });

    });

    describe('invalidMessage', function() {

        it('should show message on invalid input', function() {
            $rootScope.expected = 'weg';
            $rootScope.actual = 33;

            var element = $compile('<div invalid-message expected="expected" actual="actual"></div>')($rootScope);
            $rootScope.$digest();

            expect(element.html()).toContain('Invalid Value');
        });

        it('should not show message on valid input', function() {
            $rootScope.expected = 0.2;
            $rootScope.actual = 1;

            var element = $compile('<div invalid-message expected="expected" actual="actual"></div>')($rootScope);
            $rootScope.$digest();

            expect(element.html()).not.toContain('Invalid Value');
        });
    });
});

