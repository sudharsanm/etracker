var myApp = angular.module('trackDetailApp',[]);

myApp.controller('TrackDetailCtrl', ['$scope','$http','$location',
function($scope,$http,$location){
    
    var GetYearMonth = function (date) {
        var year=date.getFullYear();
        var month=date.getMonth()+1;
            if (month<10){
            month="0" + month;
            };
        var day=date.getDate();   
        return year + "-" + month; 
    }
    
    var refresh = function() {
        console.log('Inside response');
        var monthYear = $location.search().MonthYear ||  GetYearMonth(new Date());
        $http.get('/trackDetail',{params :{"MonthYear":monthYear}}).success(function(response) {
            console.log(response);
            $scope.trackList = response;   
            $scope.track = "";
        });
    };
    
    refresh();
    
    $scope.deleteTrackDetail = function(id) {
        console.log(id);
        $http.delete('/trackDetail/'+ id).then(
            function (success) {
                console.log('Delete Success');
                refresh();
            },
            function (error) {
                console.log('Delete falied');
            }
        );
    };
     
     $scope.editTrackDetail = function(id) {
        console.log(id);
        $http.get('/trackDetail/'+ id).then(
            function (success) {
                console.log('GET By ID Success' + success.data);
                $scope.track = success.data;
            },
            function (error) {
                console.log('GET By ID falied');
            }
        );
     };
     
     $scope.updateTrackDetail = function(id, amt) {
         console.log(id);
         var recordInfo = {
            Amount : amt
        }
        $http.put('/trackDetail/'+ id,recordInfo).then(
            function (success) {
                console.log('Put Success');
                refresh();
            },
            function (error) {
                console.log(error);
                console.log('Put falied');
            }
        );
    };
    
    $scope.clearTrackDetail = function() {
        $scope.track = "";
    };
    
    $scope.OpenTrackPage = function() {
        var currentPath = $location.absUrl();
        currentPath = currentPath.replace("/Detail","/Track");
        currentPath = currentPath.replace("/detail","/Track");
        console.log(currentPath);
        window.location.href = currentPath;
   };
}]);

// function CategoryCtrl()
// {
//     console.log("Hello World from controller");
    

    
// }