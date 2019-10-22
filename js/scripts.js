var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      repository.push(pokemon);
    } else {
      console.log("add an object");
    }
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      var $pokemonList = $(".list-group");

      var $button = $(
        '<button type="button" class="btn list-item list-group-item" data-toggle="modal" data-target="#exampleModal"></button>'
      );
      $button.text(pokemon.name);

      $pokemonList.append($button);

      $button.on("click", function(event) {
        showDetails(pokemon);
      });
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      showModal(item);
    });
  }

  function loadList() {
    return $.ajax(apiUrl)
      .then(function(json) {
        json.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function showModal(item) {
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    modalTitle.empty();
    modalBody.empty();
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $('<img class="modal-img">');
    imageElement.attr("src", item.imageUrl);
    var imageElementBack = $('<img class="modal-img">');
    imageElementBack.attr("src", item.imageUrlBack);
    var heightElement = $("<p>" + "Height : " + item.height + "</p>");

    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
