function RuleSet(arrayUtils) {

    function RuleSet(survive, create) {
        this.survive = survive;
        this.create = create;
    }

    RuleSet.empty = function() {
        return new RuleSet(arrayUtils.makeArray1(10, false), arrayUtils.makeArray1(10, false));
    };

    RuleSet.parseText = function(rulesText) {
        var rules = RuleSet.empty();
        var rulePart = rules.survive;
        var i;
        for (i = 0; i < rulesText.length; i++) {
            var current = rulesText.charAt(i);
            if (current === '/') {
                rulePart = rules.create;
            } else {
                var parsedInt = parseInt(current);
                rulePart[parsedInt] = true;
            }
        }
        return rules;
    };

    return RuleSet;

}

angular.module('gameOfLife')
    .factory('RuleSet', RuleSet);