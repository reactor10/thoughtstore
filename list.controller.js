(function() {
    angular
        .module("ThoughtWorks")
        .controller("ThoughtListCtrl", ThoughtListCtrl);

    ThoughtListCtrl.$inject = ["$rootScope", "$scope", "ThoughtService"];
    function ThoughtListCtrl($rootScope, $scope, ThoughtService) {
        var vm = this;

        reset();
        init();

        function reset() {
            vm.journal = "default";
            vm.posts = {};
            vm.hasPosts = false;
        }

        function init() {
            ThoughtService.list().then(function(res) {
                vm.posts = ThoughtService.transform(res.data);
                vm.hasPosts = (Object.keys(vm.posts).length > 0);
            });
        }

        $rootScope.$on("thoughtAdded", function(evt, thought) {
            if(!vm.posts[thought.group]) {
                vm.posts[thought.group] = {
                    group: thought.group,
                    thoughts: [thought]
                }
            } else {
                vm.posts[thought.group].thoughts.push(thought);
            }

            vm.hasPosts = true;
        });

        $scope.$on("deleteThought", function(evt, thought) {
            console.log("deleteThought")
            evt.stopPropagation();

            ThoughtService.remove(thought).then(function() {
                var ths = vm.posts[thought.group].thoughts;
                ths.splice(ths.indexOf(thought), 1);

                if(ths.length === 0) {
                    delete vm.posts[thought.group];
                }

                vm.hasPosts = (Object.keys(vm.posts).length > 0);
            });
        });

        $scope.$on("auth:loggedIn", function() {
            init();
        });

        $scope.$on("auth:loggedOut", function() {
            reset();
        });
    };
})();
