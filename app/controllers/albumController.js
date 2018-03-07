app.controller("albumController", function($scope, photoBrowseUtil, $http, $window) {
    var queryString = getUrlVars();
    var albumId = queryString['albumid'];
    var uploadPhotos;
    $scope.searchAlbumByTitle  = "";
    $scope.editAlbumMode = false;
    $scope.showEditPhotoTitlePanel = false;
    var uploadPhotosInNewAlbum;

    //if this function call is being done from album.html
    if (typeof albumId != 'undefined') {
        var getAlbumTitlePromise = photoBrowseUtil.getAlbumTitle(albumId);
        getAlbumTitlePromise.then(function(response){
                $scope.albumTitle = response.data.title;
                $scope.userId = response.data.userId;
                $scope.albumId = response.data.id;
            },
            function(err){
                console.log("Error while calling getAlbumTitle", err);
            });
    }

    var albumsPromise = photoBrowseUtil.getAlbums();
    albumsPromise.then(function(response) {
            $scope.newAlbumId = response.data.length + 1;
        },
        function(err) {
            console.log("Error in getAlbumServiceCall", err);
    });

    $scope.editAlbum = function() {
        $scope.editAlbumMode = true;
    };

    $scope.saveEditAlbum = function() {
        $scope.editAlbumMode = false;
        var data =  {
            "userId": $scope.userId,
            "id": $scope.albumId,
            "title": $scope.albumTitle
        };

        var albumEditServiceCallPromise = photoBrowseUtil.editAlbum(data);
        albumEditServiceCallPromise.then(
            function(response) {
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Update Successful. The response status of put call is: "+response.statusText+". Note: The resource will not be really updated on" +
                    " the server but it will be faked as if. This is why album title is not actually updated in our application" );
            },
            function(response) {
                console.log("Service doesn not exist.");
                console.log("Update album status", response.statusText);
                console.log("headers",response.headers);
            }
        );
    };

    $scope.cancelEdit = function() {
        $scope.editAlbumMode = false;
    }

    //checking if it's in album.html page, album.html get albumId through query string parameter
    if(typeof albumId != 'undefined') {
        var photosInSelectedAlbumsPromise = photoBrowseUtil.getPhotosInAlbum(albumId);
    }
    //checking if it's in creatAlbum.html page
    else {
        var photosInSelectedAlbumsPromise = photoBrowseUtil.getPhotosInAlbum($scope.newAlbumId);
    }
    photosInSelectedAlbumsPromise.then(function(response) {
        $scope.photosInSelectedAlbums = response.data;
        },
        function (err) {
            console.log("Error while calling getPhotosInAlbum", err);
    });

    //To make the photo title visible on mouse enter and disappear on mouse leave
    $('body').on('mouseenter', '.photoDiv', function() {
        $(this).find('.photoCaption').fadeIn();
    });

    $('body').on('mouseleave', '.photoDiv', function() {
        $(this).find('.photoCaption').fadeOut();
    });

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("img01");

    var captionText = document.getElementById("title");

    $scope.onPhotoClick = function(photo) {
        $window.photo = photo;
        modal.style.display = "block";
        modalImg.src = photo.url;
        captionText.innerHTML = photo.title;
        $('.close').click(function(event){
            modal.style.display = "none";
        });
    };

    $scope.showFileSelector = function(){
        $("#fileLoader").click();
        $("#fileLoader").one('change', function (elem) {
            uploadPhotos(elem);
        });
    };

    uploadPhotos = function(elem) {
        if (!elem.target.value)
            return false;

        //TODO: data is static content right now, when integrating with backend service for file upload "data" object should have values set dynamically
        //TODO contd: for title, url, thumbnailUrl, id.

        ////if this function call is being done from createNewAlbum.html
        if (typeof albumId == 'undefined') {
            var data =  {
                "albumId": $scope.newAlbumId,
                "id": 5001,
                "title": "accusamus beatae ad facilis cum similique qui sunt",
                "url": "http://placehold.it/600/92c952",
                "thumbnailUrl": "http://placehold.it/150/92c952"
            };


        }
        //if this function call is being done from album.html page
        else {
            var data =  {
                "albumId": albumId,
                "id": 5001, //to be added dynamically
                "title": "accusamus beatae ad facilis cum similique qui sunt", //to be added dynamically
                "url": "http://placehold.it/600/92c952", //to be added dynamically
                "thumbnailUrl": "http://placehold.it/150/92c952" //to be added dynamically
            };
        }

        var photoAddServiceCallPromise = photoBrowseUtil.addPhoto(data);
        photoAddServiceCallPromise.then(
            function(response){
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Upload Successful. The response status of post call is: "+response.statusText+". Note: The resource will not be really created on" +
                    " the server but it will be faked as if. This is why photo is not actually added in our application" );
            },
            function(response) {
                console.log("Service doesn't not exist.");
                console.log("Service status", response.statusText);
                console.log("Headers.", response.headers);
            }
        );
    };

    $scope.deletePhoto = function() {
        var photoIdToDelete = $window.photo.id;
        var photoDeleteServiceCallPromise = photoBrowseUtil.deletePhoto(photoIdToDelete);
        photoDeleteServiceCallPromise.then(
            function(response){
                modal.style.display = "none";
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Delete Successful. The response status of the delete call is: "+response.statusText+". Note: the resource will not be really deleted on the server but it will be faked as if." +
                    " This is why photo is not actually removed in our application.");
            },
            function(response) {
                console.log("Delete photo service call fail.");
            }
        )
    };

    $scope.editPhoto = function(photoTitle){
        $scope.showEditPhotoTitlePanel = false;
        captionText.innerHTML = photoTitle;
        var selectedPhoto = $window.photo;
        var photoIdToEdit = $window.photo.id;

        var data =  {
            "albumId": selectedPhoto.albumId,
            "id": selectedPhoto.id,
            "title": photoTitle,
            "url": selectedPhoto.url,
            "thumbnailUrl": selectedPhoto.thumbnailUrl
        };

        var photoEditServiceCallPromise = photoBrowseUtil.editPhoto(photoIdToEdit, data);
        photoEditServiceCallPromise.then(
            function(response){
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Update Successful. The response status of put call is: "+response.statusText+". Note: The resource will not be really updated on" +
                    " the server but it will be faked as if. This is why photo is not actually updated in our application" );
            },
            function(response) {
                console.log("Service doesn't not exist.");
            }
        );
     };

    $scope.showSavePanel = function(){
        $scope.showEditPhotoTitlePanel = true;
    };

    $scope.saveNewAlbumCreated = function() {
        var data = {
            "userId": 1, //we don't have login implemented in our case, userId can be the existing userId or new userId, this is static right now
            "id": newAlbumId,
            "title": $scope.newAlbumTitle
        }
        var albumAddServiceCallPromise = photoBrowseUtil.addNewAlbum(data);
        albumAddServiceCallPromise.then(
            function(response){
                //this alert is just for the additional information, this code should be removed when we are dealing with actual REST API instead of this fake.
                alert("Upload Successful. The response status of post call is: "+response.statusText+". Note: The resource will not be really created on" +
                    " the server but it will be faked as if. This is why photo is not actually added in our application" );
            },
            function(response) {
                console.log("Service doesn't not exist.");
                console.log("Service status", response.statusText);
                console.log("Headers.", response.headers);
            }
        );
    };

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
});
