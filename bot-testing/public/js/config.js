if (document.location.hostname == "80shops.com" || document.location.hostname == "www.80shops.com"){
	var hostURL = "http://80shops.com";
	var baseURL = "http://www.80shops.com/api/";
	var imageURL = "http://www.80shops.com/assets/";

	 //var baseUrl = hostURL + "/api/";
	 var adminUrl = hostURL + "/admin/#/profile";

} else {
	var hostURL = "http://localhost:7000";
	var baseURL = "http://localhost:7000/api/";
	//var baseURL = "https://www.createmobileshop.com/api/";
	var imageURL = "http://www.80Shops.com/assets/";
	var adminUrl = hostURL + "/admin/#/profile";
}
