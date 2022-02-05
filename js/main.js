/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ranveer Singh Saini Student ID: 134213206 Date: 2022-02-05
*  Heroku Link: https://web422-ranveer-assignment.herokuapp.com/
*
********************************************************************************/ 
var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

function avg(grades){
    var total=0;
    var avg = 0;
    for(i=0; i < grades.length; i++){
        total += grades[i].score;
    }
    
    avg = total/grades.length;
    return (avg.toFixed(2));
};

//const tableRows = _.template('<% _.forEach(restaurant,function(restaurant){%><tr data-id="<%-restaurant._id%>"><td><%-restaurant.name%></td><td><%-restaurant.cuisine%></td><td><%-restaurant.address.building%><%-restaurant.address.street%></td><td><%-avg(restaurant.grades)%></td></tr>}); %>')
const tableRows = _.template(` 
<% _.forEach(restaurantData, function(restaurant) { %>
   <tr data-id=<%-restaurant._id%>>
    <td><%-restaurant.name%></td
   
    <td><%-restaurant.address.building%> + <%=restaurant.address.street%></td>
    <td><%-restaurant.cuisine%></td>
    <td><%-restaurant.address.building%> <%-restaurant.address.street%></td>
    <td><%-avg(restaurant.grades)%></td>
    </tr>
<% }); %>`);

function loadRestaurantData(){
  fetch(`https://web422-ranveer-assignment.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
  .then(data=>data.json())
  .then(function(data){
       restaurantData = data;
       var tempData = tableRows({restaurant: data});
       $("tbody").html(tempData);
      $("#current-page").html(page);

  }).catch(err => console.log("Unable to read info" + err));
};

$(function(){
  loadRestaurantData();
  $("tbody").on("click", "tr", function(){ 
     for(i=0;i < restaurantData.length; i++ ){
         if($(this).attr("data-id")== restaurantData[i]._id){
             currentRestaurant=restaurantData[i];
         }
     }
     $(".modal-title").html(currentRestaurant.name);
     $("#restaurant-address").html(`${currentRestaurant.address.building} ${currentRestaurant.address.street}`);
     $("#restaurant-modal").modal('show')
  });
  
  $("li").on("click", "#previous-page", function(){
    if(page > 1){
        page--;
        loadRestaurantData();
    }
    
  });

  $("li").on("click", "#next-page", function(){  
    page++;
    loadRestaurantData();  
  });

  $('#restaurant-modal').on('shown.bs.modal', function () {
    map = new L.Map('leaflet', {
        center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
        zoom: 18,
        layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ]
    }); 
    L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
  });

  $('#restaurant-modal').on('hidden.bs.modal', function () {
      map.remove();
  });

});

//$("#demo").html(); //works as console

