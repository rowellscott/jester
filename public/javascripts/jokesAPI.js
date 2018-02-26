const jokesAPI = new APIHandler("http://localhost:8000/jokes")

$(document).ready( () => {
jokesAPI.getFullList();

})