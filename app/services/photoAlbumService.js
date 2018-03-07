app.factory('photoBrowseUtil', function($http) {

    var getUserList,
        getAlbums,
        getAllPhotos,
        getPhotosInAlbum,
        deletePhoto,
        addPhoto,
        editPhoto,
        deleteAlbum,
        getAlbumTitle,
        editAlbum,
        addNewAlbum;

    var root = "http://jsonplaceholder.typicode.com";

    getUserList = function() {
        return $http.get(root+"/users");
    };

    getAlbums = function(){
        return $http.get(root+"/albums");
    };

    getAllPhotos = function(){
        return $http.get(root+"/photos");
    };

    getPhotosInAlbum = function(albumId){
        return $http.get(root +"/albums/"+albumId+"/photos");
    };

    deletePhoto = function(photoId) {
        return  $http.delete(root+"/photos/"+photoId);
    };

    addPhoto = function(data) {
        return $http.post(root+"/photos", JSON.stringify(data));
    };

    editPhoto = function(photoId, data) {
        return $http.put(root+"/photos/"+photoId, JSON.stringify(data));
    };

    deleteAlbum = function(albumId) {
        return  $http.delete(root+"/albums/"+albumId);
    };

    getAlbumTitle = function(albumId) {
        return $http.get(root +"/albums/"+albumId);
    };

    editAlbum = function(data) {
        return $http.put(root+"/albums/"+data.id, JSON.stringify(data));
    };

    addNewAlbum = function(data) {
        return $http.post(root+"/albums", JSON.stringify(data));
    };

    return {
        getUserList: getUserList,
        getAlbums : getAlbums,
        getAllPhotos : getAllPhotos,
        getPhotosInAlbum : getPhotosInAlbum,
        deletePhoto : deletePhoto,
        addPhoto : addPhoto,
        editPhoto : editPhoto,
        deleteAlbum : deleteAlbum,
        getAlbumTitle: getAlbumTitle,
        editAlbum: editAlbum,
        addNewAlbum: addNewAlbum
    }
});
