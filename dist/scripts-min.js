var pokemonRepository = (function() {
  var t = [],
    o = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function e(o) {
    "object" == typeof o && "name" in o && "detailsUrl" in o
      ? t.push(o)
      : console.log("add an object");
  }
  function n(t) {
    var o = $(".modal-body"),
      e = $(".modal-title");
    e.empty(), o.empty();
    var n = $("<h1>" + t.name + "</h1>"),
      a = $('<img class="modal-img">');
    a.attr("src", t.imageUrl);
    var i = $("<p>Height : " + t.height + "</p>");
    e.append(n), o.append(a), o.append(i);
  }
  return {
    add: e,
    getAll: function() {
      return t;
    },
    addListItem: function(t) {
      pokemonRepository.loadDetails(t).then(function() {
        var o = $(".list-group"),
          e = $(
            '<button type="button" class="btn list-item list-group-item" data-toggle="modal" data-target="#exampleModal"></button>'
          );
        e.text(t.name),
          o.append(e),
          e.on("click", function(o) {
            var e;
            (e = t),
              pokemonRepository.loadDetails(e).then(function() {
                console.log(e), n(e);
              });
          });
      });
    },
    loadList: function() {
      return $.ajax(o)
        .then(function(t) {
          t.results.forEach(function(t) {
            var o = { name: t.name, detailsUrl: t.url };
            e(o), console.log(o);
          });
        })
        .catch(function(t) {
          console.error(t);
        });
    },
    loadDetails: function(t) {
      var o = t.detailsUrl;
      return $.ajax(o)
        .then(function(o) {
          (t.imageUrl = o.sprites.front_default),
            (t.height = o.height),
            (t.types = Object.keys(o.types));
        })
        .catch(function(t) {
          console.error(t);
        });
    },
    showModal: n
  };
})();
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(t) {
    pokemonRepository.addListItem(t);
  });
});
