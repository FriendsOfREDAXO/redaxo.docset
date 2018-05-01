document.addEventListener('DOMContentLoaded', function () {
  var match = document.location.hash.match(/#(\d+)/)
  if (match) {
    let p = window.location.search.substring(1).split(',')
    for (let index = parseInt(p[0]); index <= parseInt(p[1]); index++) {
      document.getElementById(index).classList.add('highlight')
    }
  }
})
