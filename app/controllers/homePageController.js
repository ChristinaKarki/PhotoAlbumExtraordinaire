app.controller("homePageController", function($scope, photoBrowseUtil, $q, $location) {

    var userListPromise= photoBrowseUtil.getUserList();
    var albumsPromise = photoBrowseUtil.getAlbums();
    var photoListPromise = photoBrowseUtil.getAllPhotos();
    var userKeyValuePair = {};
    var albumPhotoCountMap = {};
    var photoAlbumsKeyValuePair = [];
    $scope.deleteIconNotClicked = true;
    $scope.sortType = 'title'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchPhotoByTitle  = "";

    $q.all({userListPromise : userListPromise, albumsPromise : albumsPromise, photoListPromise : photoListPromise}).then(
        function(response) {
            var userList= response.userListPromise.data;
            var albums = response.albumsPromise.data;
            var photoList = response.photoListPromise.data;
            $scope.photoListLenght = photoList.length;
            angular.forEach(userList, function(value, key) {
                userKeyValuePair[value.id] = value.name;
            });

            angular.forEach(photoList, function(value, key) {
                if(!albumPhotoCountMap[value.albumId]){
                    albumPhotoCountMap[value.albumId] = 1;
                }else{
                    albumPhotoCountMap[value.albumId] += 1;
                }
            });

            angular.forEach(albums, function(value, key) {
                var photoAlbums = {};
                photoAlbums["index"] = key;
                photoAlbums["id"] = value.id;
                photoAlbums["title"] = value.title;
                photoAlbums["userId"] = value.userId;
                photoAlbums["owner"] = userKeyValuePair[value.userId];
                photoAlbums["photoCount"] = albumPhotoCountMap[value.id];
                photoAlbumsKeyValuePair.push(photoAlbums);
            });

            $scope.photoAlbumsKeyValuePair = photoAlbumsKeyValuePair;
        },
        function(err) {
            console.error('userList and albums failed with error', err);
        }
    );

    $scope.deleteAlbum = function(index, albumId) {
        var albumDeleteServiceCallPromise = photoBrowseUtil.deleteAlbum(albumId);
        albumDeleteServiceCallPromise.then(
            function(response){
                $scope.photoAlbumsKeyValuePair.splice(index, 1);
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Delete Successful. The response status of the delete call is: "+response.statusText+". Note: the resource will not be really deleted on the server but it will be faked as if." +
                    " This is why photo is not actually removed in our application.");

            },
            function(response) {
                console.log("Delete photo service call fail.");
            }
        )
    };

});




