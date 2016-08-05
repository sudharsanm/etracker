var myApp = angular.module('TrackApp', []);
myApp.controller('TrackCtrl', ['$scope','$http','$location',
function($scope, $http, $location){
    
    var GetYearMonth = function (date) {
        var year=date.getFullYear();
        var month=date.getMonth()+1;
            if (month<10){
            month="0" + month;
            };
        var day=date.getDate();   
        return year + "-" + month; 
    }
    
    var GetTodaysDate = function () {
        var date = new Date();
        var year=date.getFullYear();
        var month=date.getMonth();
            if (month<10){
            month="0" + month;
            };
        var day=date.getDate();
        //Adding 5, 30, 1 to make the time suits for universial
        return new Date(year, month, day,5,30,1);   
    }
    
    var SetMonth = function() {
        var yearMonth = $location.search().MonthYear;
        if(yearMonth !== undefined)
        {
            return new Date(yearMonth.split('-')[0], parseInt(yearMonth.split('-')[1])-1, 1,5,30,1)
        }
        else
        {
            return GetTodaysDate();
        }
    }
    
    $scope.selectedMonth =  SetMonth();
    console.log($scope.selectedMonth);
    
    $scope.monthSum = {
         _id: null,
         Total:  0, 
       };
    
    var GetSum = function(id) {
        //console.log(id);
        $http.get('/TrackSum/'+ id).then(
            function (success) {
                console.log('GET Sum By ID Success' + success.data[0]);
                $scope.monthSum = success.data[0];
                GetCategorySum(id);
            },
            function (error) {
                console.log('GET Sum By ID falied');
            }
        );
     };
     
     
     var GetCategorySum = function(id) {
        //console.log(id);
        $http.get('/CategoryWiseTrack/'+ id).then(
            function (success) {
                console.log('CategoryWiseTrack Success' + success.data);
                $scope.CategoryWiseTrack = success.data;
            },
            function (error) {
                console.log('CategoryWiseTrack falied');
            }
        );
     };
     
     var GetCategories = function() {
        $http.get('/categoriesForCombo').then(
            function (success) {
                console.log('categories Success' + success.data);
                $scope.Categories = success.data;
                $scope.data.Category = success.data[0];
            },
            function (error) {
                console.log('categories falied');
            }
        );
     };
     
     GetCategories();
     
     var ResetControls = function(isDefault) {
       $scope.data = {
         TrackDate:  GetTodaysDate(), 
         Amount : ""  ,
         Description : ""
       };

       if(!isDefault){
         $scope.data.Category = $scope.Categories[0];
       }
    };
    
    ResetControls(true);
    GetSum(GetYearMonth($scope.selectedMonth));
    //GetSum(GetYearMonth(new Date())); 
    
    $scope.addTrack = function() {
        
        var trackEntry = {
            Description : $scope.data.Description,
            Amount : $scope.data.Amount,
            TrackDate : $scope.data.TrackDate,
            Category : $scope.data.Category.CategoryName
        }
        
        console.log(trackEntry);
        $http.post('/Track',trackEntry).then(
            function(response) {
            console.log('calling response after add');
            console.log(response);
            GetSum(GetYearMonth(new Date()));
            ResetControls(false);
        },
        function(error) {
            console.log('Error Block'+ error);
        });
    };
    
    $scope.onMonthChange = function () {
        GetSum(GetYearMonth($scope.selectedMonth)); 
    }
    
    $scope.clearTrack = function () {
        ResetControls();
    }
    
    $scope.DetailTrack = function () {
        console.log('Redirecting to Detail');
        var currentPath =$location.absUrl();
        currentPath = currentPath.replace("/Track","/Detail");
        currentPath = currentPath.replace("/track","/Detail");
        var paramPosition = currentPath.indexOf('#'); 
        if(paramPosition> 1)
            currentPath = currentPath.substring(0,paramPosition);
        currentPath = currentPath + "#/?MonthYear=" + GetYearMonth($scope.selectedMonth);
        console.log(currentPath);
        window.location.href = currentPath;
        //console.log($location.absUrl());
    }
    
    $scope.openCategory = function () {
        var currentPath =$location.absUrl();
        currentPath = currentPath.replace("/Track","/Category");
        currentPath = currentPath.replace("/track","/Category");
        var paramPosition = currentPath.indexOf('#'); 
        if(paramPosition> 1)
            currentPath = currentPath.substring(0,paramPosition);
        console.log(currentPath);
        window.location.href = currentPath;
        //console.log($location.absUrl());
    }
    
}]);