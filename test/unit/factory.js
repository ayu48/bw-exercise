'use strict'

describe('factories', function() {
    var utilities;

    describe('Utilities: isValid', function() {
        beforeEach(function() {
            module('BWProgress');
            inject(function($injector) {
                utilities = $injector.get('Utilities');
            });
        });

        it('should return false if not number', function() {
            expect(utilities.isValid('string')).toBe(false);
        });

        it('should return false if larger than 1 and smaller than 0', function() {
            expect(utilities.isValid(4)).toBe(false);
            expect(utilities.isValid(-4)).toBe(false);
        });

        it('should return true if larger than 0 and smaller than 1', function() {
            expect(utilities.isValid(1)).toBe(true);
            expect(utilities.isValid(0.2)).toBe(true);
        });
    });
});

