document.addEventListener('DOMContentLoaded', function () {
  var highlight = document.location.hash.match(/#(\d+)/)
  if (highlight) {
    var p = window.location.search.substring(1).split(',')
    for (var index = parseInt(p[0]); index <= parseInt(p[1]); index++) {
      document.getElementById(index).classList.add('highlight')
    }
  }
  var collapse = document.querySelectorAll('td.collapse div')
  if (collapse.length) {
    for (var x = 0; x < collapse.length; x++) {
      collapse[x].addEventListener('click', function (event) {
        var short = event.target.parentElement.parentElement.querySelector('.description.short')
        var long = event.target.parentElement.parentElement.querySelector('.description.detailed')
        if (event.target.classList.contains('expanded')) {
          short.classList.remove('hidden')
          long.classList.add('hidden')
        } else {
          long.classList.remove('hidden')
          short.classList.add('hidden')
        }
        event.target.classList.toggle('expanded')
      })
    }
  }
})
